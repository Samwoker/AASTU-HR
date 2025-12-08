import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
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

  const [form, setForm] = useState({
    employee_id: "",
    department: "",
    employment_type: "Full Time",
    start_date: "",
    gross_salary: "",
    manager_id: "",
  });

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

  // Handle Success/Error
  useEffect(() => {
    if (success) {
      ToastService.success("Employment record created successfully!");
      setForm({
        employee_id: "",
        department: "",
        employment_type: "Full Time",
        start_date: "",
        gross_salary: "",
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

    if (form.department) {
      const filtered = uniqueDepts.filter((d: any) =>
        d.toLowerCase().includes(form.department.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(uniqueDepts);
    }
  }, [form.department, departments]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "department") setShowDepartmentSuggestions(true);
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setForm((prev) => ({ ...prev, department }));
    setShowDepartmentSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalJobTitleId: number | undefined;

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

      // --- Department Logic ---
      // Check if department exists
      const existingDept = departments.find(
        (d: any) => d.name.toLowerCase() === form.department.toLowerCase()
      );

      if (!existingDept) {
        ToastService.info(`Creating new department: ${form.department}...`);
        const deptResponse: any = await makeCall({
          method: "POST",
          route: apiRoutes.departments,
          body: { name: form.department },
          isSecureRoute: true,
        });

        if (deptResponse?.data?.status === "success") {
          // Adjust check based on backend response
          ToastService.success("New department created!");
          dispatch(departmentActions.fetchDepartmentsStart());
        } else {
          throw new Error("Failed to create new department");
        }
      }

      dispatch(
        createActions.createEmploymentRequest({
          ...form,
          gross_salary: parseFloat(form.gross_salary),
          job_title_id: finalJobTitleId,
        })
      );
    } catch (err: any) {
      ToastService.error(err.message || "Failed to process request");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Assign Employment Details
        </h1>

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
                    name="department"
                    value={form.department}
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
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                fullWidth
                className="text-lg font-bold py-4 h-auto"
              >
                {loading ? "Processing..." : "Create Employment Record"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
