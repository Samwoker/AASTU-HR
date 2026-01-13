import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import FormField from "../../../components/common/FormField";
import FormAutocomplete from "../../../components/common/FormAutocomplete";
import Button from "../../../components/common/Button";
import Card from "../../../components/Core/ui/Card";
import DynamicAutocomplete from "../../../components/common/FormAutocomplete";
import CreateItemModal from "../../../components/common/CreateItemModal";
import {
  FiMail,
  FiBriefcase,
  FiLayers,
  FiCalendar,
  FiDollarSign,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";

import { USER_ROLES } from "../../../../utils/constants";
import ToastService from "../../../../utils/ToastService";
import adminService, {
  AllowanceType,
  Department,
  JobTitle,
} from "../../../services/adminService";

import { useCreateAccountSlice } from "./slice";
import {
  selectCreateAccountError,
  selectCreateAccountLoading,
  selectCreateAccountSuccess,
} from "./slice/selectors";

export default function CreateUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useCreateAccountSlice();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    role: USER_ROLES.EMPLOYEE,
    department: "",
    title: "",
    level: "",
    employment_type: "Full Time",
    start_date: "",
    gross_salary: "",
    basic_salary: "",
    allowances: [] as { name: string; amount: string }[],
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);

  // Modal State
  const [createModalState, setCreateModalState] = useState<{
    isOpen: boolean;
    type: "allowance" | null;
    initialValue: string;
    targetIndex?: number;
  }>({
    isOpen: false,
    type: null,
    initialValue: "",
  });

  const loading = useSelector(selectCreateAccountLoading);
  const error = useSelector(selectCreateAccountError);
  const success = useSelector(selectCreateAccountSuccess);

  const roles = useMemo(
    () => [
      { label: "Employee", value: USER_ROLES.EMPLOYEE },
      { label: "HR", value: USER_ROLES.HR },
      { label: "Admin", value: USER_ROLES.ADMIN },
    ],
    []
  );

  const resetForm = () => {
    setForm({
      email: "",
      fullName: "",
      role: USER_ROLES.EMPLOYEE,
      department: "",
      title: "",
      level: "",
      employment_type: "Full Time",
      start_date: "",
      gross_salary: "",
      basic_salary: "",
      allowances: [],
    });
    dispatch(actions.resetState());
  };

  useEffect(() => {
    // Load lookup data for resolving IDs (used for EMPLOYEE role payload).
    (async () => {
      try {
        const [deps, jobs, allowTypes] = await Promise.all([
          adminService.getDepartments(),
          adminService.getJobTitles(),
          adminService.getAllowanceTypes(),
        ]);
        setDepartments(deps);
        setJobTitles(jobs);
        setAllowanceTypes(allowTypes);
      } catch (e: any) {
        // Non-blocking for non-employee roles.
        console.error("Failed to load create-account lookup data", e);
      }
    })();
  }, []);

  const resolveDepartmentId = (name: string): number | null => {
    const trimmed = name?.trim();
    if (!trimmed) return null;
    const match = departments.find(
      (d) => d.name?.toLowerCase() === trimmed.toLowerCase()
    );
    return match ? match.id : null;
  };

  const resolveJobTitleId = (title: string, level: string): number | null => {
    const t = title?.trim();
    if (!t) return null;
    const strict = jobTitles.find(
      (j) =>
        j.title?.toLowerCase() === t.toLowerCase() &&
        (level?.trim() ? j.level === level : true)
    );
    const loose = jobTitles.find(
      (j) => j.title?.toLowerCase() === t.toLowerCase()
    );
    const match = strict || loose;
    return match ? match.id : null;
  };

  const resolveAllowanceTypeId = (name: string): number | null => {
    const trimmed = name?.trim();
    if (!trimmed) return null;
    const match = allowanceTypes.find(
      (a) => a.name?.toLowerCase() === trimmed.toLowerCase()
    );
    return match ? match.id : null;
  };

  // Success handler
  useEffect(() => {
    if (success) {
      ToastService.success("User account created successfully!");
      resetForm();
      navigate("/admin/employees"); // Navigate back on success
    }
  }, [success]);

  // Error handler
  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helpers
  const filterAllowanceTypes = async (query: string) => {
    return allowanceTypes
      .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
      .map((a) => a.name);
  };

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

  const filterJobLevels = async (query: string) => {
    const uniqueLevels = Array.from(
      new Set(jobTitles.map((j) => j.level).filter(Boolean))
    );
    return uniqueLevels.filter((level) =>
      level.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleOpenCreateModal = (value: string, index: number) => {
    setCreateModalState({
      isOpen: true,
      type: "allowance",
      initialValue: value,
      targetIndex: index,
    });
  };

  const handleCreateSubmit = async (values: Record<string, any>) => {
    try {
      const isTaxable =
        values.is_taxable === true || values.is_taxable === "true";
      const newAllowance = await adminService.createAllowanceType({
        name: values.name,
        description: values.description,
        is_taxable: isTaxable,
      });
      setAllowanceTypes((prev) => [...prev, newAllowance]);

      if (typeof createModalState.targetIndex === "number") {
        const newAllowances = [...form.allowances];
        newAllowances[createModalState.targetIndex] = {
          ...newAllowances[createModalState.targetIndex],
          name: newAllowance.name,
        };
        setForm((prev) => ({ ...prev, allowances: newAllowances }));
      }
      ToastService.success(`Allowance Type "${newAllowance.name}" created.`);
    } catch (err: any) {
      ToastService.error(err.message || "Failed to create allowance type.");
    }
  };

  // Generic change handler for Autocomplete
  const handleFieldChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  // Auto-calculate Gross Salary
  useEffect(() => {
    if (form.role === USER_ROLES.EMPLOYEE) {
      const basic = parseFloat(form.basic_salary) || 0;
      const totalAllowances = form.allowances.reduce((sum, allowance) => {
        return sum + (parseFloat(allowance.amount) || 0);
      }, 0);
      const gross = basic + totalAllowances;
      const formattedGross = gross > 0 ? gross.toFixed(2) : "";

      setForm((prev) => {
        if (prev.gross_salary !== formattedGross) {
          return { ...prev, gross_salary: formattedGross };
        }
        return prev;
      });
    }
  }, [form.basic_salary, form.allowances, form.role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email?.trim() || !form.fullName?.trim()) {
      ToastService.error("Please provide Full Name and Email.");
      return;
    }

    // Non-employee roles: backend still expects employee.fullName
    if (form.role !== USER_ROLES.EMPLOYEE) {
      dispatch(
        actions.createAccountRequest({
          email: form.email,
          role: form.role,
          employee: {
            fullName: form.fullName,
          },
        } as any)
      );
      return;
    }

    // Employee role: build payload matching backend contract (IDs required)
    if (!form.department?.trim() || !form.title?.trim() || !form.start_date) {
      ToastService.error("Please fill Department, Job Title, and Start Date.");
      return;
    }

    const departmentId = resolveDepartmentId(form.department);
    if (!departmentId) {
      ToastService.error(
        `Department "${form.department}" not found. Please create it first.`
      );
      return;
    }

    const jobTitleId = resolveJobTitleId(form.title, form.level);
    if (!jobTitleId) {
      ToastService.error(
        `Job Title "${form.title}" not found. Please create it first.`
      );
      return;
    }

    const allowancesPayload = (form.allowances || [])
      .filter((a) => a.name && a.amount)
      .map((a) => {
        const typeId = resolveAllowanceTypeId(a.name);
        if (!typeId) {
          ToastService.error(
            `Allowance Type "${a.name}" not found. Please create it first.`
          );
          return null;
        }
        return {
          allowance_type_id: typeId,
          amount: Number(a.amount),
          currency: "ETB",
          effective_date: form.start_date,
        };
      })
      .filter(Boolean);

    dispatch(
      actions.createAccountRequest({
        email: form.email,
        role: form.role,
        employee: {
          fullName: form.fullName,
          employment: {
            employmentType: form.employment_type,
            grossSalary: Number(form.gross_salary) || 0,
            basicSalary: Number(form.basic_salary) || 0,
            departmentId,
            jobTitleId,
            startDate: form.start_date,
          },
        },
        allowances:
          allowancesPayload.length > 0 ? (allowancesPayload as any) : undefined,
      } as any)
    );
  };

  // Modal Fields Logic
  let modalFields: any[] = [];
  let modalTitle = "";
  if (createModalState.type === "allowance") {
    modalTitle = "Create New Allowance Type";
    modalFields = [
      {
        name: "name",
        label: "Allowance Name",
        required: true,
        defaultValue: createModalState.initialValue,
        placeholder: "e.g. Transport",
      },
      {
        name: "description",
        label: "Description",
        required: true,
        type: "textarea",
        placeholder: "Describe this allowance",
      },
      {
        name: "is_taxable",
        label: "Is Taxable?",
        type: "checkbox",
      },
    ];
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/employees")}
            className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Employees
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New User
            </h1>
            <p className="text-gray-500 mt-1">
              Set up a new user account and employment details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card title="Account Information" icon={<FiUser />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  type="text"
                  name="fullName"
                  placeholder="e.g. Abebe Kebede"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  icon={FiUser}
                />

                <FormField
                  label="Employee Email"
                  type="email"
                  name="email"
                  placeholder="employee@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  icon={FiMail}
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
            </Card>

            {form.role === USER_ROLES.EMPLOYEE && (
              <>
                <Card title="Employment Details" icon={<FiBriefcase />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormAutocomplete
                      label="Job Title"
                      value={form.title}
                      onChange={(val) => handleFieldChange("title", val)}
                      placeholder="e.g. Software Engineer"
                      type="jobTitles"
                      fetchSuggestionsFn={filterJobTitles}
                      required
                      icon={<FiBriefcase />}
                    />
                    <FormAutocomplete
                      label="Job Level"
                      value={form.level}
                      onChange={(val) => handleFieldChange("level", val)}
                      placeholder="e.g. Senior"
                      type="jobLevels"
                      fetchSuggestionsFn={filterJobLevels}
                      icon={<FiLayers />}
                      required
                    />
                    <FormAutocomplete
                      label="Department"
                      value={form.department}
                      onChange={(val) => handleFieldChange("department", val)}
                      placeholder="e.g. Engineering"
                      type="departments"
                      fetchSuggestionsFn={filterDepartments}
                      required
                    />
                    <FormField
                      label="Employment Type"
                      type="select"
                      name="employment_type"
                      value={form.employment_type}
                      onChange={(e) =>
                        handleFieldChange("employment_type", e.target.value)
                      }
                      options={[
                        { value: "Full Time", label: "Full Time" },
                        { value: "Part-Time", label: "Part-Time" },
                        { value: "Contract", label: "Contract" },
                        { value: "Outsourced", label: "Outsourced" },
                      ]}
                      required
                    />
                    <FormField
                      label="Start Date"
                      type="date"
                      name="start_date"
                      value={form.start_date}
                      onChange={(e) =>
                        handleFieldChange("start_date", e.target.value)
                      }
                      required
                      icon={FiCalendar}
                    />
                  </div>
                </Card>

                <Card title="Compensation" icon={<FiDollarSign />}>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Gross Salary Display */}
                      {/* Gross Salary Display */}
                      <div className="w-full">
                        <label className="block mb-1.5 font-semibold text-gray-700">
                          Gross Salary
                        </label>
                        <div className="flex items-center justify-center bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 h-[50px] shadow-sm">
                          <span className="text-lg font-bold text-[#DB5E00]">
                            {form.gross_salary ? form.gross_salary : "0.00"}
                          </span>
                        </div>
                      </div>

                      <FormField
                        label="Basic Salary"
                        type="text"
                        name="basic_salary"
                        inputMode="decimal"
                        value={form.basic_salary}
                        onChange={(e) =>
                          handleFieldChange("basic_salary", e.target.value)
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Allowances Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-md font-semibold text-gray-700 mb-4">
                        Allowances
                      </h3>
                      <div className="space-y-4">
                        {form.allowances.map((allowance, index) => (
                          <div key={index} className="flex gap-4 items-end">
                            <div className="flex-1">
                              <DynamicAutocomplete
                                label="Allowance Name"
                                type="allowanceTypes"
                                value={allowance.name}
                                onChange={(val) => {
                                  const newAllowances = [...form.allowances];
                                  newAllowances[index] = {
                                    ...newAllowances[index],
                                    name: val,
                                  };
                                  handleFieldChange(
                                    "allowances",
                                    newAllowances
                                  );
                                }}
                                fetchSuggestionsFn={filterAllowanceTypes}
                                onCreateNew={(val) =>
                                  handleOpenCreateModal(val, index)
                                }
                                placeholder="e.g. Transport"
                                containerClassName="w-full"
                                required
                              />
                            </div>
                            <div className="flex-1">
                              <FormField
                                label="Amount"
                                type="text"
                                name={`allowance_amount_${index}`}
                                inputMode="decimal"
                                value={allowance.amount}
                                onChange={(e) => {
                                  const newAllowances = [...form.allowances];
                                  newAllowances[index] = {
                                    ...newAllowances[index],
                                    amount: e.target.value,
                                  };
                                  handleFieldChange(
                                    "allowances",
                                    newAllowances
                                  );
                                }}
                                placeholder="0.00"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newAllowances = form.allowances.filter(
                                  (_, i) => i !== index
                                );
                                handleFieldChange("allowances", newAllowances);
                              }}
                              className="mb-1 p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-[50px] flex items-center justify-center border border-red-200"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            handleFieldChange("allowances", [
                              ...form.allowances,
                              { name: "", amount: "" },
                            ]);
                          }}
                          className="flex items-center gap-2 text-sm text-[#DB5E00] font-medium hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors border border-dashed border-[#DB5E00]"
                        >
                          <FiPlus /> Add Allowance
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                onClick={() => navigate("/admin/employees")}
                variant="subtle"
                className="px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="px-6">
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>
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
          initialValues={{ name: createModalState.initialValue }}
        />
      </div>
    </AdminLayout>
  );
}
