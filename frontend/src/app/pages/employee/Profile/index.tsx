import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import Button from "../../../components/common/Button";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiBookOpen,
  FiFile,
  FiDownload,
  FiExternalLink,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import {
  MdPerson,
  MdContactPhone,
  MdSchool,
  MdWork,
  MdVerifiedUser,
  MdUploadFile,
} from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import CareerTimeline from "../../../components/Employee/CareerTimeline";
import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";
import adminService from "../../../services/adminService";
import ToastService from "../../../../utils/ToastService";
import LoadingSkeleton from "../../../components/common/LoadingSkeleton";

type SectionId =
  | "personal"
  | "contact"
  | "education"
  | "workExperience"
  | "employment"
  | "career"
  | "compensation"
  | "certifications"
  | "documents";

const SECTIONS = [
  { id: "personal" as SectionId, label: "Personal Info", icon: MdPerson },
  { id: "contact" as SectionId, label: "Contact Details", icon: MdContactPhone },
  { id: "education" as SectionId, label: "Education", icon: MdSchool },
  { id: "workExperience" as SectionId, label: "Work Experience", icon: MdWork },
  { id: "employment" as SectionId, label: "Employment", icon: FiBriefcase },
  { id: "career" as SectionId, label: "Career Path", icon: FiTrendingUp },
  { id: "compensation" as SectionId, label: "Compensation", icon: FiDollarSign },
  {
    id: "certifications" as SectionId,
    label: "Certifications",
    icon: MdVerifiedUser,
  },
  { id: "documents" as SectionId, label: "Documents", icon: MdUploadFile },
];

export default function Profile() {
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [employee, setEmployee] = useState<any>(null);
  const [allowanceTypes, setAllowanceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const authUser = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch allowance types
        const types = await adminService.getAllowanceTypes();
        setAllowanceTypes(types);

        // Fetch employee details
        // We use the employee_id from the auth user or first check if full employee object is there
        const employeeId = authUser?.employee?.id || authUser?.id;
        
        if (employeeId) {
            const res: any = await makeCall({
                method: "GET",
                route: apiRoutes.employeeDetail(employeeId),
                isSecureRoute: true,
            });
            setEmployee(res?.data?.data?.employee || res?.data?.employee || res?.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
        ToastService.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser]);

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return "Not specified";
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };



  const renderSection = () => {
    if (!employee) return null;

    switch (activeSection) {
      case "personal":
        return (
          <PersonalSection
            employee={employee}
            formatDate={formatDate}
            getGenderLabel={getGenderLabel}
          />
        );
      case "contact":
        return <ContactSection employee={employee} email={employee.email || authUser?.email} />;
      case "education":
        return (
          <EducationSection
            educations={employee?.educations}
            formatDate={formatDate}
          />
        );
      case "workExperience":
        return (
          <WorkExperienceSection
            histories={employee?.employmentHistories}
            formatDate={formatDate}
          />
        );
      case "employment":
        return <EmploymentSection employee={employee} />;
      case "career":
        return <CareerSection events={employee?.careerEvents} />;
      case "compensation":
        return (
          <CompensationSection
            employee={employee}
            allowanceTypes={allowanceTypes}
          />
        );
      case "certifications":
        return (
          <CertificationsSection
            certifications={employee?.licensesAndCertifications}
          />
        );
      case "documents":
        return <DocumentsSection documents={employee?.documents} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-6">
          <LoadingSkeleton count={3} />
        </div>
      </EmployeeLayout>
    );
  }

  if (!employee) {
    return (
      <EmployeeLayout>
        <div className="p-6 text-center py-12">
          <p className="text-gray-500">Could not load profile details.</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-2">View and manage your personal and employment information.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-24">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeSection === section.id
                      ? "bg-k-orange text-white shadow-md shadow-k-orange/20"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium whitespace-nowrap">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{renderSection()}</div>
        </div>
      </div>
    </EmployeeLayout>
  );
}

// Section Components (Read-only versions)

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-k-dark-grey">{value || "N/A"}</p>
    </div>
  );
}

function PersonalSection({ employee, formatDate, getGenderLabel }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Personal Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Full Name" value={employee?.full_name} />
        <InfoField label="Gender" value={getGenderLabel(employee?.gender)} />
        <InfoField label="Date of Birth" value={formatDate(employee?.date_of_birth)} />
        <InfoField label="TIN Number" value={employee?.tin_number} />
        <InfoField label="Pension Number" value={employee?.pension_number} />
        <InfoField label="Place of Work" value={employee?.place_of_work} />
      </div>
    </div>
  );
}

function ContactSection({ employee, email }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="mb-6 border-b pb-4">
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
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-k-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{phone.phone_type} {phone.is_primary && "(Primary)"}</p>
              <p className="font-medium text-k-dark-grey">{phone.phone_number}</p>
            </div>
          </div>
        ))}
        
        {employee?.addresses?.map((address: any, index: number) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-k-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address ({address.address_type || "N/A"})</p>
              <p className="font-medium text-k-dark-grey">
                {[address.region, address.city, address.sub_city, address.woreda].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ educations, formatDate }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">Education</h2>
      <div className="space-y-4">
        {educations?.length > 0 ? (
          educations.map((edu: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border-l-4 border-k-orange">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center shrink-0">
                  <FiBookOpen className="w-5 h-5 text-k-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-k-dark-grey">{edu.institution_name}</p>
                  <p className="text-sm text-gray-600">{edu.field_of_study}</p>
                  <p className="text-xs text-gray-500 mt-1">Level: {edu.education_level || "N/A"} • {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No education records found.</p>
        )}
      </div>
    </div>
  );
}

function WorkExperienceSection({ histories, formatDate }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">Work Experience</h2>
      <div className="space-y-4">
        {histories?.length > 0 ? (
          histories.map((work: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border-l-4 border-k-orange">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center shrink-0">
                  <FiBriefcase className="w-5 h-5 text-k-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-k-dark-grey">{work.previous_company_name}</p>
                  <p className="text-sm text-gray-600">{work.previous_job_title}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(work.start_date)} - {work.end_date ? formatDate(work.end_date) : "Present"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No work experience records found.</p>
        )}
      </div>
    </div>
  );
}

function EmploymentSection({ employee }: any) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const latest = employee?.employments?.length > 0 ? employee.employments[0] : null;

  const handleDownload = async (type: 'experience-letter' | 'certificate-of-service') => {
    if (!employee?.id) return;
    try {
      setDownloading(type);
      // Construct route based on type
      const route = type === 'experience-letter' 
        ? apiRoutes.experienceLetter(employee.id)
        : apiRoutes.certificateOfService(employee.id);
      
      const response: any = await makeCall({
        method: "GET",
        route,
        isSecureRoute: true,
        responseType: 'blob',
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `${type === 'experience-letter' ? 'Experience_Letter' : 'Certificate_of_Service'}_${employee.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
      ToastService.error("Failed to download document");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Employment Details</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 px-3 py-1.5"
            onClick={() => handleDownload('experience-letter')}
            disabled={downloading !== null}
            loading={downloading === 'experience-letter'}
            icon={FiDownload}
          >
            Experience Letter
          </Button>
          <Button
            variant="outline"
            className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 px-3 py-1.5"
            onClick={() => handleDownload('certificate-of-service')}
            disabled={downloading !== null}
            loading={downloading === 'certificate-of-service'}
            icon={FiFileText}
          >
            Certificate of Service
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Department" value={latest?.department?.name} />
        <InfoField label="Job Title" value={latest?.jobTitle ? `${latest.jobTitle.title}${latest.jobTitle.level ? ` - ${latest.jobTitle.level}` : ""}` : "N/A"} />
        <InfoField label="Employment Type" value={latest?.employment_type} />
        <InfoField label="Start Date" value={latest?.start_date ? new Date(latest.start_date).toLocaleDateString() : "N/A"} />
        <InfoField label="Manager" value={latest?.manager?.fullName || "Not assigned"} />
      </div>
    </div>
  );
}

function CompensationSection({ employee, allowanceTypes }: any) {
  const latest = employee?.employments?.length > 0 ? employee.employments[0] : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Compensation</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoField label="Gross Salary" value={latest?.gross_salary ? `${Number(latest.gross_salary).toLocaleString()} ETB` : "N/A"} />
        <InfoField label="Basic Salary" value={latest?.basic_salary ? `${Number(latest.basic_salary).toLocaleString()} ETB` : "N/A"} />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-k-dark-grey mb-4 flex items-center gap-2">
          <FiDollarSign className="text-k-orange" /> Allowances
        </h3>
        {latest?.allowances?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latest.allowances.map((a: any, index: number) => {
              const typeName = a.allowanceType?.name || allowanceTypes.find((at: any) => at.id === a.allowance_type_id)?.name || "Allowance";
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
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

function CertificationsSection({ certifications }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">Certifications</h2>
      <div className="space-y-4">
        {certifications?.length > 0 ? (
          certifications.map((cert: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-k-orange/10 flex items-center justify-center shrink-0">
                  <FiAward className="w-5 h-5 text-k-orange" />
                </div>
                <div>
                  <p className="font-medium text-k-dark-grey">{cert.name}</p>
                  <p className="text-sm text-gray-500">{cert.issuing_organization}</p>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-k-orange hover:underline">
                      <FiExternalLink className="w-4 h-4" /> View Credential
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No certifications found.</p>
        )}
      </div>
    </div>
  );
}

function DocumentsSection({ documents }: any) {
  const hasDocs = documents && (
    (documents.cv?.length > 0) || 
    (documents.certificates?.length > 0) || 
    (documents.photo?.length > 0)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasDocs ? (
          <>
            {documents.cv?.length > 0 && <DocumentCard title="CV/Resume" files={documents.cv} />}
            {documents.certificates?.length > 0 && <DocumentCard title="Certificates" files={documents.certificates} />}
            {documents.photo?.length > 0 && <DocumentCard title="Photo" files={documents.photo} />}
          </>
        ) : (
          <p className="text-gray-500 text-center py-4 col-span-2">No documents found.</p>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ title, files }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <FiFile className="w-5 h-5 text-k-orange" />
        <p className="font-medium text-k-dark-grey">{title}</p>
      </div>
      <div className="space-y-2">
        {files.map((file: string, index: number) => (
          <a key={index} href={file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-k-orange hover:underline">
            <FiDownload className="w-4 h-4" /> View Document {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}

function CareerSection({ events }: { events: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-k-dark-grey mb-6 border-b pb-4">Career Path</h2>
      <CareerTimeline events={events || []} />
    </div>
  );
}
