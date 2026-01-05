import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeesSlice } from "../Employees/slice";
import {
  selectCompletedEmployees,
  selectEmployeesLoading,
} from "../Employees/slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import PageHeader from "../../../components/common/PageHeader";
import BackButton from "../../../components/common/BackButton";
import Modal from "../../../components/common/Modal";
import FormField from "../../../components/common/FormField";
import { routeConstants } from "../../../../utils/constants";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiBookOpen,
  FiFile,
  FiUser,
  FiDownload,
  FiExternalLink,
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiRepeat,
  FiMaximize2,
} from "react-icons/fi";
import { MdTimeline } from "react-icons/md";
import {
  MdPerson,
  MdContactPhone,
  MdSchool,
  MdWork,
  MdVerifiedUser,
  MdUploadFile,
} from "react-icons/md";
import { CompletedEmployee } from "../Employees/slice/types";

import ToastService from "../../../../utils/ToastService";
import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";
import adminService from "../../../services/adminService";

import { useJobTitlesSlice } from "../Settings/JobTitles/slice";
import { useDepartments } from "../Departments/slice";
import { selectAllJobTitles } from "../Settings/JobTitles/slice/selectors";
import {
  selectDepartments,
  selectDepartmentsLoading,
} from "../Departments/slice/selectors";

// Career Management imports
import PromotionModal from "../../../components/Career/PromotionModal";
import DemotionModal from "../../../components/Career/DemotionModal";
import TransferModal from "../../../components/Career/TransferModal";
import CareerHistoryTimeline from "../../../components/Career/CareerHistoryTimeline";

// Section type definitions
type SectionId =
  | "personal"
  | "contact"
  | "education"
  | "workExperience"
  | "employment"
  | "compensation"
  | "certifications"
  | "documents"
  | "careerHistory";

const SECTIONS = [
  { id: "personal" as SectionId, label: "Personal Details", icon: MdPerson },
  {
    id: "contact" as SectionId,
    label: "Contact Details",
    icon: MdContactPhone,
  },
  { id: "education" as SectionId, label: "Education", icon: MdSchool },
  { id: "workExperience" as SectionId, label: "Work Experience", icon: MdWork },
  { id: "employment" as SectionId, label: "Employment", icon: FiBriefcase },
  { id: "compensation" as SectionId, label: "Compensation", icon: FiDollarSign },
  {
    id: "certifications" as SectionId,
    label: "Certifications",
    icon: MdVerifiedUser,
  },
  { id: "documents" as SectionId, label: "Documents", icon: MdUploadFile },
  { id: "careerHistory" as SectionId, label: "Career History", icon: MdTimeline },
];

export default function EmployeeDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams<{ employeeId: string }>();
  const { actions } = useEmployeesSlice();

  const { actions: jobTitleActions } = useJobTitlesSlice();
  const { actions: departmentActions } = useDepartments();

  const completedEmployees = useSelector(selectCompletedEmployees);
  const isLoading = useSelector(selectEmployeesLoading);

  const jobTitles = useSelector(selectAllJobTitles) || [];
  const departments = useSelector(selectDepartments) || [];
  const departmentsLoading = useSelector(selectDepartmentsLoading);
  const [allowanceTypes, setAllowanceTypes] = useState<any[]>([]);

  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [employee, setEmployee] = useState<CompletedEmployee | null>(null);

  // Career management modal states
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showDemotionModal, setShowDemotionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Fetch employees if not loaded
  useEffect(() => {
    if (completedEmployees.length === 0) {
      dispatch(actions.fetchCompletedEmployeesRequest());
    }
  }, [dispatch, actions, completedEmployees.length]);

  useEffect(() => {
    dispatch(jobTitleActions.fetchAllJobTitlesRequest());
    dispatch(departmentActions.fetchDepartmentsStart());
    
    // Fetch allowance types
    adminService.getAllowanceTypes().then(setAllowanceTypes).catch((err: any) => {
        console.error("Failed to fetch allowance types", err);
    });
  }, [dispatch, jobTitleActions, departmentActions]);

  // Find employee from list
  useEffect(() => {
    if (completedEmployees.length > 0 && employeeId) {
      const found = completedEmployees.find(
        (e: any) =>
          e.employee_id === employeeId || e.id?.toString() === employeeId
      );
      if (found) {
        setEmployee(found);
      }
    }
  }, [completedEmployees, employeeId]);

  const handleGoBack = () => {
    navigate("/admin/employees");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return "N/A";
    return gender === "M" ? "Male" : gender === "F" ? "Female" : gender;
  };

  const getAvatarUrl = (gender: string | null, id: string) => {
    const num =
      (id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50) +
      1;
    const offset =
      gender?.toLowerCase() === "f" || gender?.toLowerCase() === "female"
        ? 50
        : 0;
    return `https://avatar.iran.liara.run/public/${num + offset}`;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-k-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500">Loading employee details...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!employee) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <FiUser className="w-16 h-16 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-600">
            Employee not found
          </h2>
          <p className="text-gray-500">
            The employee you're looking for doesn't exist.
          </p>
          <Button onClick={handleGoBack} icon={FiArrowLeft} variant="outline">
            Back to Employees
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const emp = employee.employee;

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalSection
            employee={emp}
            formatDate={formatDate}
            getGenderLabel={getGenderLabel}
          />
        );
      case "contact":
        return <ContactSection employee={emp} email={employee.email} />;
      case "education":
        return (
          <EducationSection
            educations={emp?.educations}
            formatDate={formatDate}
          />
        );
      case "workExperience":
        return (
          <WorkExperienceSection
            histories={emp?.employmentHistories}
            formatDate={formatDate}
          />
        );
      case "employment":
        return (
          <EmploymentSection
            employee={emp}
            jobTitles={jobTitles}
            departments={departments}
            departmentsLoading={departmentsLoading}
          />
        );
      case "compensation":
        return (
          <CompensationSection
            employee={emp}
            allowanceTypes={allowanceTypes}
          />
        );
      case "certifications":
        return (
          <CertificationsSection
            certifications={emp?.licensesAndCertifications}
          />
        );
      case "documents":
        return <DocumentsSection documents={emp?.documents} />;
      case "careerHistory":
        return <CareerHistoryTimeline employeeId={employee.employee_id} />;
      default:
        return (
          <PersonalSection
            employee={emp}
            formatDate={formatDate}
            getGenderLabel={getGenderLabel}
          />
        );
    }
  };

  // Get latest employment for career modals
  const latestEmployment = emp?.employments?.[emp.employments.length - 1];

  const handleCareerActionSuccess = () => {
    dispatch(actions.fetchCompletedEmployeesRequest());
  };

  return (
    <AdminLayout>
      <div className="min-h-screen pb-12">
        {/* Header Banner */}
        <PageHeader className="rounded-b-3xl -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-8 pt-8 pb-24 h-52">
          <div className="max-w-7xl mx-auto relative z-10">
            <BackButton
              to={routeConstants.employees}
              label="Back to Employees"
              className="!text-gray-300 hover:!text-white"
            />
            <h1 className="text-3xl font-bold mb-2">Employee Profile</h1>
            <p className="text-gray-300">
              View employee information and details
            </p>
          </div>
        </PageHeader>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 self-start">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center">
                <div className="relative inline-block mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full bg-k-yellow border-4 border-white overflow-hidden shadow-lg">
                    {emp?.documents?.photo?.[0] ? (
                      <img
                        src={emp.documents.photo[0]}
                        alt={emp.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={getAvatarUrl(emp?.gender, employee.employee_id)}
                        alt={emp?.full_name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-k-dark-grey">
                  {emp?.full_name || employee.employee_id}
                </h2>
                <p className="text-k-medium-grey text-sm mb-2">
                  {employee.email}
                </p>
                <p className="text-k-medium-grey text-sm mb-4">
                  {employee.employee_id}
                </p>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    employee.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {employee.is_active ? "Active Employee" : "Inactive"}
                </div>

                {/* Full Profile Link */}
                <button
                  onClick={() => navigate(`/admin/employees/${employee.employee_id}/full-profile`)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-k-orange/10 text-k-orange rounded-xl text-sm font-medium hover:bg-k-orange/20 transition-colors"
                >
                  <FiMaximize2 className="w-4 h-4" />
                  View Full Profile
                </button>
              </div>

              {/* Career Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Career Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPromotionModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <FiTrendingUp className="w-4 h-4" />
                    Promote
                  </button>
                  <button
                    onClick={() => setShowDemotionModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <FiTrendingDown className="w-4 h-4" />
                    Demote
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <FiRepeat className="w-4 h-4" />
                    Transfer
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-sm p-4 h-fit overflow-x-auto no-scrollbar">
                <nav className="flex lg:block gap-2 space-y-0 lg:space-y-2 min-w-max lg:min-w-0">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap lg:w-full ${
                          isActive
                            ? "bg-k-orange text-white shadow-md"
                            : "text-k-dark-grey hover:bg-orange-50 hover:text-k-orange"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={`shrink-0 ${
                            isActive ? "text-white" : "text-k-medium-grey"
                          }`}
                        />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 w-full">{renderSection()}</div>
          </div>
        </div>
      </div>

      {/* Career Management Modals */}
      <PromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        employeeId={employee.employee_id}
        employeeName={emp?.full_name || employee.employee_id}
        currentJobTitle={latestEmployment?.jobTitle?.title}
        currentDepartment={latestEmployment?.department?.name}
        currentSalary={latestEmployment?.gross_salary ? Number(latestEmployment.gross_salary) : 0}
        onSuccess={handleCareerActionSuccess}
      />

      <DemotionModal
        isOpen={showDemotionModal}
        onClose={() => setShowDemotionModal(false)}
        employeeId={employee.employee_id}
        employeeName={emp?.full_name || employee.employee_id}
        currentJobTitle={latestEmployment?.jobTitle?.title}
        currentSalary={latestEmployment?.gross_salary ? Number(latestEmployment.gross_salary) : 0}
        onSuccess={handleCareerActionSuccess}
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        employeeId={employee.employee_id}
        employeeName={emp?.full_name || employee.employee_id}
        currentJobTitle={latestEmployment?.jobTitle?.title}
        currentDepartment={latestEmployment?.department?.name}
        onSuccess={handleCareerActionSuccess}
      />
    </AdminLayout>
  );
}

function getLatestEmployment(employments: any[]) {
  if (!Array.isArray(employments) || employments.length === 0) return null;

  return employments.reduce((latest, current) => {
    if (!latest) return current;

    const latestCreated = latest?.created_at
      ? Date.parse(latest.created_at)
      : 0;
    const currentCreated = current?.created_at
      ? Date.parse(current.created_at)
      : 0;

    if (currentCreated && latestCreated) {
      return currentCreated > latestCreated ? current : latest;
    }

    const latestId = typeof latest?.id === "number" ? latest.id : 0;
    const currentId = typeof current?.id === "number" ? current.id : 0;
    return currentId > latestId ? current : latest;
  }, null as any);
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function EmploymentSection({
  employee,
  jobTitles,
  departments,
  departmentsLoading,
}: {
  employee: any;
  jobTitles: any[];
  departments: any[];
  departmentsLoading: boolean;
}) {
  const latestEmployment = getLatestEmployment(employee?.employments || []);

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [employment, setEmployment] = useState<any>(latestEmployment);

  useEffect(() => {
    setEmployment(latestEmployment);
  }, [latestEmployment]);

  const [form, setForm] = useState({
    employee_id: employee?.id || "",
    manager_id: "",
    department_id: "",
    job_title_id: "",
    employment_type: "Full Time",
    start_date: "",
  });

  useEffect(() => {
    if (!employment) return;
    setForm({
      employee_id: employment.employee_id || employee?.id || "",
      manager_id: employment.manager_id || "",
      department_id:
        employment.department_id !== undefined &&
        employment.department_id !== null
          ? String(employment.department_id)
          : employment.department?.id
          ? String(employment.department.id)
          : "",
      job_title_id:
        employment.job_title_id !== undefined &&
        employment.job_title_id !== null
          ? String(employment.job_title_id)
          : employment.jobTitle?.id
          ? String(employment.jobTitle.id)
          : "",
      employment_type: employment.employment_type || "Full Time",
      start_date: toDateInputValue(employment.start_date),
    });
  }, [employment, employee?.id]);

  const employmentTypes = ["Full Time", "Part-Time", "Contract", "Outsourced"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openEdit = () => {
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department_id) {
      ToastService.error("Department is required");
      return;
    }
    if (!form.job_title_id) {
      ToastService.error("Job title is required");
      return;
    }


    try {
      setSaving(true);
      const payload = {
        employee_id: form.employee_id,
        employment_type: form.employment_type,
        start_date: form.start_date,
        department_id: Number(form.department_id),
        job_title_id: Number(form.job_title_id),
        manager_id: form.manager_id || undefined,
      };

      if (employment?.id) {
        await makeCall({
          method: "PUT",
          route: apiRoutes.employmentById(Number(employment.id)),
          body: payload,
          isSecureRoute: true,
        });

        ToastService.success("Employment updated successfully!");

        setEmployment((prev: any) =>
          prev
            ? {
                ...prev,
                ...payload,
                department_id: payload.department_id,
                job_title_id: payload.job_title_id,
                department:
                  departments.find(
                    (d: any) => String(d?.id) === form.department_id
                  ) || prev.department,
                jobTitle:
                  jobTitles.find(
                    (j: any) => String(j?.id) === form.job_title_id
                  ) || prev.jobTitle,
              }
            : prev
        );
      } else {
        const res = await makeCall({
          method: "POST",
          route: apiRoutes.employments,
          body: payload,
          isSecureRoute: true,
        });

        ToastService.success("Employment added successfully!");

        const createdEmployment =
          (res as any)?.data?.data?.employment ||
          (res as any)?.data?.data ||
          (res as any)?.data?.employment ||
          (res as any)?.data;

        setEmployment({
          ...(createdEmployment || {}),
          ...payload,
          department:
            departments.find(
              (d: any) => String(d?.id) === form.department_id
            ) || createdEmployment?.department,
          jobTitle:
            jobTitles.find((j: any) => String(j?.id) === form.job_title_id) ||
            createdEmployment?.jobTitle,
        });
      }

      setEditOpen(false);
    } catch (err: any) {
      ToastService.error(err?.message || "Failed to update employment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Employment</h2>
        <Button
          variant="outline"
          type="button"
          icon={FiBriefcase}
          onClick={openEdit}
        >
          {employment?.id ? "Edit Employment" : "Add Employment"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          label="Department"
          value={employment?.department?.name || "-"}
        />
        <InfoField
          label="Job Title"
          value={
            employment?.jobTitle?.title
              ? `${employment.jobTitle.title}${
                  employment.jobTitle.level
                    ? ` - ${employment.jobTitle.level}`
                    : ""
                }`
              : "-"
          }
        />
        <InfoField
          label="Employment Type"
          value={employment?.employment_type || "-"}
        />
        <InfoField
          label="Start Date"
          value={
            employment?.start_date
              ? new Date(employment.start_date).toLocaleDateString()
              : "-"
          }
        />
        <InfoField label="Manager ID" value={employment?.manager_id || "-"} />
      </div>

      <Modal
        isOpen={editOpen}
        onClose={closeEdit}
        title={employment?.id ? "Update Employment" : "Add Employment"}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Employee ID"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              required
              disabled
              icon={FiUser}
            />

            <FormField
              label="Manager ID (Optional)"
              name="manager_id"
              value={form.manager_id}
              onChange={handleChange}
              icon={FiUser}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Department"
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              required
              disabled={departmentsLoading}
              options={(departments || []).map((d: any) => ({
                label: d?.name,
                value: String(d?.id),
              }))}
            />

            <FormField
              type="select"
              label="Job Title"
              name="job_title_id"
              value={form.job_title_id}
              onChange={handleChange}
              required
              options={(jobTitles || []).map((j: any) => ({
                label: `${j?.title || "-"}${j?.level ? ` - ${j.level}` : ""}`,
                value: String(j?.id),
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Employment Type"
              name="employment_type"
              value={form.employment_type}
              onChange={handleChange}
              options={employmentTypes.map((t) => ({ label: t, value: t }))}
            />

            <FormField
              label="Start Date"
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              icon={FiCalendar}
            />
          </div>



          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={closeEdit}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              {employment?.id ? "Update Employment" : "Add Employment"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Section Components
function PersonalSection({
  employee,
  formatDate,
  getGenderLabel,
}: {
  employee: any;
  formatDate: (date: string | null) => string;
  getGenderLabel: (gender: string | null) => string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Personal Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Full Name" value={employee?.full_name} />
        <InfoField label="Gender" value={getGenderLabel(employee?.gender)} />
        <InfoField
          label="Date of Birth"
          value={formatDate(employee?.date_of_birth)}
        />
        <InfoField
          label="TIN Number"
          value={employee?.tin_number || "Not provided"}
        />
        <InfoField
          label="Pension Number"
          value={employee?.pension_number || "Not provided"}
        />
        <InfoField
          label="Place of Work"
          value={employee?.place_of_work || "Not assigned"}
        />
      </div>
    </div>
  );
}

function ContactSection({ employee, email }: { employee: any; email: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Contact Details</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center">
            <FiMail className="w-5 h-5 text-k-orange" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-k-dark-grey">{email}</p>
          </div>
        </div>

        {employee?.phones?.map((phone: any, index: number) => (
          <div
            key={phone.id || index}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-k-orange" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                {phone.phone_type}{" "}
                {phone.is_primary && (
                  <span className="text-k-orange">(Primary)</span>
                )}
              </p>
              <p className="font-medium text-k-dark-grey">
                {phone.phone_number}
              </p>
            </div>
          </div>
        ))}

        {employee?.addresses?.map((address: any, index: number) => (
          <div
            key={address.id || index}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-k-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-k-dark-grey">
                {[
                  address.city,
                  address.sub_city,
                  address.woreda,
                  address.region,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </p>
            </div>
          </div>
        ))}

        {(!employee?.phones || employee.phones.length === 0) &&
          (!employee?.addresses || employee.addresses.length === 0) && (
            <p className="text-gray-500 text-center py-8">
              No contact information provided.
            </p>
          )}
      </div>
    </div>
  );
}

function EducationSection({
  educations,
  formatDate,
}: {
  educations: any[] | undefined;
  formatDate: (date: string | null) => string;
}) {
  if (!educations || educations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
          Education
        </h2>
        <p className="text-gray-500 text-center py-8">
          No education records provided.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
        Education
      </h2>
      <div className="space-y-4">
        {educations.map((edu, index) =>
          (() => {
            const level =
              edu?.level ??
              edu?.educationLevel ??
              edu?.education_level ??
              edu?.education_level_id;

            const fieldOfStudy =
              edu?.fieldOfStudy ??
              edu?.field_of_study ??
              edu?.field_of_study_id;

            const institution =
              edu?.institution ?? edu?.institution_name ?? edu?.institution_id;

            const programType =
              edu?.programType ?? edu?.program_type ?? edu?.program_type_id;

            const start = edu?.startDate ?? edu?.start_date;
            const end = edu?.endDate ?? edu?.end_date;
            const isCurrent = edu?.isCurrent ?? edu?.is_current;
            const hasCostSharing = edu?.hasCostSharing ?? edu?.has_cost_sharing;
            const costSharingUrl =
              edu?.costSharingUrl ??
              edu?.costSharingDocument ??
              edu?.cost_sharing_document_url ??
              edu?.cost_sharing_url ??
              edu?.costSharingLink ??
              edu?.cost_sharing_link ??
              null;

            const durationText = `${formatDate(start)} - ${
              isCurrent && !end ? "Present" : formatDate(end)
            }`;

            return (
              <div
                key={edu.id || index}
                className="p-4 bg-gray-50 rounded-xl border-l-4 border-k-orange"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center shrink-0">
                    <FiBookOpen className="w-5 h-5 text-k-orange" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-k-dark-grey truncate">
                          {level ? `Level ${level}` : "Education"}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 truncate">
                          {fieldOfStudy ?? "-"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {institution ?? "-"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full">
                          {programType ?? "-"}
                        </span>
                        {hasCostSharing && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-k-orange/10 text-k-orange border border-k-orange/20">
                            Cost Sharing
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                      {durationText}
                    </div>

                    {costSharingUrl && (
                      <a
                        href={costSharingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-k-orange hover:underline"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Cost sharing resource
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}

function WorkExperienceSection({
  histories,
  formatDate,
}: {
  histories: any[] | undefined;
  formatDate: (date: string | null) => string;
}) {
  if (!histories || histories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
          Work Experience
        </h2>
        <p className="text-gray-500 text-center py-8">
          No work experience records provided.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
        Work Experience
      </h2>
      <div className="space-y-4">
        {histories.map((hist, index) =>
          (() => {
            const company =
              hist?.previousCompanyName ??
              hist?.previous_company_name ??
              hist?.previous_company ??
              "-";

            const title =
              hist?.jobTitle ??
              hist?.previous_job_title_text ??
              hist?.previous_job_title ??
              null;

            const level = hist?.previousLevel ?? hist?.previous_level ?? null;
            const department =
              hist?.departmentName ?? hist?.department_name ?? null;

            const start = hist?.startDate ?? hist?.start_date;
            const end = hist?.endDate ?? hist?.end_date;
            const durationText = `${formatDate(start)} - ${
              end ? formatDate(end) : "Present"
            }`;

            return (
              <div
                key={hist.id || index}
                className="p-4 bg-gray-50 rounded-xl border-l-4 border-k-orange"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center shrink-0">
                    <FiBriefcase className="w-5 h-5 text-k-orange" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-k-dark-grey truncate">
                          {company}
                        </p>
                        {title && (
                          <p className="text-sm text-gray-600 mt-0.5 truncate">
                            {title}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {department && (
                          <span className="text-xs text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full">
                            {department}
                          </span>
                        )}
                        {level && (
                          <span className="text-xs text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full">
                            {level}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                      {durationText}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}

function CertificationsSection({
  certifications,
}: {
  certifications: any[] | undefined;
}) {
  if (!certifications || certifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
          Certifications
        </h2>
        <p className="text-gray-500 text-center py-8">
          No certifications provided.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
        Certifications
      </h2>
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={cert.id || index} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center shrink-0">
                <FiAward className="w-5 h-5 text-k-orange" />
              </div>
              <div>
                <p className="font-medium text-k-dark-grey">{cert.name}</p>
                <p className="text-sm text-gray-500">
                  {cert.issuing_organization}
                </p>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-k-orange hover:underline"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    View Credential
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsSection({ documents }: { documents: any | null }) {
  const hasDocuments =
    documents &&
    (documents.cv?.length > 0 ||
      documents.certificates?.length > 0 ||
      documents.photo?.length > 0 ||
      documents.experienceLetters?.length > 0 ||
      documents.taxForms?.length > 0 ||
      documents.pensionForms?.length > 0);

  if (!hasDocuments) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
          Documents
        </h2>
        <p className="text-gray-500 text-center py-8">No documents uploaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
        Documents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.cv?.length > 0 && (
          <DocumentCard title="CV/Resume" files={documents.cv} />
        )}
        {documents.certificates?.length > 0 && (
          <DocumentCard title="Certificates" files={documents.certificates} />
        )}
        {documents.photo?.length > 0 && (
          <DocumentCard title="Photo" files={documents.photo} />
        )}
        {documents.experienceLetters?.length > 0 && (
          <DocumentCard
            title="Experience Letters"
            files={documents.experienceLetters}
          />
        )}
        {documents.taxForms?.length > 0 && (
          <DocumentCard title="Tax Forms" files={documents.taxForms} />
        )}
        {documents.pensionForms?.length > 0 && (
          <DocumentCard title="Pension Forms" files={documents.pensionForms} />
        )}
      </div>
    </div>
  );
}

function DocumentCard({ title, files }: { title: string; files: string[] }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <FiFile className="w-5 h-5 text-k-orange" />
        <p className="font-medium text-k-dark-grey">{title}</p>
      </div>
      <div className="space-y-2">
        {files.map((file, index) => (
          <a
            key={index}
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-k-orange hover:underline"
          >
            <FiDownload className="w-4 h-4" />
            View Document {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-k-dark-grey">{value || "N/A"}</p>
    </div>
  );
}

function CompensationSection({
  employee,
  allowanceTypes,
}: {
  employee: any;
  allowanceTypes: any[];
}) {
  const latestEmployment = getLatestEmployment(employee?.employments || []);
  const navigate = useNavigate();

  if (!latestEmployment) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">
          Compensation
        </h2>
        <p className="text-gray-500 text-center py-8">
          No employment record found. Please add employment first to manage compensation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Compensation</h2>
        <Button
          variant="outline"
          type="button"
          icon={FiDollarSign}
          onClick={() =>
            navigate(
              `${routeConstants.createEmployment}?employeeId=${employee.id}&employmentId=${latestEmployment.id}`
            )
          }
        >
          Update Compensation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoField
          label="Gross Salary"
          value={latestEmployment.gross_salary ? `${Number(latestEmployment.gross_salary).toLocaleString()} ETB` : "-"}
        />
        <InfoField
          label="Basic Salary"
          value={latestEmployment.basic_salary ? `${Number(latestEmployment.basic_salary).toLocaleString()} ETB` : "-"}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-k-dark-grey mb-4 flex items-center gap-2">
          <FiDollarSign className="text-k-orange" /> Allowances
        </h3>
        {latestEmployment.allowances && latestEmployment.allowances.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestEmployment.allowances.map((a: any, index: number) => {
              const typeName = a.allowanceType?.name || allowanceTypes.find((at: any) => at.id === a.allowance_type_id)?.name || "Allowance";
              return (
                <div key={a.id || index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">{typeName}</p>
                  <p className="font-bold text-k-dark-grey">{Number(a.amount).toLocaleString()} ETB</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No allowances assigned.</p>
        )}
      </div>
    </div>
  );
}
