import { useCallback, useEffect, useState } from "react";
import { MdCameraAlt } from "react-icons/md";
import { FiTrendingUp, FiDownload, FiFileText } from "react-icons/fi";
import ProfileSidebar from "./ProfileSidebar";
import PersonalDetails from "./sections/PersonalDetails";
import ContactDetails from "./sections/ContactDetails";
import EducationWrapper from "./sections/EducationWrapper";
import WorkExperienceWrapper from "./sections/WorkExperienceWrapper";
import CertificationsWrapper from "./sections/CertificationsWrapper";
import FinancialDetails from "./sections/FinancialDetails";
import JobDetails from "./sections/JobDetails";
import DocumentsWrapper from "./sections/DocumentsWrapper";
import CareerTimeline from "../../../components/Employee/CareerTimeline";
import adminService from "../../../services/adminService";
import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import PageHeader from "../../../components/common/PageHeader";
import onboardingService from "../../../services/onboardingService";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../../slice/authSlice/selectors";
import { getRoleNameById } from "../../../../utils/constants";

export default function ProfileUpdateLayout() {
  const [activeSection, setActiveSection] = useState("personal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const user = useSelector(selectAuthUser) as any;

  const displayName = (() => {
    const fullName =
      user?.full_name ||
      user?.fullName ||
      user?.name ||
      user?.employee?.full_name ||
      user?.employee?.fullName ||
      null;

    if (fullName && String(fullName).trim()) return String(fullName).trim();

    const first = user?.first_name || user?.firstName || null;
    const last = user?.last_name || user?.lastName || null;
    const composed = [first, last].filter(Boolean).join(" ").trim();
    if (composed) return composed;

    const email = user?.email;
    if (email && typeof email === "string") {
      const prefix = email.split("@")[0];
      if (prefix) return prefix;
    }

    return "Employee";
  })();

  const roleLabel = getRoleNameById(user?.role_id);

  const [profileData, setProfileData] = useState<any>({
    personal: {
      fullName: "",
      gender: "",
      dateOfBirth: "",
      tinNumber: "",
      pensionNumber: "",
      placeOfWork: "Head Office",
    },
    contact: {
      region: "",
      city: "",
      subCity: "",
      woreda: "",
      houseNumber: "",
      phones: [{ number: "", type: "Private", isPrimary: true }],
    },
    education: [],
    workExperience: [],
    certifications: [],
    documents: {
      cv: [],
      certificates: [],
      photo: [],
      experienceLetters: [],
      taxForms: [],
      pensionForms: [],
    },
    careerEvents: [],
    jobDetails: {},
  });

  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const response = await onboardingService.getStatus();
      const data = response?.data || {};

      const next: any = {
        personal: { ...profileData.personal },
        contact: { ...profileData.contact },
        education: Array.isArray(profileData.education)
          ? [...profileData.education]
          : [],
        workExperience: Array.isArray(profileData.workExperience)
          ? [...profileData.workExperience]
          : [],
        certifications: Array.isArray(profileData.certifications)
          ? [...profileData.certifications]
          : [],
        documents: { ...profileData.documents },
      };

      if (data.employee) {
        next.personal = {
          ...next.personal,
          fullName: data.employee.full_name || next.personal.fullName,
          gender: data.employee.gender || next.personal.gender,
          dateOfBirth: data.employee.date_of_birth
            ? new Date(data.employee.date_of_birth).toISOString().split("T")[0]
            : next.personal.dateOfBirth,
          tinNumber: data.employee.tin_number || next.personal.tinNumber,
          pensionNumber:
            data.employee.pension_number || next.personal.pensionNumber,
          placeOfWork: data.employee.place_of_work || next.personal.placeOfWork,
        };
      }

      if (data.contact) {
        const phones =
          data.contact.phones?.map((phone: any) => ({
            number: phone.phone_number || phone.number || "",
            type: phone.phone_type || phone.type || "Private",
            isPrimary: phone.is_primary || phone.isPrimary || false,
          })) || [];

        const address = data.contact.addresses?.[0] || {};

        next.contact = {
          ...next.contact,
          region: address.region || next.contact.region,
          city: address.city || next.contact.city,
          subCity: address.sub_city || address.subCity || next.contact.subCity,
          woreda: address.woreda || next.contact.woreda,
          houseNumber:
            address.house_number ||
            address.houseNumber ||
            next.contact.houseNumber,
          phones: phones.length > 0 ? phones : next.contact.phones,
        };
      }

      if (Array.isArray(data.education)) {
        next.education = data.education.map((edu: any) => ({
          level: edu.educationLevel?.name || edu.level || "",
          fieldOfStudy:
            edu.fieldOfStudy?.name ||
            edu.fieldOfStudy ||
            edu.field_of_study ||
            "",
          institution:
            edu.institution?.name ||
            edu.institution ||
            edu.institution_name ||
            "",
          programType: edu.program_type || edu.programType || "Regular",
          hasCostSharing: edu.has_cost_sharing || edu.hasCostSharing || false,
          costSharingDocument:
            edu.cost_sharing_document_url || edu.costSharingDocument || null,
          startDate:
            edu.start_date || edu.startDate
              ? new Date(edu.start_date || edu.startDate)
                  .toISOString()
                  .split("T")[0]
              : "",
          endDate:
            edu.end_date || edu.endDate
              ? new Date(edu.end_date || edu.endDate)
                  .toISOString()
                  .split("T")[0]
              : "",
          graduationYear: edu.graduation_year || edu.graduationYear || "",
          isCurrent: edu.is_current || edu.isCurrent || false,
        }));
      }

      if (Array.isArray(data.workExperience)) {
        next.workExperience = data.workExperience.map((exp: any) => ({
          companyName:
            exp.previousCompanyName ||
            exp.previous_company_name ||
            exp.companyName ||
            "",
          jobTitle:
            exp.job_title_id ||
            exp.previous_job_title_id ||
            exp.jobTitleId ||
            exp.jobTitle ||
            "",
          previousJobTitle:
            exp.previous_job_title_text ||
            exp.position ||
            exp.previousJobTitle ||
            exp.jobTitle ||
            "",
          level: exp.previousLevel || exp.level || "",
          department: exp.departmentName || exp.department || "",
          startDate:
            exp.start_date || exp.startDate
              ? new Date(exp.start_date || exp.startDate)
                  .toISOString()
                  .split("T")[0]
              : "",
          endDate:
            exp.end_date || exp.endDate
              ? new Date(exp.end_date || exp.endDate)
                  .toISOString()
                  .split("T")[0]
              : "",
          isCurrent: exp.is_current || exp.isCurrent || false,
        }));
      }

      if (Array.isArray(data.certifications)) {
        next.certifications = data.certifications.map((cert: any) => ({
          name: cert.name || "",
          issuingOrganization:
            cert.issuing_organization || cert.issuingOrganization || "",
          issueDate: cert.issue_date
            ? new Date(cert.issue_date).toISOString().split("T")[0]
            : "",
          expirationDate: cert.expiration_date
            ? new Date(cert.expiration_date).toISOString().split("T")[0]
            : "",
          credentialId: cert.credential_id || cert.credentialId || "",
          credentialUrl: cert.credential_url || cert.credentialUrl || "",
          certificateDocument:
            cert.credential_url || cert.certificateDocument || null,
        }));
      }

      if (data.documents) {
        const docs = data.documents;
        next.documents = {
          ...next.documents,
          cv: Array.isArray(docs.cv) ? docs.cv : docs.cv ? [docs.cv] : [],
          certificates: Array.isArray(docs.certificates)
            ? docs.certificates
            : docs.certificates
            ? [docs.certificates]
            : [],
          photo: Array.isArray(docs.photo)
            ? docs.photo
            : docs.photo
            ? [docs.photo]
            : [],
          experienceLetters: Array.isArray(docs.experienceLetters)
            ? docs.experienceLetters
            : docs.experienceLetters
            ? [docs.experienceLetters]
            : [],
          taxForms: Array.isArray(docs.taxForms)
            ? docs.taxForms
            : docs.taxForms
            ? [docs.taxForms]
            : [],
          pensionForms: Array.isArray(docs.pensionForms)
            ? docs.pensionForms
            : docs.pensionForms
            ? [docs.pensionForms]
            : [],
        };
      }

      // Fetch full employee detail for Career Path and Job Details using /employees/me
      try {
          const detailResponse = await adminService.getMyProfile();
          const detail = detailResponse.data?.employee || detailResponse.employee || detailResponse;
          
          if (detail) {
              // Populate Career Events
              if (detail.careerEvents) {
                  next.careerEvents = detail.careerEvents;
              }
              
              // Populate Job Details (Employment) - get from active employment
              const activeEmployment = detail.employments?.find((e: any) => e.is_active) || detail.employments?.[0];
              next.jobDetails = {
                  employeeId: detail.id,
                  jobTitle: detail.job_title || activeEmployment?.jobTitle?.title || "",
                  jobLevel: activeEmployment?.jobTitle?.level || "",
                  department: detail.department || activeEmployment?.department?.name || "",
                  employmentType: detail.employment_type || activeEmployment?.employment_type || "Full Time",
                  startDate: detail.start_date || activeEmployment?.start_date || "",
                  contractEndDate: activeEmployment?.contract_end_date || "N/A",
                  branch: detail.place_of_work || "Head Office",
                  manager: activeEmployment?.manager?.full_name || "N/A",
                  grossSalary: activeEmployment?.gross_salary || 0,
                  basicSalary: activeEmployment?.basic_salary || 0,
                  allowances: activeEmployment?.allowances || []
              };
          }
      } catch (error) {
          console.error("Failed to fetch additional employee details", error);
      }

      setProfileData(next);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load profile"
      );
    } finally {
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSaveImage = () => {
    // TODO: Implement API call to upload image
    console.log("Uploading image:", selectedImage);
    toast.success("Profile image updated successfully");
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalDetails
            initialData={profileData.personal}
            onRefresh={loadProfile}
          />
        );
      case "contact":
        return (
          <ContactDetails
            initialData={profileData.contact}
            onRefresh={loadProfile}
          />
        );
      case "education":
        return (
          <EducationWrapper
            initialEducation={profileData.education}
            onRefresh={loadProfile}
          />
        );
      case "workExperience":
        return (
          <WorkExperienceWrapper
            initialWorkExperience={profileData.workExperience}
            onRefresh={loadProfile}
          />
        );
      case "certifications":
        return (
          <CertificationsWrapper
            initialCertifications={profileData.certifications}
            onRefresh={loadProfile}
          />
        );
      case "financial":
        return <FinancialDetails />;
      case "employment":
        return <JobDetails data={profileData.jobDetails} />;
      case "career":
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#DB5E00]">
                            <FiTrendingUp className="text-xl" />
                        </div>
                        <h2 className="text-xl font-bold text-k-dark-grey">Career Progression</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            className="text-sm px-3 py-1.5 h-auto border-[#DB5E00] text-[#DB5E00] hover:bg-orange-50"
                            onClick={async () => {
                                if (!user?.employee_id) return;
                                try {
                                    const response = await makeCall({
                                        route: apiRoutes.experienceLetter(user.employee_id),
                                        method: "GET",
                                        responseType: "blob",
                                    });
                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.setAttribute("download", `Experience_Letter.pdf`);
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    toast.success("Experience Letter downloaded");
                                } catch {
                                    toast.error("Failed to download Experience Letter");
                                }
                            }}
                            icon={FiDownload}
                        >
                            Experience Letter
                        </Button>
                        <Button
                            variant="outline"
                            className="text-sm px-3 py-1.5 h-auto border-[#DB5E00] text-[#DB5E00] hover:bg-orange-50"
                            onClick={async () => {
                                if (!user?.employee_id) return;
                                try {
                                    const response = await makeCall({
                                        route: apiRoutes.certificateOfService(user.employee_id),
                                        method: "GET",
                                        responseType: "blob",
                                    });
                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.setAttribute("download", `Certificate_of_Service.pdf`);
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    toast.success("Certificate of Service downloaded");
                                } catch {
                                    toast.error("Failed to download Certificate of Service");
                                }
                            }}
                            icon={FiFileText}
                        >
                            Certificate of Service
                        </Button>
                    </div>
                </div>
                <CareerTimeline 
                    events={profileData.careerEvents || []} 
                    initialData={{
                        job_title: profileData.jobDetails?.jobTitle,
                        job_level: profileData.jobDetails?.jobLevel,
                        department: profileData.jobDetails?.department,
                        start_date: profileData.jobDetails?.startDate,
                        gross_salary: profileData.jobDetails?.grossSalary
                    }}
                />
            </div>
        );
      case "documents":
        return (
          <DocumentsWrapper
            initialDocuments={profileData.documents}
            onRefresh={loadProfile}
          />
        );
      default:
        return (
          <PersonalDetails
            initialData={profileData.personal}
            onRefresh={loadProfile}
          />
        );
    }
  };

  return (
    <EmployeeLayout>
      <div className="min-h-screen pb-12">
        {/* Header Banner */}
        <PageHeader className="rounded-b-3xl -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-8 pt-8 pb-24 h-52">
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-300">
              Manage your personal information and employment details
            </p>
          </div>
        </PageHeader>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 self-start">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center">
                <div className="relative inline-block mx-auto mb-4 group">
                  <div className="w-24 h-24 rounded-full bg-k-yellow border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src="https://avatar.iran.liara.run/public/boy"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 bg-k-orange text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
                    title="Update Profile Picture"
                  >
                    <MdCameraAlt size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-k-dark-grey">
                  {displayName}
                </h2>
                <p className="text-k-medium-grey text-sm mb-4">{roleLabel}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Active Employee
                </div>
              </div>

              <ProfileSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 w-full">
              {isLoadingProfile ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-k-medium-grey">
                  Loading profile...
                </div>
              ) : (
                renderSection()
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedImage(null);
          }}
          title="Update Profile Picture"
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {selectedImage ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                  />
                  <p className="text-sm font-medium text-k-dark-grey">
                    {selectedImage.name}
                  </p>
                  <p className="text-xs text-gray-500">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdCameraAlt size={32} />
                  </div>
                  <p className="text-sm font-medium text-k-dark-grey">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedImage(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveImage}
                disabled={!selectedImage}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </EmployeeLayout>
  );
}
