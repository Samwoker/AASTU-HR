import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateAccountSlice } from "../../Admin/CreateAccount/slice";
import {
  selectCreateAccountLoading,
  selectCreateAccountError,
  selectCreateAccountSuccess,
} from "../../Admin/CreateAccount/slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import aastuSpinner from "../../../components/common/AastuSpinner";
import useMinimumDelay from "../../../hooks/useMinimumDelay";
import { aastu_SPINNER_CYCLE_MS } from "../../../components/common/AastuSpinner";
import FormField from "../../../components/common/FormField";
import FormAutocomplete from "../../../components/common/FormAutocomplete";
import Button from "../../../components/common/Button";
import BackButton from "../../../components/common/BackButton";
import CreateItemModal from "../../../components/common/CreateItemModal";
import ToastService from "../../../../utils/ToastService";
import {
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiPlus,
  FiTrash2,
  FiMail,
} from "react-icons/fi";
import { USER_ROLES } from "../../../../utils/constants";
import adminService, {
  Department,
  JobTitle,
  AllowanceType,
  Employee,
} from "../../../services/adminService";

// Types
interface AllowanceEntry {
  name: string; // Changed from ID to name for autocomplete
  amount: string;
}

const EMPLOYMENT_TYPES = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
  { label: "Freelance", value: "Freelance" },
];

export default function CreateEmployee() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useCreateAccountSlice();

  const loading = useSelector(selectCreateAccountLoading);
  const error = useSelector(selectCreateAccountError);
  const success = useSelector(selectCreateAccountSuccess);

  // Dropdown Data State (for local filtering/fallback)
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingMainData, setIsLoadingMainData] = useState(true);

  // Function to refresh specific lists - Removed unused functions

  // Form State
  const [form, setForm] = useState({
    // Account
    email: "",
    role: USER_ROLES.EMPLOYEE,
    // Personal Info (Basic)
    fullName: "",
    // Employment
    employmentType: "Full Time",
    grossSalary: "",
    basicSalary: "",
    departmentName: "",
    jobTitleName: "",
    managerId: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [allowances, setAllowances] = useState<AllowanceEntry[]>([]);

  // Modal States
  const [createModalState, setCreateModalState] = useState<{
    isOpen: boolean;
    type: "department" | "jobTitle" | "allowance" | null;
    initialValue: string;
    targetIndex?: number; // For allowance list
  }>({
    isOpen: false,
    type: null,
    initialValue: "",
  });

  // Fetch Data
  const fetchDropdownData = useCallback(async () => {
    setIsLoadingMainData(true);
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
      ToastService.error("Failed to load form data.");
    } finally {
      setIsLoadingMainData(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  // Handle Success/Error
  useEffect(() => {
    if (success) {
      ToastService.success(
        "Employee created successfully!. Welcome email sent."
      );
      dispatch(actions.resetState());
      navigate("/admin/employees");
    }
  }, [success, dispatch, actions, navigate]);

  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAutocompleteChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const addAllowance = () => {
    setAllowances([
      ...allowances,
      {
        name: "", // Start empty
        amount: "",
      },
    ]);
  };

  const removeAllowance = (index: number) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  // Autocomplete Fetchers (Filtering local data for now)
  const filterDepartments = async (query: string) => {
    return departments
      .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
      .map((d) => d.name);
  };

  const filterJobTitles = async (query: string) => {
    return jobTitles
      .filter((j) => j.title.toLowerCase().includes(query.toLowerCase()))
      .map((j) => j.title);
  };

  const filterAllowanceTypes = async (query: string) => {
    return allowanceTypes
      .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
      .map((a) => a.name);
  };

  // Creation Handlers
  const handleOpenCreateModal = (
    type: "department" | "jobTitle" | "allowance",
    value: string,
    index?: number
  ) => {
    setCreateModalState({
      isOpen: true,
      type,
      initialValue: value,
      targetIndex: index,
    });
  };

  const handleCreateSubmit = async (values: Record<string, any>) => {
    try {
      if (createModalState.type === "department") {
        const newDept = await adminService.createDepartment(values.name);
        setDepartments((prev) => [...prev, newDept]);
        setForm((prev) => ({ ...prev, departmentName: newDept.name }));
        ToastService.success(`Department "${newDept.name}" created.`);
      } else if (createModalState.type === "jobTitle") {
        const newJob = await adminService.createJobTitle(
          values.title,
          values.level
        );
        setJobTitles((prev) => [...prev, newJob]);
        setForm((prev) => ({ ...prev, jobTitleName: newJob.title }));
        ToastService.success(`Job Title "${newJob.title}" created.`);
      } else if (createModalState.type === "allowance") {
        // Handle boolean conversion if needed
        const isTaxable =
          values.is_taxable === true || values.is_taxable === "true";
        const newAllowance = await adminService.createAllowanceType({
          name: values.name,
          description: values.description,
          is_taxable: isTaxable,
        });
        setAllowanceTypes((prev) => [...prev, newAllowance]);

        if (typeof createModalState.targetIndex === "number") {
          handleAllowanceChange(
            createModalState.targetIndex,
            "name",
            newAllowance.name
          );
        }
        ToastService.success(`Allowance Type "${newAllowance.name}" created.`);
      }
    } catch (err: any) {
      ToastService.error(err.message || "Failed to create item.");
    }
  };

  // Resolution Logic (Lookup ID)
  const resolveDepartment = (name: string): number | null => {
    const existing = departments.find(
      (d) => d.name.toLowerCase() === name.toLowerCase()
    );
    return existing ? existing.id : null;
  };

  const resolveJobTitle = (name: string): number | null => {
    // Note: If multiple job titles have same name but different level, looking up by Title string is ambiguous.
    // However, Autocomplete usually creates exact matches.
    // Ideally user selects "Senior Engineer" vs "Junior Engineer" if titles differ.
    // If titles are just "Software Engineer", we rely on the one that matches.
    // Simple lookup:
    const existing = jobTitles.find(
      (j) => j.title.toLowerCase() === name.toLowerCase()
    );
    return existing ? existing.id : null;
  };

  const resolveAllowanceType = (name: string): number | null => {
    const existing = allowanceTypes.find(
      (a) => a.name.toLowerCase() === name.toLowerCase()
    );
    return existing ? existing.id : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.email ||
      !form.fullName ||
      !form.grossSalary ||
      !form.departmentName ||
      !form.jobTitleName
    ) {
      ToastService.error("Please fill in all required fields.");
      return;
    }

    try {
      const basic = Number(form.basicSalary) || 0;
      const gross = Number(form.grossSalary) || 0;
      const allowanceTotal = allowances.reduce(
        (sum, a) => sum + (Number(a.amount) || 0),
        0
      );

      // Validation: Gross should equal Basic + Allowances
      // Using a small epsilon for floating point comparison if needed, but these are likely entered as exacts
      if (Math.abs(gross - (basic + allowanceTotal)) > 0.01) {
        return ToastService.error(
          `Compensation Mismatch: Base Salary (${basic}) + Allowances (${allowanceTotal}) must equal Gross Salary (${gross}). Difference: ${
            gross - (basic + allowanceTotal)
          }`
        );
      }

      const deptId = resolveDepartment(form.departmentName);
      if (!deptId)
        return ToastService.error(
          `Department "${form.departmentName}" not found. Please create it first.`
        );

      const jobId = resolveJobTitle(form.jobTitleName);
      if (!jobId)
        return ToastService.error(
          `Job Title "${form.jobTitleName}" not found. Please create it first.`
        );

      const validAllowances = [];
      for (const a of allowances) {
        if (a.name && a.amount) {
          const typeId = resolveAllowanceType(a.name);
          if (!typeId) {
            ToastService.error(
              `Allowance Type "${a.name}" not found. Please create it first.`
            );
            return;
          }
          validAllowances.push({
            allowance_type_id: typeId,
            amount: Number(a.amount),
            currency: "ETB",
            effective_date: form.startDate,
          });
        }
      }

      dispatch(
        actions.createAccountRequest({
          email: form.email,
          role: form.role,
          employee: {
            fullName: form.fullName,
            // Removed personal fields
            employment: {
              employmentType: form.employmentType,
              grossSalary: Number(form.grossSalary) || 0,
              basicSalary: Number(form.basicSalary) || 0,
              departmentId: deptId,
              jobTitleId: jobId,
              managerId: form.managerId || undefined,
              startDate: form.startDate,
            },
          },
          allowances: validAllowances.length > 0 ? validAllowances : undefined,
        })
      );
    } catch (err: any) {
      ToastService.error(err.message || "Failed to process form data.");
    }
  };

  const managerOptions = [
    ...employees.map((e) => ({
      label: `${e.fullName} (${e.id})`,
      value: e.id,
    })),
  ];

  const showMainLoading = useMinimumDelay(
    isLoadingMainData,
    aastu_SPINNER_CYCLE_MS
  );

  if (showMainLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <aastuSpinner size="xl" variant="screen" />
        </div>
      </AdminLayout>
    );
  }

  // Define Modal Fields based on type
  let modalFields: any[] = [];
  let modalTitle = "";

  if (createModalState.type === "department") {
    modalTitle = "Create New Department";
    modalFields = [
      {
        name: "name",
        label: "Department Name",
        required: true,
        defaultValue: createModalState.initialValue,
      },
    ];
  } else if (createModalState.type === "jobTitle") {
    modalTitle = "Create New Job Title";
    modalFields = [
      {
        name: "title",
        label: "Job Title",
        required: true,
        defaultValue: createModalState.initialValue,
      },
      {
        name: "level",
        label: "Job Level",
        type: "select",
        required: true,
        options: [
          { label: "Entry", value: "Entry" },
          { label: "Junior", value: "Junior" },
          { label: "Mid", value: "Mid" },
          { label: "Senior", value: "Senior" },
          { label: "Lead", value: "Lead" },
          { label: "Manager", value: "Manager" },
          { label: "Director", value: "Director" },
          { label: "Executive", value: "Executive" },
        ],
      },
    ];
  } else if (createModalState.type === "allowance") {
    modalTitle = "Create New Allowance Type";
    modalFields = [
      {
        name: "name",
        label: "Allowance Name",
        required: true,
        defaultValue: createModalState.initialValue,
      },
      {
        name: "description",
        label: "Description",
        required: true,
        type: "textarea",
        placeholder: "e.g. Monthly transport allowance",
      },
      { name: "is_taxable", label: "Is Taxable?", type: "checkbox" },
    ];
  }

  // And update JSX
  return (
    <AdminLayout>
      <div className="w-full px-6 pb-12">
        {/* Header */}
        <div className="mb-8">
          <BackButton to="/admin/employees" label="Back to Employees" />
          <h1 className="text-3xl font-bold text-k-dark-grey">
            Add New Employee
          </h1>
          <p className="text-k-medium-grey mt-2">
            Send an invite to a new employee. They will set up their password
            and personal details later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Account Info */}
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-k-dark-grey mb-6 flex items-center">
              <FiUser className="mr-2 text-k-orange" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Employee Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="employee@example.com"
                icon={FiMail}
              />
              <FormField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="e.g. Abebe Kebede"
              />
              <FormField // Role is now half width
                label="Role"
                name="role"
                type="select"
                value={form.role}
                onChange={handleChange}
                options={[
                  { label: "Employee", value: USER_ROLES.EMPLOYEE },
                  { label: "HR", value: USER_ROLES.HR },
                  { label: "Admin", value: USER_ROLES.ADMIN },
                ]}
              />
            </div>
          </div>

          {/* 2. Employment Details */}
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-k-dark-grey mb-6 flex items-center">
              <FiBriefcase className="mr-2 text-k-orange" />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormAutocomplete
                label="Job Title"
                type="jobTitles"
                value={form.jobTitleName}
                onChange={(val) =>
                  handleAutocompleteChange("jobTitleName", val)
                }
                fetchSuggestionsFn={filterJobTitles}
                onCreateNew={(val) => handleOpenCreateModal("jobTitle", val)}
                required
                placeholder="Search or create job title"
              />

              <FormAutocomplete
                label="Department"
                type="departments"
                value={form.departmentName}
                onChange={(val) =>
                  handleAutocompleteChange("departmentName", val)
                }
                fetchSuggestionsFn={filterDepartments}
                onCreateNew={(val) => handleOpenCreateModal("department", val)}
                required
                placeholder="Search or create department"
              />

              <FormField
                label="Employment Type"
                name="employmentType"
                type="select"
                value={form.employmentType}
                onChange={handleChange}
                options={EMPLOYMENT_TYPES}
              />
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <FormField // Manager is now half width
                label="Manager"
                name="managerId"
                type="select"
                value={form.managerId}
                onChange={handleChange}
                options={managerOptions}
                placeholder="Select Manager"
              />
            </div>
          </div>

          {/* 3. Compensation */}
          <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-k-dark-grey mb-6 flex items-center">
              <FiDollarSign className="mr-2 text-k-orange" />
              Compensation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FormField
                label="Gross Salary"
                name="grossSalary"
                type="number"
                value={form.grossSalary}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
              <FormField
                label="Base Salary"
                name="basicSalary"
                type="number"
                value={form.basicSalary}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-k-dark-grey mb-4">Allowances</h4>

              <div className="space-y-4 mb-4">
                {allowances.map((allowance, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-end bg-gray-50 p-3 rounded-xl border border-gray-200"
                  >
                    <div className="flex-1">
                      <FormAutocomplete
                        label={index === 0 ? "Allowance Name" : undefined}
                        type="allowanceTypes"
                        value={allowance.name}
                        onChange={(val) =>
                          handleAllowanceChange(index, "name", val)
                        }
                        fetchSuggestionsFn={filterAllowanceTypes}
                        onCreateNew={(val) =>
                          handleOpenCreateModal("allowance", val, index)
                        }
                        placeholder="e.g. Transport"
                        containerClassName="w-full"
                        required
                      />
                    </div>
                    <div className="w-1/3">
                      <FormField
                        label={index === 0 ? "Amount" : undefined}
                        type="number"
                        name={`allowance_amount_${index}`}
                        value={allowance.amount}
                        onChange={(e) =>
                          handleAllowanceChange(index, "amount", e.target.value)
                        }
                        placeholder="0.00"
                        className="mb-0!"
                        inputClassName="!h-[46px]"
                        required
                      />
                    </div>
                    <div className="pb-1">
                      <button
                        type="button"
                        onClick={() => removeAllowance(index)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                        title="Remove Allowance"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addAllowance}
                  className="flex items-center justify-center text-k-orange font-medium px-4 py-2 border-2 border-dashed border-k-orange/30 rounded-xl hover:bg-orange-50 hover:border-k-orange transition-all w-full md:w-auto"
                >
                  <FiPlus className="mr-2" /> Add Allowance
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              variant="secondary"
              className="mr-4"
              onClick={() => navigate("/admin/employees")}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="w-40">
              Add Employee
            </Button>
          </div>
        </form>

        {/* Dynamic Creation Modal */}
        <CreateItemModal
          isOpen={createModalState.isOpen}
          onClose={() =>
            setCreateModalState((prev) => ({
              ...prev,
              isOpen: false,
              type: null,
            }))
          }
          title={modalTitle}
          fields={modalFields}
          onSubmit={handleCreateSubmit}
          initialValues={{
            name: createModalState.initialValue,
            title: createModalState.initialValue,
          }}
        />
      </div>
    </AdminLayout>
  );
}
