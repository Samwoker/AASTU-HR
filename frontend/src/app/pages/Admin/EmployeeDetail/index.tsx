import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import Card from "../../../components/Core/ui/Card";
import InfoGrid from "../../../components/Core/ui/InfoGrid";
import Info from "../../../components/Core/ui/Info";
import Badge from "../../../components/Core/ui/Badge";
import SalaryItem from "../../../components/Core/ui/SalaryItem";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiPhone,
  FiMapPin,
  FiBook,
  FiAward,
  FiFileText,
  FiCheck,
  FiEdit2,
  FiMail,
  FiCalendar,
  FiTrendingUp,
  FiDownload,
} from "react-icons/fi";
import { useEmployeeDetailSlice } from "./slice";
import {
  selectEmployee,
  selectEmployeeLoading,
  selectUpdateSuccess,
  selectEmployeeError,
  selectDetailsCache,
} from "./slice/selectors";
// Types imported but not used directly in component logic can be removed or kept if needed for casting.
// Removed unused import.

// Import Onboarding Steps for Editing
import StepPersonalInfo from "../../../components/Employee/Onboarding/Wizard/StepPersonalInfo";
import StepContactInfo from "../../../components/Employee/Onboarding/Wizard/StepContactInfo";
import EditEmploymentForm from "./EditEmploymentForm";
import StepEducation from "../../../components/Employee/Onboarding/Wizard/StepEducation";
import StepWorkExperience from "../../../components/Employee/Onboarding/Wizard/StepWorkExperience";
import StepCertifications from "../../../components/Employee/Onboarding/Wizard/StepCertifications";
import StepDocuments from "../../../components/Employee/Onboarding/Wizard/StepDocuments";
import CareerTimeline from "../../../components/Employee/CareerTimeline";
import { getFileUrl } from "../../../utils/fileUtils";
import LoadingSkeleton from "../../../components/common/LoadingSkeleton";
import apiRoutes from "../../../API/apiRoutes";

// Tabs Configuration
const TABS = [
  { id: "personal", label: "Personal", icon: <FiUser /> },
  { id: "contact", label: "Contact", icon: <FiPhone /> },
  { id: "employment", label: "Employment", icon: <FiBriefcase /> },
  { id: "career", label: "Career Path", icon: <FiTrendingUp /> },
  { id: "education", label: "Education", icon: <FiBook /> },
  { id: "experience", label: "Experience", icon: <FiBriefcase /> },
  { id: "certifications", label: "Certifications", icon: <FiAward /> },
  { id: "documents", label: "Documents", icon: <FiFileText /> },
];

export default function EmployeeDetailsPage() {
  const { employeeId, id } = useParams<{
    employeeId?: string;
    id?: string;
  }>();
  const resolvedEmployeeId = employeeId || id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useEmployeeDetailSlice();

  const detailsCache = useSelector(selectDetailsCache);
  const cachedEmployee = resolvedEmployeeId
    ? detailsCache[resolvedEmployeeId]?.data
    : null;
  const reduxEmployee = useSelector(selectEmployee);

  // Use redux employee if present, otherwise fallback to cache for instant view
  const employee = reduxEmployee || cachedEmployee;

  const normalizeExternalUrl = (url: string) => {
    const trimmed = String(url || "").trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const ViewLink = ({ url }: { url: string }) => {
    const href = normalizeExternalUrl(url);
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-[#DB5E00] hover:underline font-medium"
      >
        View
      </a>
    );
  };

  const documentsArray: any[] = (() => {
    const raw = (employee as any)?.documents;
    if (!raw) return [];

    // Some APIs return a list of document objects; others return a bucket object with arrays of URLs.
    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === "object") {
      // If it's the bucket format (cv/photo/etc arrays of urls), flatten all arrays
      return Object.values(raw).flatMap((v: any) =>
        Array.isArray(v) ? v : []
      );
    }

    return [];
  })();

  const loading = useSelector(selectEmployeeLoading);
  const updateSuccess = useSelector(selectUpdateSuccess);
  const error = useSelector(selectEmployeeError);

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (resolvedEmployeeId) {
      dispatch(actions.fetchEmployeeRequest(resolvedEmployeeId));
    }
    // We keep the employee in state for a bit, but clear on unmount is standard.
    // However, since we have the cache, the NEXT mount will be instant.
    return () => {
      dispatch(actions.clearEmployee());
    };
  }, [resolvedEmployeeId, dispatch, actions]);

  // Map Redux Employee -> Wizard Form Data
  useEffect(() => {
    if (employee && !isEditing) {
      const documentsArray: any[] = (() => {
        const raw = (employee as any).documents;
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") {
          return Object.values(raw).flatMap((v: any) =>
            Array.isArray(v) ? v : []
          );
        }
        return [];
      })();

      const filterDocumentsByType = (types: string[]) =>
        documentsArray.filter(
          (d: any) =>
            d && typeof d === "object" && types.includes(d.document_type)
        );

      const mappedData = {
        // Personal
        fullName: employee.full_name,
        gender: employee.gender,
        dateOfBirth: employee.date_of_birth
          ? employee.date_of_birth.substring(0, 10)
          : "",
        tinNumber: employee.tin_number,
        pensionNumber: employee.pension_number,
        placeOfWork: employee.place_of_work,

        // Contact
        region: employee.addresses?.[0]?.region || "",
        city: employee.addresses?.[0]?.city || "",
        subCity: employee.addresses?.[0]?.sub_city || "",
        woreda: employee.addresses?.[0]?.woreda || "",
        phones:
          employee.phones?.map((p) => ({
            id: p.id,
            number: p.phone_number,
            type: p.phone_type || "Mobile",
            isPrimary: p.is_primary,
          })) || [],

        // Employment
        employee_id: employee.employee_id,
        title:
          typeof employee.job_title === "object"
            ? (employee.job_title as any)?.title ||
              (employee.job_title as any)?.name
            : employee.job_title,
        titleId:
          typeof employee.job_title === "object"
            ? (employee.job_title as any)?.id
            : undefined,
        level: employee.job_level,
        department:
          typeof employee.department === "object"
            ? (employee.department as any)?.name
            : employee.department,
        departmentId:
          typeof employee.department === "object"
            ? (employee.department as any)?.id
            : undefined,
        employment_type: employee.employment_type,
        start_date: employee.start_date
          ? employee.start_date.substring(0, 10)
          : "",

        // Salary - Source from Active Employment to ensure all allowances are captured
        // The backend might split them in 'salary' helper, but 'employments' has the raw list
        ...(() => {
          const activeEmployment =
            employee.employments?.find((e: any) => e.is_active) ||
            employee.employments?.[0];
          return {
            gross_salary:
              activeEmployment?.gross_salary || employee.salary?.gross || 0,
            basic_salary:
              activeEmployment?.basic_salary || employee.salary?.basic || 0,
            allowances:
              activeEmployment?.allowances?.map((a: any) => ({
                name: a.allowanceType?.name || "Unknown",
                amount: a.amount,
              })) || [],
          };
        })(),

        // Collections - explicitly name them to match Wizard expectations
        education: (employee.educations || []).map((edu) => ({
          level: edu.educationLevel?.name || "",
          fieldOfStudy: edu.fieldOfStudy?.name || "",
          institution: edu.institution?.name || "",
          institutionCategory: edu.institution?.category || "Private",
          programType: edu.program_type || "",
          hasCostSharing:
            edu.has_cost_sharing ||
            (edu.costSharings && edu.costSharings.length > 0) ||
            false,
          costSharingDocumentNumber:
            edu.costSharings?.[0]?.document_number || "",
          costSharingIssuingInstitution:
            edu.costSharings?.[0]?.issuing_institution || "",
          costSharingIssueDate: edu.costSharings?.[0]?.issue_date
            ? edu.costSharings[0].issue_date.substring(0, 10)
            : "",
          costSharingTotalCost:
            edu.costSharings?.[0]?.declared_total_cost || "",
          costSharingRemarks: edu.costSharings?.[0]?.remarks || "",
          costSharingDocument: null,
          document: null,
          id: edu.id,
          documentUrl: edu.document_url,
          costSharingDocumentUrl:
            edu.costSharings?.[0]?.document_url ||
            edu.cost_sharing_document_url,
        })),
        workExperience: (employee.employmentHistories || []).map((exp) => ({
          companyName: exp.company_name || "",
          jobTitle: exp.job_title || "",
          level: exp.job_level || "",
          department: exp.department || "",
          startDate: exp.start_date ? exp.start_date.substring(0, 10) : "",
          endDate: exp.end_date ? exp.end_date.substring(0, 10) : "",
          isCurrent: exp.is_current || false,
          employmentType: exp.employment_type || "",
          documentUrl: exp.document_url || "",
          id: exp.id,
        })),
        certifications: (employee.licensesAndCertifications || []).map(
          (cert) => ({
            name: cert.name || "",
            issuingOrganization: cert.issuing_organization || "",
            issueDate: cert.issue_date ? cert.issue_date.substring(0, 10) : "",
            expirationDate: cert.expiration_date
              ? cert.expiration_date.substring(0, 10)
              : "",
            credentialId: cert.credential_id || "",
            credentialUrl: cert.credential_url || "",
            documentUrl: cert.document_url || "",
            id: cert.id,
          })
        ),
        documents: {
          cv: filterDocumentsByType(["CV"]),
          // Map various ID types to the idDocument field
          idDocument: filterDocumentsByType([
            "ID_DOCUMENT",
            "ID_CARD",
            "PASSPORT",
            "ID/Passport",
          ]),
          // If old data was PHOTO and we want to show it:
          // The issue is PHOTO is filtered out by backend updateDocuments.
          // Yet fetchEmployee returns it.
          // If we mapped 'PHOTO' to idDocument here, it would show up.
          // But on save, we save as 'ID_DOCUMENT'.
          // So let's include 'PHOTO' in the fetch mapping so user sees existing ones (if any survived).
          // But strict separating is safer. 'ID_DOCUMENT' is the new target.
          taxForms: filterDocumentsByType(["TAX", "TAX_FORM"]),
          pensionForms: filterDocumentsByType(["PENSION", "PENSION_FORM"]),
        },
      };
      setFormData(mappedData);
    }
  }, [employee, isEditing]);

  // Handle successful update to close edit mode
  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
    }
  }, [updateSuccess]);

  // Entity Maps for ID lookup
  const [deptMap, setDeptMap] = useState<Record<string, number>>({});
  const [jobMap, setJobMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch all departments and job titles to map names to IDs
    const fetchEntities = async () => {
      try {
        const [deptRes, jobRes] = await Promise.all([
          // We might need to import apiRoutes and makeCall OR use a service
          // But wait, makeCall is not imported here directly usually?
          // It is imported in saga.
          // Let's use the slice actions? No, slice doesn't have fetchDepartments.
          // We can blindly import makeCall here for this fix.
          import("../../../API").then((mod) =>
            mod.default({
              route: apiRoutes.departments,
              method: "GET",
              isSecureRoute: true,
            })
          ),
          import("../../../API").then((mod) =>
            mod.default({
              route: apiRoutes.jobTitles,
              method: "GET",
              isSecureRoute: true,
            })
          ),
        ]);

        const extractArray = (payload: any, fallbackKeys: string[] = []) => {
          // Most common shapes:
          // - { status, message, data: [...] }
          // - { status, message, data: { items: [...] } }
          // - AxiosResponse where payload = response.data
          const root = payload?.data ?? payload;
          const candidate = root?.data ?? root;
          if (Array.isArray(candidate)) return candidate;
          for (const key of fallbackKeys) {
            const v = candidate?.[key] ?? root?.[key];
            if (Array.isArray(v)) return v;
          }
          return [];
        };

        const deptList = extractArray(deptRes, [
          "departments",
          "rows",
          "items",
        ]);
        if (deptList.length > 0) {
          const map: Record<string, number> = {};
          deptList.forEach((d: any) => {
            if (!d) return;
            const name = d.name ?? d.department_name;
            const id = d.id;
            if (name && id != null) map[String(name)] = Number(id);
          });
          setDeptMap(map);
        }

        const jobList = extractArray(jobRes, [
          "jobTitles",
          "job_titles",
          "rows",
          "items",
        ]);
        if (jobList.length > 0) {
          const map: Record<string, number> = {};
          jobList.forEach((j: any) => {
            if (!j) return;
            const title = j.title ?? j.name;
            const id = j.id;
            if (title && id != null) map[String(title)] = Number(id);
          });
          setJobMap(map);
        }
      } catch (e) {
        console.error("Failed to fetch entity maps", e);
      }
    };
    fetchEntities();
  }, []);

  const handleWizardChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const updates: any = { [field]: value };
      // Auto-update IDs if names change
      if (field === "department") {
        updates.departmentId = deptMap[value];
      }
      if (field === "title") {
        updates.titleId = jobMap[value];
      }
      return { ...prev, ...updates };
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!employee || !formData) return;

    // Map Wizard Form Data -> Redux/Backend Employee
    const submissionData: any = {
      full_name: formData.fullName,
      gender: formData.gender,
      date_of_birth: formData.dateOfBirth,
      tin_number: formData.tinNumber,
      pension_number: formData.pensionNumber,
      place_of_work: formData.placeOfWork,

      job_title: formData.title,
      job_title_id: Number(formData.titleId), // Assuming title might be an ID if selected from dropdown
      job_level: formData.level,
      department: formData.department,
      department_id: Number(formData.departmentId), // Assuming department might be an ID if selected from dropdown
      employment_type: formData.employment_type,
      start_date: formData.start_date,

      gross_salary: Number(formData.gross_salary),
      basic_salary: Number(formData.basic_salary),
      transport_allowance: Number(
        (formData.allowances || []).find(
          (a: any) => a.name === "Transportation Allowance"
        )?.amount || 0
      ),
      housing_allowance: Number(
        (formData.allowances || []).find(
          (a: any) => a.name === "Housing Allowance"
        )?.amount || 0
      ),
      meal_allowance: Number(
        (formData.allowances || []).find(
          (a: any) => a.name === "Meal Allowance"
        )?.amount || 0
      ),
      allowances: (formData.allowances || [])
        .filter(
          (a: any) =>
            ![
              "Transportation Allowance",
              "Housing Allowance",
              "Meal Allowance",
            ].includes(a.name)
        )
        .map((a: any) => ({
          name: a.name,
          amount: Number(a.amount),
        })),

      // Address & Phones need careful handling as backend likely expects specific format
      // For now, assume address is updated via updating the FIRST address in array
      address: [
        {
          ...(employee.addresses?.[0]?.id
            ? { id: employee.addresses[0].id }
            : {}),
          region: formData.region,
          city: formData.city,
          sub_city: formData.subCity,
          woreda: formData.woreda,
        },
      ],
      phones: (formData.phones || []).map((p: any) => {
        const phone: any = {
          phone_number: p.number,
          phone_type: p.type,
          is_primary: p.isPrimary,
        };
        if (p.id) phone.id = p.id;
        return phone;
      }),

      education: (formData.education || []).map((edu: any) => ({
        id: edu.id,
        institution: edu.institution,
        institution_category: edu.institutionCategory, // Added this field
        field_of_study: edu.fieldOfStudy,
        level: edu.level,
        program_type: edu.programType,
        has_cost_sharing:
          edu.hasCostSharing === true ||
          !!edu.costSharingDocumentUrl ||
          !!edu.costSharingDocument,
        costSharingDocumentUrl: edu.id ? edu.costSharingDocumentUrl : undefined,
        // Detailed cost sharing fields for backend support
        costSharingDocumentNumber: edu.costSharingDocumentNumber,
        costSharingIssuingInstitution: edu.costSharingIssuingInstitution,
        costSharingIssueDate: edu.costSharingIssueDate,
        costSharingTotalCost: edu.costSharingTotalCost,
        costSharingRemarks: edu.costSharingRemarks,
        documentUrl: edu.documentUrl,
        // Carry over file objects for saga to handle
        costSharingDocument: edu.costSharingDocument,
        document: edu.document,
      })),
      work_experience: (formData.workExperience || formData.experience || [])
        .filter(
          (exp: any) =>
            exp.companyName || exp.company_name || exp.jobTitle || exp.job_title
        )
        .map((exp: any) => ({
          id: exp.id,
          phone_number: exp.phone_number || "", // Ensure phone is present if schema needs it (though not in error)
          company_name: exp.companyName || exp.company_name || "", // Default to empty string
          job_title: exp.jobTitle || exp.job_title || "", // Default to empty string
          job_level: exp.level || exp.job_level || "", // Default to empty string
          department: exp.department || "",
          employment_type:
            exp.employmentType || exp.employment_type || "Full Time", // Provide default
          // Strict Date Check: prevent "Invalid Date" string or empty string
          ...(exp.startDate &&
          exp.startDate !== "Invalid Date" &&
          !isNaN(Date.parse(exp.startDate))
            ? { start_date: exp.startDate }
            : {}),
          ...(exp.endDate &&
          exp.endDate !== "Invalid Date" &&
          !isNaN(Date.parse(exp.endDate))
            ? { end_date: exp.endDate }
            : {}),
          currentlyWorksHere: exp.isCurrent,
          documentUrl: exp.documentUrl,
          document: exp.document,
        })),
      certifications: (formData.certifications || []).map((cert: any) => ({
        id: cert.id,
        name: cert.name,
        issuing_organization: cert.issuingOrganization,
        issue_date: cert.issueDate,
        expiration_date: cert.expirationDate,
        credential_id: cert.credentialId,
        credential_url: cert.credentialUrl,
        documentUrl: cert.documentUrl,
        // Carry over file object
        certificateDocument: cert.certificateDocument,
      })),
      documents: [
        ...(formData.documents?.cv || []).map((d: any) =>
          d.id || d.url || d.document_url
            ? {
                id: d.id,
                type: "CV",
                url: d.document_url || d.url,
                name: d.file_name || d.name,
              }
            : { file: d, type: "CV" }
        ),
        ...(formData.documents?.idDocument || []).map((d: any) =>
          d.id || d.url || d.document_url
            ? {
                id: d.id,
                type: "ID_DOCUMENT",
                url: d.document_url || d.url,
                name: d.file_name || d.name,
              }
            : { file: d, type: "ID_DOCUMENT" }
        ),
        ...(formData.documents?.taxForms || []).map((d: any) =>
          d.id || d.url || d.document_url
            ? {
                id: d.id,
                type: "TAX_FORM",
                url: d.document_url || d.url,
                name: d.file_name || d.name,
              }
            : { file: d, type: "TAX_FORM" }
        ),
        ...(formData.documents?.pensionForms || []).map((d: any) =>
          d.id || d.url || d.document_url
            ? {
                id: d.id,
                type: "PENSION_FORM",
                url: d.document_url || d.url,
                name: d.file_name || d.name,
              }
            : { file: d, type: "PENSION_FORM" }
        ),
      ],
    };

    dispatch(
      actions.updateEmployeeRequest({
        id: employee.id,
        section: activeTab,
        ...submissionData,
      })
    );
  };

  const handleApprove = () => {
    if (resolvedEmployeeId)
      dispatch(actions.approveEmployeeRequest(resolvedEmployeeId));
  };

  if (loading && !employee) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSkeleton variant="rectangular" width="100%" height={400} />
        </div>
      </AdminLayout>
    );
  }

  if (error && !employee) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="text-red-500 text-xl font-bold mb-2">
            Failed to load employee
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button
            variant="primary"
            onClick={() =>
              resolvedEmployeeId &&
              dispatch(actions.fetchEmployeeRequest(resolvedEmployeeId))
            }
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (!employee) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="text-gray-500 text-lg">Employee not found</span>
        </div>
      </AdminLayout>
    );
  }

  const isPending = employee.onboarding_status !== "COMPLETED";

  const isPendingApproval = employee.onboarding_status === "PENDING_APPROVAL";

  const renderContent = () => {
    // EDIT MODE
    if (isEditing) {
      const stepProps = {
        formData,
        handleChange: handleWizardChange,
        updateFormData, // Some steps use this
        errors: {}, // Handle errors if needed
      };

      return (
        <Card
          title={`Edit ${TABS.find((t) => t.id === activeTab)?.label}`}
          className="border-[#DB5E00] border-2"
        >
          <div className="py-4">
            {activeTab === "personal" && <StepPersonalInfo {...stepProps} />}
            {activeTab === "contact" && <StepContactInfo {...stepProps} />}
            {activeTab === "employment" && (
              <EditEmploymentForm {...stepProps} />
            )}
            {activeTab === "education" && <StepEducation {...stepProps} />}
            {activeTab === "experience" && (
              <StepWorkExperience {...stepProps} />
            )}
            {activeTab === "certifications" && (
              <StepCertifications {...stepProps} />
            )}
            {activeTab === "documents" && <StepDocuments {...stepProps} />}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
          </div>
        </Card>
      );
    }

    // READ MODE
    const editAction = (
      <Button
        variant="outline"
        className="ml-auto"
        onClick={() => setIsEditing(true)}
        icon={FiEdit2}
      >
        Edit
      </Button>
    );

    switch (activeTab) {
      case "personal":
        return (
          <Card
            title="Personal Information"
            icon={<FiUser />}
            action={editAction}
          >
            <InfoGrid>
              <Info label="Full Name" value={employee.full_name} />
              <Info label="Gender" value={employee.gender} />
              <Info label="Date of Birth" value={employee.date_of_birth} />
              <Info label="TIN Number" value={employee.tin_number || "-"} />
              <Info
                label="Pension Number"
                value={employee.pension_number || "-"}
              />
              <Info
                label="Place of Work"
                value={employee.place_of_work || "-"}
              />
            </InfoGrid>
          </Card>
        );
      case "contact":
        return (
          <div className="space-y-6">
            <Card title="Address" icon={<FiMapPin />} action={editAction}>
              {employee.addresses?.[0] ? (
                <InfoGrid>
                  <Info label="Region" value={employee.addresses[0].region} />
                  <Info label="City" value={employee.addresses[0].city} />
                  <Info
                    label="Sub City"
                    value={employee.addresses[0].sub_city}
                  />
                  <Info label="Woreda" value={employee.addresses[0].woreda} />
                </InfoGrid>
              ) : (
                <p className="text-gray-500 italic">No address found.</p>
              )}
            </Card>
            <Card title="Phone Numbers" icon={<FiPhone />}>
              {employee.phones?.map((phone, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2 last:mb-0"
                >
                  <div className="font-medium text-gray-900">
                    {phone.phone_number}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-500 capitalize">
                      {phone.phone_type || "Mobile"}
                    </span>
                    {phone.is_primary && (
                      <span className="text-[#DB5E00] font-medium">
                        • Primary
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {(!employee.phones || employee.phones.length === 0) && (
                <p className="text-gray-500 italic">No phone numbers.</p>
              )}
            </Card>
          </div>
        );
      case "employment":
        return (
          <div className="space-y-6">
            <Card
              title="Employment Details"
              icon={<FiBriefcase />}
              action={
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    className=""
                    onClick={() =>
                      resolvedEmployeeId &&
                      navigate(`/admin/employees/${resolvedEmployeeId}/promote`)
                    }
                    icon={FiTrendingUp}
                  >
                    Career Event
                  </Button>
                  {editAction}
                </div>
              }
            >
              <InfoGrid>
                <Info
                  label="Employee ID"
                  value={employee.employee_id || employee.id}
                />
                <Info label="Job Title" value={employee.job_title} />
                <Info label="Job Level" value={employee.job_level || "-"} />
                <Info label="Department" value={employee.department} />
                <Info
                  label="Employment Type"
                  value={employee.employment_type || "-"}
                />
                <Info label="Start Date" value={employee.start_date || "-"} />
              </InfoGrid>
            </Card>
            <Card title="Salary Breakdown" icon={<FiDollarSign />}>
              {(() => {
                const activeEmployment =
                  employee.employments?.find((e: any) => e.is_active) ||
                  employee.employments?.[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SalaryItem
                      label="Gross Salary"
                      amount={Number(activeEmployment?.gross_salary) || 0}
                      highlight
                    />
                    <SalaryItem
                      label="Basic Salary"
                      amount={Number(activeEmployment?.basic_salary) || 0}
                    />
                    {/* Render all allowances from the active employment */}
                    {(activeEmployment?.allowances || []).map(
                      (allowance: any, idx: number) => (
                        <SalaryItem
                          key={idx}
                          label={allowance.allowanceType?.name || "Allowance"}
                          amount={Number(allowance.amount) || 0}
                        />
                      )
                    )}
                    {(!activeEmployment?.allowances ||
                      activeEmployment.allowances.length === 0) && (
                      <div className="col-span-2 text-gray-400 text-sm italic">
                        No allowances configured.
                      </div>
                    )}
                  </div>
                );
              })()}
            </Card>
          </div>
        );
      case "education":
        return (
          <Card title="Education" icon={<FiBook />} action={editAction}>
            <div className="space-y-4">
              {employee.educations?.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <h3 className="font-bold text-gray-900">
                    {edu.institution?.name || "Unknown Institution"}
                  </h3>
                  <p className="text-[#DB5E00] font-medium">
                    {edu.fieldOfStudy?.name || "Unknown Field of Study"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {edu.educationLevel?.name || "Unknown Level"} •{" "}
                    {edu.program_type} •{" "}
                    <span className="text-gray-400 italic text-[11px] uppercase tracking-tighter bg-gray-100 px-1.5 py-0.5 rounded">
                      {edu.institution?.category || "Unknown Type"}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {(edu.has_cost_sharing || edu.hasCostSharing) && (
                      <Badge variant="warning">Cost Sharing</Badge>
                    )}
                    {(edu.cost_sharing_document_url ||
                      edu.costSharings?.[0]?.document_url) && (
                      <span className="text-xs flex items-center gap-2 bg-orange-50 px-2 py-1 rounded">
                        <FiFileText className="text-[#DB5E00]" />
                        <span className="text-gray-700">Cost Sharing Doc</span>
                        <ViewLink
                          url={
                            edu.cost_sharing_document_url ||
                            edu.costSharings?.[0]?.document_url
                          }
                        />
                      </span>
                    )}

                    {Array.isArray(edu.document_urls) &&
                      edu.document_urls.length > 0 && (
                        <span className="text-xs flex items-center gap-2 bg-orange-50 px-2 py-1 rounded">
                          <FiFileText className="text-[#DB5E00]" />
                          <span className="text-gray-700">Documents</span>
                          <span className="flex flex-wrap gap-3">
                            {edu.document_urls.map((url: string, i: number) => (
                              <ViewLink key={i} url={url} />
                            ))}
                          </span>
                        </span>
                      )}
                  </div>

                  {(edu.has_cost_sharing || edu.hasCostSharing) &&
                    (edu.costSharings?.[0] || edu.cost_sharing_details) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                        {edu.costSharings?.[0] ? (
                          <>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                              <span className="text-gray-500">Doc Number:</span>
                              <span className="font-medium text-gray-800">
                                {edu.costSharings[0].document_number || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                              <span className="text-gray-500">
                                Issuing Inst:
                              </span>
                              <span className="font-medium text-gray-800">
                                {edu.costSharings[0].issuing_institution || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                              <span className="text-gray-500">Issue Date:</span>
                              <span className="font-medium text-gray-800">
                                {edu.costSharings[0].issue_date
                                  ? new Date(
                                      edu.costSharings[0].issue_date
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                              <span className="text-gray-500">Total Cost:</span>
                              <span className="font-medium text-gray-800">
                                {edu.costSharings[0].declared_total_cost}{" "}
                                {edu.costSharings[0].currency}
                              </span>
                            </div>
                            {edu.costSharings[0].remarks && (
                              <div className="sm:col-span-2 flex flex-col mt-1">
                                <span className="text-gray-500 text-xs">
                                  Remarks:
                                </span>
                                <span className="text-gray-700 italic">
                                  {edu.costSharings[0].remarks}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="sm:col-span-2 flex flex-col mt-1">
                            <span className="text-gray-500 text-xs">
                              Details:
                            </span>
                            <span className="text-gray-700 italic">
                              {edu.cost_sharing_details || "-"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
              {(!employee.educations || employee.educations.length === 0) && (
                <p className="text-gray-500 italic">No education records.</p>
              )}
            </div>
          </Card>
        );
      case "experience":
        return (
          <Card
            title="Work Experience"
            icon={<FiBriefcase />}
            action={editAction}
          >
            <div className="space-y-4">
              {(employee.employmentHistories || []).map(
                (exp: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <h3 className="font-bold text-gray-900">
                      {exp.previous_job_title_text || exp.job_title || "-"}
                    </h3>
                    <p className="text-gray-600">
                      {exp.previous_company_name || exp.company_name || "-"}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      {exp.previous_level && (
                        <span>Level: {exp.previous_level}</span>
                      )}
                      {exp.department_name && (
                        <span>Department: {exp.department_name}</span>
                      )}
                      <span>
                        {exp.start_date
                          ? new Date(exp.start_date).toLocaleDateString()
                          : "-"}{" "}
                        -{" "}
                        {exp.is_current
                          ? "Present"
                          : exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    {Array.isArray(exp.document_urls) &&
                      exp.document_urls.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          <span className="text-xs text-gray-500 flex items-center gap-2">
                            <FiFileText className="text-[#DB5E00]" />
                            <span>Documents:</span>
                          </span>
                          {exp.document_urls.map((url: string, i: number) => (
                            <ViewLink key={i} url={url} />
                          ))}
                        </div>
                      )}
                  </div>
                )
              )}
              {(!employee.employmentHistories ||
                employee.employmentHistories.length === 0) && (
                <p className="text-gray-500 italic">No work experience.</p>
              )}
            </div>
          </Card>
        );
      case "certifications":
        return (
          <Card title="Certifications" icon={<FiAward />} action={editAction}>
            <div className="space-y-4">
              {employee.licensesAndCertifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuing_organization}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span>
                      Issued: {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                    {cert.expiration_date && (
                      <span>
                        Expires:{" "}
                        {new Date(cert.expiration_date).toLocaleDateString()}
                      </span>
                    )}
                    {cert.credential_id && (
                      <span>ID: {cert.credential_id}</span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-3">
                    {cert.credential_url && (
                      <a
                        href={(() => {
                          const url = cert.credential_url.trim();
                          if (!url) return "#";
                          return url.startsWith("http://") ||
                            url.startsWith("https://")
                            ? url
                            : `https://${url}`;
                        })()}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs flex items-center gap-1 text-[#DB5E00] hover:underline font-medium bg-orange-50 px-2 py-1 rounded max-w-full"
                        title={cert.credential_url} // Tooltip full URL
                      >
                        <FiFileText className="shrink-0" />
                        <span className="truncate max-w-50">
                          {cert.credential_url}
                        </span>
                      </a>
                    )}
                    {cert.document_url && (
                      <a
                        href={cert.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs flex items-center gap-1 text-[#DB5E00] hover:underline font-medium bg-orange-50 px-2 py-1 rounded"
                      >
                        <FiFileText /> Certificate File
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {(!employee.licensesAndCertifications ||
                employee.licensesAndCertifications.length === 0) && (
                <p className="text-gray-500 italic">No certifications.</p>
              )}
            </div>
          </Card>
        );
      case "documents":
        return (
          <Card title="Documents" icon={<FiFileText />} action={editAction}>
            {(() => {
              const raw = (employee as any)?.documents;

              const extractUrl = (v: any) => {
                if (!v) return "";
                if (typeof v === "string") return v;
                return v.document_url || v.url || v.fileUrl || "";
              };

              if (!raw) {
                return (
                  <p className="text-gray-500 italic">No documents found.</p>
                );
              }

              // Format A: array of document objects
              if (Array.isArray(raw)) {
                const items = raw
                  .map((d: any) => ({
                    label: d.file_name || d.document_type || "Document",
                    type: d.document_type || "",
                    url: extractUrl(d),
                  }))
                  .filter((d: any) => d.url);

                if (items.length === 0) {
                  return (
                    <p className="text-gray-500 italic">No documents found.</p>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((doc: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded border border-gray-100"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <FiFileText className="text-[#DB5E00]" />
                            <span className="text-sm font-bold text-gray-800 truncate">
                              {doc.label}
                            </span>
                          </div>
                          {doc.type && (
                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                              {doc.type}
                            </div>
                          )}
                        </div>
                        <ViewLink url={doc.url} />
                      </div>
                    ))}
                  </div>
                );
              }

              // Format B: bucket object with arrays of URL strings (cv/photo/etc)
              if (raw && typeof raw === "object") {
                const buckets: Array<{ key: string; label: string }> = [
                  { key: "cv", label: "CV" },
                  { key: "photo", label: "Photo" },
                  { key: "certificates", label: "Certificates" },
                  { key: "experienceLetters", label: "Experience Letters" },
                  { key: "taxForms", label: "Tax Forms" },
                  { key: "pensionForms", label: "Pension Forms" },
                ];

                const rows = buckets
                  .map((b) => {
                    const list = (raw as any)[b.key];
                    const urls: string[] = Array.isArray(list)
                      ? list.map(extractUrl).filter(Boolean)
                      : [];
                    return { ...b, urls };
                  })
                  .filter((r) => r.urls.length > 0);

                if (rows.length === 0) {
                  return (
                    <p className="text-gray-500 italic">No documents found.</p>
                  );
                }

                return (
                  <div className="space-y-3">
                    {rows.map((row) => (
                      <div
                        key={row.key}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FiFileText className="text-[#DB5E00]" />
                          <h3 className="font-bold text-gray-900">
                            {row.label}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {row.urls.map((url, idx) => (
                            <ViewLink key={idx} url={url} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <p className="text-gray-500 italic">No documents found.</p>
              );
            })()}
          </Card>
        );
      case "career":
        return (
          <Card
            title="Career Progression"
            icon={<FiTrendingUp />}
            action={
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 px-3 py-1.5"
                  onClick={() =>
                    resolvedEmployeeId &&
                    dispatch(
                      actions.generateExperienceLetterRequest(
                        resolvedEmployeeId
                      )
                    )
                  }
                  disabled={loading}
                  icon={FiDownload}
                >
                  Experience Letter
                </Button>
                <Button
                  variant="outline"
                  className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 px-3 py-1.5"
                  onClick={() =>
                    resolvedEmployeeId &&
                    dispatch(
                      actions.generateCertificateOfServiceRequest(
                        resolvedEmployeeId
                      )
                    )
                  }
                  disabled={loading}
                  icon={FiFileText}
                >
                  Certificate of Service
                </Button>
              </div>
            }
          >
            <div className="py-2">
              <CareerTimeline
                events={employee.careerEvents || []}
                initialData={{
                  job_title: employee.job_title,
                  job_level: employee.job_level,
                  department: employee.department,
                  start_date: employee.start_date,
                  gross_salary: employee.employments?.find(
                    (e: any) => e.is_active
                  )?.gross_salary,
                }}
              />
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-bold">Error:</span> {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button
            onClick={() => navigate("/admin/employees")}
            className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Employees
          </button>

          <div className="flex items-center gap-3">
            {isPendingApproval && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white border-transparent"
                onClick={handleApprove}
                icon={FiCheck}
              >
                Approve Application
              </Button>
            )}
          </div>
        </div>

        {/* PROFILE HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative">
          {loading && employee && (
            <div className="absolute top-4 right-4 z-20">
              <LoadingSkeleton variant="circular" width={24} height={24} />
            </div>
          )}
          <div className="w-20 h-20 rounded-full bg-[#fcefe9] flex items-center justify-center text-[#DB5E00] text-3xl font-bold overflow-hidden border-2 border-[#DB5E00]/10 shadow-inner">
            {employee.profilePicture ? (
              <img
                src={getFileUrl(employee.profilePicture)}
                alt={employee.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              employee.full_name?.charAt(0)
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {employee.full_name}
            </h1>
            <p className="text-gray-500 font-medium mb-4">
              {employee.job_title} • {employee.department}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
              {(employee.email || employee.appUsers?.[0]?.email) && (
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <span>{employee.email || employee.appUsers?.[0]?.email}</span>
                </div>
              )}
              {employee.phones?.[0] && (
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  <span>{employee.phones[0].phone_number}</span>
                </div>
              )}
              {employee.addresses?.[0] && (
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gray-400" />
                  <span>
                    {employee.addresses[0].city}, {employee.addresses[0].region}
                  </span>
                </div>
              )}
              {employee.start_date && (
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <span>
                    Joined {new Date(employee.start_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <Badge variant={isPending ? "warning" : "success"}>
                {employee.onboarding_status || "Active"}
              </Badge>
              <span className="text-sm text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">
                {employee.employee_id || employee.id}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-1 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === tab.id
                    ? "bg-[#DB5E00] text-white shadow-md shadow-orange-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 pb-20">
            <div className="animate-in fade-in duration-300">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
