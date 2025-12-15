import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import BackButton from "../../../components/common/BackButton";
import FormField from "../../../components/common/FormField";
import {
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiBriefcase,
  FiLayers,
  FiLoader,
  FiChevronDown,
} from "react-icons/fi";
import ToastService from "../../../../utils/ToastService";
import { routeConstants } from "../../../../utils/constants";

// Slices
import { useCreateEmploymentSlice } from "./slice";
import { useJobTitlesSlice } from "../Settings/JobTitles/slice";
import { useDepartments } from "../Departments/slice";

// Selectors
import {
  selectCreateEmploymentLoading,
  selectCreateEmploymentError,
  selectCreateEmploymentSuccess,
} from "./slice/selectors";
import { selectAllJobTitles } from "../Settings/JobTitles/slice/selectors";
import {
  selectDepartments,
  selectDepartmentsLoading,
} from "../Departments/slice/selectors";
import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";

export default function CreateEmployment() {
  const [searchParams] = useSearchParams();
  const prefillEmployeeId = searchParams.get("employeeId") || "";
  const employmentIdParam = searchParams.get("employmentId");
  const employmentId = employmentIdParam ? Number(employmentIdParam) : null;
  const dispatch = useDispatch();

  // Hooks
  const { actions: createActions } = useCreateEmploymentSlice();
  const { actions: jobTitleActions } = useJobTitlesSlice();
  const { actions: departmentActions } = useDepartments();

  // Selectors
  const loading = useSelector(selectCreateEmploymentLoading);
  const error = useSelector(selectCreateEmploymentError);
  const success = useSelector(selectCreateEmploymentSuccess);
  const jobTitles = useSelector(selectAllJobTitles);
  const departments = useSelector(selectDepartments);
  const departmentsLoading = useSelector(selectDepartmentsLoading);

  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState({
    employee_id: prefillEmployeeId,
    department_name: "",
    department_id: "",
    employment_type: "Full Time",
    start_date: "",
    gross_salary: "",
    basic_salary: "",
    transportation_allowance: "",
    housing_allowance: "",
    meal_allowance: "",
    manager_id: "",
  });

  const [prefilled, setPrefilled] = useState(false);

  // Job Title State
  const [jobTitleInput, setJobTitleInput] = useState({ title: "", level: "" });
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<string[]>([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLevelSuggestions, setShowLevelSuggestions] = useState(false);

  // Department State
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] =
    useState(false);

  const employmentTypes = ["Full Time", "Part-Time", "Contract", "Outsourced"];

  // Fetch dependencies on mount
  useEffect(() => {
    dispatch(jobTitleActions.fetchAllJobTitlesRequest());
    dispatch(departmentActions.fetchDepartmentsStart());
  }, [dispatch, jobTitleActions, departmentActions]);

  // Prefill when in update mode
  useEffect(() => {
    const fetchEmployment = async () => {
      if (!employmentId || prefilled) return;
      try {
        setIsUpdating(true);
        const response: any = await makeCall({
          method: "GET",
          route: apiRoutes.employmentById(employmentId),
          isSecureRoute: true,
        });

        const emp: any =
          response?.data?.employment || response?.data?.data?.employment;
        if (!emp) {
          ToastService.error("Failed to load employment details");
          return;
        }

        const deptId = emp.department_id ?? emp.department?.id;
        const deptName = emp.department?.name;
        const jobTitleId = emp.job_title_id ?? emp.jobTitle?.id;

        setForm((prev) => ({
          ...prev,
          employee_id: emp.employee_id ?? prev.employee_id,
          employment_type: emp.employment_type ?? prev.employment_type,
          start_date: emp.start_date ?? prev.start_date,
          gross_salary:
            emp.gross_salary !== undefined && emp.gross_salary !== null
              ? String(emp.gross_salary)
              : prev.gross_salary,
          basic_salary:
            emp.basic_salary !== undefined && emp.basic_salary !== null
              ? String(emp.basic_salary)
              : prev.basic_salary,
          transportation_allowance:
            emp.transportation_allowance !== undefined &&
            emp.transportation_allowance !== null
              ? String(emp.transportation_allowance)
              : prev.transportation_allowance,
          housing_allowance:
            emp.housing_allowance !== undefined &&
            emp.housing_allowance !== null
              ? String(emp.housing_allowance)
              : prev.housing_allowance,
          meal_allowance:
            emp.meal_allowance !== undefined && emp.meal_allowance !== null
              ? String(emp.meal_allowance)
              : prev.meal_allowance,
          manager_id: emp.manager_id ?? prev.manager_id,
          department_id: deptId ? String(deptId) : prev.department_id,
          department_name: deptName ?? prev.department_name,
        }));

        // Job title prefill
        if (emp.jobTitle?.title) {
          setJobTitleInput({
            title: emp.jobTitle.title,
            level: emp.jobTitle.level || "",
          });
        } else if (jobTitleId) {
          const existing = (jobTitles || []).find(
            (j: any) => j?.id === jobTitleId
          );
          if (existing?.title) {
            setJobTitleInput({
              title: existing.title,
              level: existing.level || "",
            });
          }
        }

        // Department name fallback if only id is known
        if (!deptName && deptId) {
          const dept = (departments || []).find((d: any) => d?.id === deptId);
          if (dept?.name) {
            setForm((prev) => ({ ...prev, department_name: dept.name }));
          }
        }

        setPrefilled(true);
      } catch (err: any) {
        ToastService.error(err?.message || "Failed to load employment details");
      } finally {
        setIsUpdating(false);
      }
    };

    fetchEmployment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employmentId, prefilled]);

  // Handle Success/Error
  useEffect(() => {
    if (success) {
      ToastService.success("Employment record created successfully!");
      setForm({
        employee_id: "",
        department_name: "",
        department_id: "",
        employment_type: "Full Time",
        start_date: "",
        gross_salary: "",
        basic_salary: "",
        transportation_allowance: "",
        housing_allowance: "",
        meal_allowance: "",
        manager_id: "",
      });
      setJobTitleInput({ title: "", level: "" });
      dispatch(createActions.resetState());
    }
  }, [success, dispatch, createActions]);

  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  // Filter job titles for autocomplete
  useEffect(() => {
    const uniqueTitles = Array.from(
      new Set(
        jobTitles
          .map((j) => j?.title)
          .filter((t) => typeof t === "string" && t.trim() !== "")
      )
    );

    if (jobTitleInput.title) {
      const filtered = uniqueTitles.filter((t) =>
        t.toLowerCase().includes(jobTitleInput.title.toLowerCase())
      );
      setFilteredTitles(filtered);
    } else {
      setFilteredTitles(uniqueTitles);
    }
  }, [jobTitleInput.title, jobTitles]);

  // Filter job levels based on selected title
  useEffect(() => {
    if (jobTitleInput.title) {
      const levelsForTitle = jobTitles
        .filter(
          (j) =>
            j.title.toLowerCase() === jobTitleInput.title.toLowerCase() &&
            j.level
        )
        .map((j) => j.level as string)
        .filter((l) => typeof l === "string" && l.trim() !== "");

      const uniqueLevels = Array.from(new Set(levelsForTitle));

      if (jobTitleInput.level) {
        const filtered = uniqueLevels.filter((l) =>
          l.toLowerCase().includes(jobTitleInput.level.toLowerCase())
        );
        setFilteredLevels(filtered);
      } else {
        setFilteredLevels(uniqueLevels);
      }
    } else {
      setFilteredLevels([]);
    }
  }, [jobTitleInput.title, jobTitleInput.level, jobTitles]);

  // Filter departments for autocomplete
  useEffect(() => {
    const uniqueDepts = Array.from(
      new Set(
        (departments || [])
          .map((d: any) => d?.name)
          .filter((name: any) => typeof name === "string" && name.trim() !== "")
      )
    );

    if (form.department_name) {
      const filtered = uniqueDepts.filter((d: any) =>
        d.toLowerCase().includes(form.department_name.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(uniqueDepts);
    }
  }, [form.department_name, departments]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "department_name") {
      setShowDepartmentSuggestions(true);
      setForm((prev) => ({ ...prev, department_id: "" }));
    }
  };

  const handleJobTitleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setJobTitleInput((prev) => ({ ...prev, [name]: value }));
    if (name === "title") setShowTitleSuggestions(true);
    if (name === "level") setShowLevelSuggestions(true);
  };

  const selectTitleSuggestion = (title: string) => {
    setJobTitleInput((prev) => ({ ...prev, title }));
    setShowTitleSuggestions(false);
  };

  const selectLevelSuggestion = (level: string) => {
    setJobTitleInput((prev) => ({ ...prev, level }));
    setShowLevelSuggestions(false);
  };

  const selectDepartmentSuggestion = (department: string) => {
    const existingDept = (departments || []).find(
      (d: any) => d?.name?.toLowerCase() === department.toLowerCase()
    );
    setForm((prev) => ({
      ...prev,
      department_name: department,
      department_id: existingDept?.id ? String(existingDept.id) : "",
    }));
    setShowDepartmentSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalJobTitleId: number | undefined;
      let finalDepartmentId: number | undefined;

      // --- Job Title Logic ---
      const existingJob = jobTitles.find(
        (j) =>
          j.title.toLowerCase() === jobTitleInput.title.toLowerCase() &&
          j.level?.toLowerCase() === jobTitleInput.level.toLowerCase()
      );

      if (existingJob) {
        finalJobTitleId = existingJob.id;
      } else {
        ToastService.info("Creating new job title...");
        const response: any = await makeCall({
          method: "POST",
          route: apiRoutes.jobTitles,
          body: { title: jobTitleInput.title, level: jobTitleInput.level },
          isSecureRoute: true,
        });

        if (response?.data?.data?.jobTitle?.id) {
          finalJobTitleId = response.data.data.jobTitle.id;
          ToastService.success("New job title created!");
          dispatch(jobTitleActions.fetchAllJobTitlesRequest());
        } else {
          throw new Error("Failed to create new job title");
        }
      }

      if (!finalJobTitleId) {
        throw new Error("Job title is required");
      }

      // --- Department Logic ---
      if (form.department_id) {
        finalDepartmentId = Number(form.department_id);
      }

      if (!finalDepartmentId && form.department_name) {
        const existingDept = (departments || []).find(
          (d: any) =>
            d?.name?.toLowerCase() === form.department_name.toLowerCase()
        );

        if (existingDept?.id) {
          finalDepartmentId = existingDept.id;
        } else {
          ToastService.info(
            `Creating new department: ${form.department_name}...`
          );
          const deptResponse: any = await makeCall({
            method: "POST",
            route: apiRoutes.departments,
            body: { name: form.department_name },
            isSecureRoute: true,
          });

          const createdDeptId = deptResponse?.data?.data?.department?.id;
          if (createdDeptId) {
            finalDepartmentId = createdDeptId;
            ToastService.success("New department created!");
            dispatch(departmentActions.fetchDepartmentsStart());
          } else {
            throw new Error("Failed to create new department");
          }
        }
      }

      if (!finalDepartmentId) {
        throw new Error("Department is required");
      }

      const payload = {
        employee_id: form.employee_id,
        employment_type: form.employment_type,
        start_date: form.start_date,
        gross_salary: parseFloat(form.gross_salary),
        basic_salary: parseFloat(form.basic_salary),
        transportation_allowance: parseFloat(form.transportation_allowance),
        housing_allowance: parseFloat(form.housing_allowance),
        meal_allowance: parseFloat(form.meal_allowance),
        department_id: finalDepartmentId,
        job_title_id: finalJobTitleId,
        manager_id: form.manager_id || undefined,
      };

      if (employmentId) {
        setIsUpdating(true);
        await makeCall({
          method: "PUT",
          route: apiRoutes.employmentById(employmentId),
          body: payload,
          isSecureRoute: true,
        });
        ToastService.success("Employment record updated successfully!");
        setIsUpdating(false);
      } else {
        dispatch(createActions.createEmploymentRequest(payload));
      }
    } catch (err: any) {
      ToastService.error(err.message || "Failed to process request");
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BackButton fallbackTo={routeConstants.employees} />
          <h1 className="text-3xl font-bold text-gray-800">
            {employmentId ? "Update Employment" : "Assign Employment Details"}
          </h1>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Employee & Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Employee ID"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                required
                placeholder="e.g. EMP-2024-001"
                icon={FiUser}
              />

              <FormField
                label="Manager ID (Optional)"
                name="manager_id"
                value={form.manager_id}
                onChange={handleChange}
                placeholder="e.g. EMP-2023-050"
                icon={FiUser}
              />
            </div>

            {/* Section: Job Details */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FiBriefcase /> Job Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="relative">
                  <FormField
                    label="Job Title"
                    name="title"
                    value={jobTitleInput.title}
                    onChange={handleJobTitleChange}
                    required
                    placeholder="Software Engineer"
                    autoComplete="off"
                    onFocus={() => setShowTitleSuggestions(true)}
                  />
                  {showTitleSuggestions && filteredTitles.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                      {filteredTitles.map((title, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                          onClick={() => selectTitleSuggestion(title)}
                        >
                          {title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="relative">
                  <FormField
                    label="Job Level"
                    name="level"
                    value={jobTitleInput.level}
                    onChange={handleJobTitleChange}
                    placeholder="e.g. Senior, Junior, L4"
                    icon={FiLayers}
                    autoComplete="off"
                    onFocus={() => setShowLevelSuggestions(true)}
                  />
                  {showLevelSuggestions && filteredLevels.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                      {filteredLevels.map((level, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                          onClick={() => selectLevelSuggestion(level)}
                        >
                          {level}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <FormField
                    label="Department"
                    name="department_name"
                    value={form.department_name}
                    onChange={handleChange}
                    required
                    placeholder={
                      departmentsLoading
                        ? "Loading departments..."
                        : "Type or select department..."
                    }
                    autoComplete="off"
                    onFocus={() => setShowDepartmentSuggestions(true)}
                    disabled={departmentsLoading}
                    icon={() =>
                      departmentsLoading ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )
                    }
                  />
                  {showDepartmentSuggestions &&
                    !departmentsLoading &&
                    filteredDepartments.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                        {filteredDepartments.map((dept: any, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                            onClick={() => selectDepartmentSuggestion(dept)}
                          >
                            {dept}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <FormField
                  type="select"
                  label="Employment Type"
                  name="employment_type"
                  value={form.employment_type}
                  onChange={handleChange}
                  options={employmentTypes.map((t) => ({ label: t, value: t }))}
                />
              </div>
            </div>

            {/* Section: Compensation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Start Date"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                icon={FiCalendar}
              />

              <FormField
                label="Gross Salary"
                type="number"
                name="gross_salary"
                value={form.gross_salary}
                placeholder="e.g. 10000"
                onChange={handleChange}
                required
                icon={FiDollarSign}
              />

              <FormField
                label="Basic Salary"
                type="number"
                name="basic_salary"
                value={form.basic_salary}
                placeholder="e.g. 15000"
                onChange={handleChange}
                required
                icon={FiDollarSign}
              />

              <FormField
                label="Transportation Allowance"
                type="number"
                name="transportation_allowance"
                value={form.transportation_allowance}
                placeholder="e.g. 5000"
                onChange={handleChange}
                required
                icon={FiDollarSign}
              />

              <FormField
                label="Housing Allowance"
                type="number"
                name="housing_allowance"
                value={form.housing_allowance}
                placeholder="e.g. 3000"
                onChange={handleChange}
                required
                icon={FiDollarSign}
              />

              <FormField
                label="Meal Allowance"
                type="number"
                name="meal_allowance"
                value={form.meal_allowance}
                placeholder="e.g. 2000"
                onChange={handleChange}
                required
                icon={FiDollarSign}
              />
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                loading={loading || isUpdating}
                disabled={loading || isUpdating}
                fullWidth
                className="text-lg font-bold py-4 h-auto"
              >
                {loading || isUpdating
                  ? "Processing..."
                  : employmentId
                  ? "Update Employment"
                  : "Create Employment Record"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
