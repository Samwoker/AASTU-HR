import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import FormField from "../../common/FormField";
import { FiMail, FiUser, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCreateAccountSlice } from "../../../pages/Admin/CreateAccount/slice";
import {
  selectCreateAccountLoading,
  selectCreateAccountError,
  selectCreateAccountSuccess,
} from "../../../pages/Admin/CreateAccount/slice/selectors";
import { USER_ROLES } from "../../../../utils/constants";
import ToastService from "../../../../utils/ToastService";
import adminService, {
  Department,
  JobTitle,
  AllowanceType,
  Employee,
} from "../../../services/adminService";

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface AllowanceEntry {
  allowance_type_id: string;
  amount: string;
  effective_date: string;
}

const EMPLOYMENT_TYPES = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
];

export default function CreateUserForm({
  onSuccess,
  onCancel,
}: CreateUserFormProps) {
  const dispatch = useDispatch();
  const { actions } = useCreateAccountSlice();
  const loading = useSelector(selectCreateAccountLoading);
  const error = useSelector(selectCreateAccountError);
  const success = useSelector(selectCreateAccountSuccess);

  // Dropdown data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form state
  const [form, setForm] = useState({
    // Account
    email: "",
    role: USER_ROLES.EMPLOYEE,
    // Personal Info
    fullName: "",
    gender: "Male",
    dateOfBirth: "",
    tinNumber: "",
    pensionNumber: "",
    // Employment
    employmentType: "Full Time",
    grossSalary: "",
    departmentId: "",
    jobTitleId: "",
    managerId: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Allowances (multiple)
  const [allowances, setAllowances] = useState<AllowanceEntry[]>([]);

  // Fetch dropdown data on mount
  const fetchDropdownData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [depts, jobs, allowTypes, emps] = await Promise.all([
        adminService.getDepartments(),
        adminService.getJobTitles(),
        adminService.getAllowanceTypes(),
        adminService.getEmployees(),
      ]);
      setDepartments(depts);
      setJobTitles(jobs);
      setAllowanceTypes(allowTypes);
      setEmployees(emps);
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
      ToastService.error("Failed to load form data. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  // Reset form on success
  useEffect(() => {
    if (success) {
      ToastService.success("Employee created successfully! Welcome email sent.");
      dispatch(actions.resetState());
      onSuccess();
    }
  }, [success, dispatch, actions, onSuccess]);

  // Show error if any
  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  const roles = [
    { label: "Employee", value: USER_ROLES.EMPLOYEE },
    { label: "HR", value: USER_ROLES.HR },
    { label: "Admin", value: USER_ROLES.ADMIN },
  ];

  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Allowance handlers
  const addAllowance = () => {
    setAllowances([
      ...allowances,
      {
        allowance_type_id: "",
        amount: "",
        effective_date: form.startDate || new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const removeAllowance = (index: number) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  const handleAllowanceChange = (
    index: number,
    field: keyof AllowanceEntry,
    value: string
  ) => {
    const updated = [...allowances];
    updated[index][field] = value;
    setAllowances(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.email || !form.fullName || !form.dateOfBirth) {
      ToastService.error("Please fill in all required fields.");
      return;
    }

    if (!form.departmentId || !form.jobTitleId) {
      ToastService.error("Please select Department and Job Title.");
      return;
    }

    // Prepare allowances array
    const validAllowances = allowances
      .filter((a) => a.allowance_type_id && a.amount)
      .map((a) => ({
        allowance_type_id: Number(a.allowance_type_id),
        amount: Number(a.amount),
        effective_date: a.effective_date,
      }));

    dispatch(
      actions.createAccountRequest({
        email: form.email,
        role: form.role,
        employee: {
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          tinNumber: form.tinNumber || undefined,
          pensionNumber: form.pensionNumber || undefined,
          employment: {
            employmentType: form.employmentType,
            grossSalary: Number(form.grossSalary) || 0,
            departmentId: Number(form.departmentId),
            jobTitleId: Number(form.jobTitleId),
            managerId: form.managerId || undefined,
            startDate: form.startDate,
          },
        },
        allowances: validAllowances.length > 0 ? validAllowances : undefined,
      })
    );
  };

  // Map data to options format
  const departmentOptions = departments.map((d) => ({
    label: d.name,
    value: String(d.id),
  }));

  const jobTitleOptions = jobTitles.map((j) => ({
    label: `${j.title} (${j.level})`,
    value: String(j.id),
  }));

  const allowanceTypeOptions = allowanceTypes.map((a) => ({
    label: a.name,
    value: String(a.id),
  }));

  const managerOptions = [
    { label: "No Manager", value: "__none__" },
    ...employees.map((e) => ({
      label: `${e.full_name} (${e.employee_id})`,
      value: e.employee_id,
    })),
  ];

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-k-orange"></div>
        <span className="ml-3 text-gray-600">Loading form data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Section 1: Account Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-k-dark-grey border-b pb-2">
          <FiMail className="inline mr-2" />
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email Address"
            type="email"
            name="email"
            placeholder="e.g. employee@kacha.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormField
            label="Role"
            type="select"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={roles}
          />
        </div>
      </div>

      {/* Section 2: Personal Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-k-dark-grey border-b pb-2">
          <FiUser className="inline mr-2" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="e.g. Abebe Kebede"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <FormField
            label="Gender"
            type="select"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={genders}
          />
          <FormField
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
          <FormField
            label="TIN Number"
            type="text"
            name="tinNumber"
            placeholder="Optional"
            value={form.tinNumber}
            onChange={handleChange}
          />
          <FormField
            label="Pension Number"
            type="text"
            name="pensionNumber"
            placeholder="Optional"
            value={form.pensionNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Section 3: Employment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-k-dark-grey border-b pb-2">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Employment Type"
            type="select"
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
            options={EMPLOYMENT_TYPES}
          />
          <FormField
            label="Gross Salary"
            type="number"
            name="grossSalary"
            placeholder="e.g. 15000"
            value={form.grossSalary}
            onChange={handleChange}
            required
          />
          <FormField
            label="Department"
            type="select"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            options={departmentOptions}
            required
          />
          <FormField
            label="Job Title"
            type="select"
            name="jobTitleId"
            value={form.jobTitleId}
            onChange={handleChange}
            options={jobTitleOptions}
            required
          />
          <FormField
            label="Manager"
            type="select"
            name="managerId"
            value={form.managerId || "__none__"}
            onChange={(e) =>
              setForm({
                ...form,
                managerId: e.target.value === "__none__" ? "" : e.target.value,
              })
            }
            options={managerOptions}
          />
          <FormField
            label="Start Date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Section 4: Allowances */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-k-dark-grey">
            Allowances (Optional)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAllowance}
            icon={FiPlus}
          >
            Add Allowance
          </Button>
        </div>

        {allowances.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No allowances added. Click "Add Allowance" to add one.
          </p>
        ) : (
          <div className="space-y-4">
            {allowances.map((allowance, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg items-end"
              >
                <FormField
                  label="Type"
                  type="select"
                  name={`allowance_type_${index}`}
                  value={allowance.allowance_type_id}
                  onChange={(e) =>
                    handleAllowanceChange(index, "allowance_type_id", e.target.value)
                  }
                  options={allowanceTypeOptions}
                />
                <FormField
                  label="Amount"
                  type="number"
                  name={`allowance_amount_${index}`}
                  placeholder="0.00"
                  value={allowance.amount}
                  onChange={(e) =>
                    handleAllowanceChange(index, "amount", e.target.value)
                  }
                />
                <FormField
                  label="Effective Date"
                  type="date"
                  name={`allowance_date_${index}`}
                  value={allowance.effective_date}
                  onChange={(e) =>
                    handleAllowanceChange(index, "effective_date", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeAllowance(index)}
                  icon={FiTrash2}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Employee
        </Button>
      </div>
    </form>
  );
}
