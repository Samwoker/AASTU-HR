import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepPersonalInfo from "../../../components/employees/wizard/StepPersonalInfo";
import StepContactInfo from "../../../components/employees/wizard/StepContactInfo";
import StepEducation from "../../../components/employees/wizard/StepEducation";
import StepWorkExperience from "../../../components/employees/wizard/StepWorkExperience";
import StepCertifications from "../../../components/employees/wizard/StepCertifications";
import StepDocuments from "../../../components/employees/wizard/StepDocuments";
import StepReview from "../../../components/employees/wizard/StepReview";
import RegistrationModal from "../../../components/employees/RegistrationModal";
import Button from "../../../components/common/Button";
import { MdCheck, MdArrowBack, MdArrowForward, MdError } from "react-icons/md";
import toast from "react-hot-toast";
import onboardingService from "../../../services/onboardingService";
import api from "../../../services/api";
import { useDispatch } from "react-redux";
import { authActions } from "../../../slice/authSlice";

// Type definitions
interface Phone {
  number: string;
  type: string;
  isPrimary: boolean;
}

interface FileItem {
  file?: File;
  url: string;
  name: string;
  uploading?: boolean;
  error?: string;
}

interface Education {
  level: string;
  fieldOfStudy: string;
  institution: string;
  programType: string;
  hasCostSharing?: boolean;
  costSharingDocument?:
    | File
    | string
    | { file: File; url?: string; uploading?: boolean; error?: string }
    | null;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface WorkExperience {
  companyName: string;
  jobTitle?: string;
  previousJobTitle?: string;
  level?: string;
  department?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface Certification {
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  certificateDocument?:
    | File
    | string
    | { file: File; url?: string; uploading?: boolean; error?: string }
    | null;
}

interface Documents {
  cv: (FileItem | string)[];
  certificates: (FileItem | string)[];
  experienceLetters: (FileItem | string)[];
  photo: (FileItem | string)[];
  taxForms: (FileItem | string)[];
  pensionForms: (FileItem | string)[];
}

interface FormData {
  // Personal Info
  fullName: string;
  gender: string;
  dateOfBirth: string;
  tinNumber: string;
  pensionNumber: string;
  placeOfWork: string;
  // Contact Info
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  phones: Phone[];
  // Education
  education: Education[];
  // Work Experience
  workExperience: WorkExperience[];
  // Certifications
  certifications: Certification[];
  // Documents
  documents: Documents;
}

interface ExtractedData {
  personalInfo?: Partial<FormData>;
  contactInfo?: {
    region?: string;
    city?: string;
    subCity?: string;
    woreda?: string;
    phones?: Phone[];
  };
  education?: Education[];
  workExperience?: WorkExperience[];
  certifications?: Certification[];
  documents?: Partial<Documents>;
}

interface StepComponentProps {
  formData: FormData;
  handleChange: (field: string, value: unknown) => void;
  updateFormData: (section: string, data: unknown) => void;
  errors: Record<string, string | null>;
  onEditStep?: (stepId: number) => void;
}

type StepComponentType = React.ComponentType<StepComponentProps>;

interface Step {
  id: number;
  title: string;
  component: StepComponentType;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Personal Info",
    component: StepPersonalInfo as StepComponentType,
  },
  {
    id: 2,
    title: "Contact Info",
    component: StepContactInfo as StepComponentType,
  },
  { id: 3, title: "Education", component: StepEducation as StepComponentType },
  {
    id: 4,
    title: "Work Experience",
    component: StepWorkExperience as StepComponentType,
  },
  {
    id: 5,
    title: "Certifications",
    component: StepCertifications as StepComponentType,
  },
  { id: 6, title: "Documents", component: StepDocuments as StepComponentType },
  { id: 7, title: "Review", component: StepReview as StepComponentType },
];

export default function EmployeeOnboarding() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(true);
  const [wizardStarted, setWizardStarted] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Personal Info (flat structure)
    fullName: "",
    gender: "",
    dateOfBirth: "",
    tinNumber: "",
    pensionNumber: "",
    placeOfWork: "Head Office",

    // Contact Info (flat structure)
    region: "",
    city: "",
    subCity: "",
    woreda: "",
    phones: [{ number: "", type: "Private", isPrimary: true }],

    // Education
    education: [],

    // Work Experience
    workExperience: [],

    // Certifications
    certifications: [],

    // Documents (all as arrays for multiple file support)
    documents: {
      cv: [],
      certificates: [],
      experienceLetters: [],
      photo: [],
      taxForms: [],
      pensionForms: [],
    },
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of Birth is required";
    }

    if (step === 2) {
      if (formData.phones.length === 0) {
        newErrors.phones = "At least one phone number is required";
      } else {
        formData.phones.forEach((phone, index) => {
          if (!phone.number) {
            newErrors[`phone_${index}`] = "Phone number is required";
          }
        });
      }
    }

    if (step === 3) {
      formData.education.forEach((edu, index) => {
        if (!edu.level) newErrors[`edu_level_${index}`] = "Level is required";
        if (!edu.fieldOfStudy)
          newErrors[`edu_field_${index}`] = "Field of Study is required";
        if (!edu.institution)
          newErrors[`edu_inst_${index}`] = "Institution is required";
        if (!edu.programType)
          newErrors[`edu_prog_${index}`] = "Program Type is required";

        if (edu.hasCostSharing) {
          if (!edu.costSharingDocument) {
            newErrors[`edu_cost_doc_${index}`] =
              "Cost Sharing Document is required";
          } else if (
            typeof edu.costSharingDocument === "object" &&
            "error" in edu.costSharingDocument &&
            edu.costSharingDocument.error
          ) {
            newErrors[`edu_cost_doc_${index}`] =
              "Cost Sharing Document upload failed. Please retry.";
          } else if (
            typeof edu.costSharingDocument === "object" &&
            "url" in edu.costSharingDocument &&
            !edu.costSharingDocument.url
          ) {
            newErrors[`edu_cost_doc_${index}`] =
              "Cost Sharing Document must be uploaded";
          } else if (edu.costSharingDocument instanceof File) {
            newErrors[`edu_cost_doc_${index}`] =
              "Cost Sharing Document must be uploaded";
          }
        }
      });
    }

    if (step === 4) {
      formData.workExperience.forEach((exp, index) => {
        if (!exp.companyName)
          newErrors[`exp_company_${index}`] = "Company Name is required";
        if (!exp.startDate)
          newErrors[`exp_start_${index}`] = "Start Date is required";
      });
    }

    if (step === 5) {
      formData.certifications.forEach((cert, index) => {
        if (!cert.name)
          newErrors[`cert_name_${index}`] = "Certificate Name is required";
      });
    }

    if (step === 6) {
      // Check if files are uploaded (have URLs)
      const hasValidCv =
        formData.documents.cv &&
        Array.isArray(formData.documents.cv) &&
        formData.documents.cv.some((item) => {
          if (typeof item === "string") return true;
          return item.url && !item.error;
        });
      if (!hasValidCv) {
        newErrors.cv = "CV/Resume is required and must be uploaded";
      }

      const hasValidCertificates =
        formData.documents.certificates &&
        Array.isArray(formData.documents.certificates) &&
        formData.documents.certificates.some((item) => {
          if (typeof item === "string") return true;
          return item.url && !item.error;
        });
      if (!hasValidCertificates) {
        newErrors.certificates =
          "Educational Certificates are required and must be uploaded";
      }

      const hasValidPhoto =
        formData.documents.photo &&
        Array.isArray(formData.documents.photo) &&
        formData.documents.photo.some((item) => {
          if (typeof item === "string") return true;
          return item.url && !item.error;
        });
      if (!hasValidPhoto) {
        newErrors.photo = "Photo/ID is required and must be uploaded";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }

    return isValid;
  };

  // Fetch onboarding status on mount
  useEffect(() => {
    let isMounted = true;

    const fetchOnboardingStatus = async () => {
      let loadingToast: string | undefined;
      try {
        setIsLoadingStatus(true);
        const response = await onboardingService.getStatus();

        if (!isMounted) return;

        if (response.data) {
          // Only show onboarding if status is PENDING or IN_PROGRESS
          const onboardingStatus = response.data.onboarding_status;
          if (
            onboardingStatus &&
            !["PENDING", "IN_PROGRESS"].includes(onboardingStatus)
          ) {
            setShouldRedirect(true);
            setIsLoadingStatus(false);
            dispatch(authActions.getMeRequest());
            navigate("/employee/dashboard", { replace: true });
            return;
          }

          // Only show loading toast if we're actually going to load data
          loadingToast = toast.loading("Loading your saved data...");

          const {
            employee,
            contact,
            education,
            workExperience,
            certifications,
          } = response.data;

          if (loadingToast) toast.dismiss(loadingToast);

          // Map backend data to frontend format
          if (employee) {
            setFormData((prev) => ({
              ...prev,
              fullName: employee.full_name || prev.fullName,
              gender: employee.gender || prev.gender,
              dateOfBirth: employee.date_of_birth
                ? new Date(employee.date_of_birth).toISOString().split("T")[0]
                : prev.dateOfBirth,
              tinNumber: employee.tin_number || prev.tinNumber,
              pensionNumber: employee.pension_number || prev.pensionNumber,
              placeOfWork: employee.place_of_work || prev.placeOfWork,
            }));
          }

          if (contact) {
            const phones =
              contact.phones?.map((phone: any) => ({
                number: phone.phone_number || phone.number,
                type: phone.phone_type || phone.type || "Private",
                isPrimary: phone.is_primary || phone.isPrimary || false,
              })) || [];

            const address = contact.addresses?.[0] || {};

            setFormData((prev) => ({
              ...prev,
              region: address.region || prev.region,
              city: address.city || prev.city,
              subCity: address.sub_city || address.subCity || prev.subCity,
              woreda: address.woreda || prev.woreda,
              phones: phones.length > 0 ? phones : prev.phones,
            }));
          }

          if (education && Array.isArray(education)) {
            const mappedEducation = education.map((edu: any) => ({
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
              hasCostSharing:
                edu.has_cost_sharing || edu.hasCostSharing || false,
              costSharingDocument:
                edu.cost_sharing_document_url ||
                edu.costSharingDocument ||
                null,
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
              isCurrent: edu.is_current || edu.isCurrent || false,
            }));

            setFormData((prev) => ({
              ...prev,
              education:
                mappedEducation.length > 0 ? mappedEducation : prev.education,
            }));
          }

          if (workExperience && Array.isArray(workExperience)) {
            const mappedWorkExp = workExperience.map((exp: any) => ({
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

            setFormData((prev) => ({
              ...prev,
              workExperience:
                mappedWorkExp.length > 0 ? mappedWorkExp : prev.workExperience,
            }));
          }

          if (certifications && Array.isArray(certifications)) {
            const mappedCerts = certifications.map((cert: any) => ({
              name: cert.name || "",
              issuingOrganization:
                cert.issuing_organization || cert.issuingOrganization || "",
              issueDate: cert.issue_date
                ? new Date(cert.issue_date).toISOString().split("T")[0]
                : "",
              expirationDate: cert.expiration_date
                ? new Date(cert.expiration_date).toISOString().split("T")[0]
                : "",
              certificateDocument:
                cert.credential_url || cert.certificateDocument || null,
            }));

            setFormData((prev) => ({
              ...prev,
              certifications:
                mappedCerts.length > 0 ? mappedCerts : prev.certifications,
            }));
          }
        }
      } catch (error: any) {
        // If 404 or no data, user hasn't started onboarding - that's okay
        if (error?.response?.status !== 404) {
          console.error("Failed to fetch onboarding status:", error);
          if (loadingToast) toast.dismiss(loadingToast);
          toast.error("Failed to load saved data. Starting fresh.");
        } else {
          if (loadingToast) toast.dismiss(loadingToast);
        }
      } finally {
        if (isMounted) {
          setIsLoadingStatus(false);
        }
      }
    };

    fetchOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleNext = async () => {
    if (currentStep === STEPS.length) {
      navigate("/employee/dashboard");
      return;
    }

    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields correctly");
      window.scrollTo(0, 0);
      return;
    }

    // Save data to backend before moving to next step
    setIsSaving(true);
    const loadingToast = toast.loading("Saving your information...");

    try {
      switch (currentStep) {
        case 1: // Personal Info
          await onboardingService.updatePersonalInfo({
            fullName: formData.fullName,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            tinNumber: formData.tinNumber || undefined,
            pensionNumber: formData.pensionNumber || undefined,
            placeOfWork: formData.placeOfWork || undefined,
          });
          toast.dismiss(loadingToast);
          toast.success("Personal information saved successfully");
          break;

        case 2: // Contact Info
          await onboardingService.updateContactInfo({
            region: formData.region || undefined,
            city: formData.city || undefined,
            subCity: formData.subCity || undefined,
            woreda: formData.woreda || undefined,
            phones: formData.phones.map((phone) => ({
              number: phone.number,
              type: phone.type || "Private",
              isPrimary: phone.isPrimary || false,
            })),
          });
          toast.dismiss(loadingToast);
          toast.success("Contact information saved successfully");
          break;

        case 3: // Education
          await onboardingService.updateEducation({
            education: formData.education.map((edu) => {
              // Extract URL from costSharingDocument
              let costSharingUrl: string | null = null;
              if (edu.costSharingDocument) {
                if (typeof edu.costSharingDocument === "string") {
                  costSharingUrl = edu.costSharingDocument;
                } else if (
                  typeof edu.costSharingDocument === "object" &&
                  "url" in edu.costSharingDocument
                ) {
                  costSharingUrl = edu.costSharingDocument.url || null;
                }
              }

              return {
                level: edu.level,
                fieldOfStudy: edu.fieldOfStudy,
                institution: edu.institution,
                programType: edu.programType,
                hasCostSharing: edu.hasCostSharing || false,
                costSharingDocument: costSharingUrl || undefined,
                startDate: edu.startDate || undefined,
                endDate: edu.endDate || undefined,
                isCurrent: edu.isCurrent || false,
              };
            }),
          });
          toast.dismiss(loadingToast);
          toast.success("Education information saved successfully");
          break;

        case 4: // Work Experience
          await onboardingService.updateWorkExperience({
            workExperience: formData.workExperience.map((exp) => ({
              companyName: exp.companyName,
              position: exp.previousJobTitle || exp.jobTitle || undefined,
              level: exp.level || undefined,
              department: exp.department || undefined,
              startDate: exp.startDate,
              endDate: exp.endDate || undefined,
            })),
          });
          toast.dismiss(loadingToast);
          toast.success("Work experience saved successfully");
          break;

        case 5: // Certifications
          await onboardingService.updateCertifications({
            certifications: formData.certifications.map((cert) => {
              // Extract URL from certificateDocument
              let certUrl: string | undefined = undefined;
              if (cert.certificateDocument) {
                if (typeof cert.certificateDocument === "string") {
                  certUrl = cert.certificateDocument;
                } else if (
                  typeof cert.certificateDocument === "object" &&
                  "url" in cert.certificateDocument
                ) {
                  certUrl = cert.certificateDocument.url;
                }
              }

              return {
                name: cert.name,
                issuingOrganization: cert.issuingOrganization || undefined,
                issueDate: cert.issueDate || undefined,
                expirationDate: cert.expirationDate || undefined,
                credentialId: undefined, // Not in frontend form yet
                certificateDocument: certUrl,
              };
            }),
          });
          toast.dismiss(loadingToast);
          toast.success("Certifications saved successfully");
          break;

        case 6: // Documents - handled in handleSubmit
          toast.dismiss(loadingToast);
          // Documents are saved in handleSubmit
          break;
      }

      // Move to next step
      if (currentStep < STEPS.length) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error("Failed to save step:", error);
      toast.dismiss(loadingToast);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save. Please try again.";
      toast.error(errorMessage);

      // Don't move to next step if save failed
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate first before setting loading state
    if (!validateStep(currentStep)) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    const submittingToast = toast.loading("Submitting your application...");

    try {
      // Deep copy formData to avoid mutating state directly
      const submissionData = JSON.parse(JSON.stringify(formData));

      // Helper to extract URL from file item (files are already uploaded)
      const extractUrl = (item: FileItem | string | null): string | null => {
        if (!item) return null;
        if (typeof item === "string") return item;
        if (item.url) return item.url;
        // If file exists but no URL, it means upload failed - should not happen if validation works
        if (item.error) {
          throw new Error(
            `File "${item.name}" failed to upload: ${item.error}`
          );
        }
        return null;
      };

      // 1. Extract URLs from Main Documents (files are already uploaded)
      if (
        formData.documents.cv &&
        Array.isArray(formData.documents.cv) &&
        formData.documents.cv.length > 0
      ) {
        submissionData.documents.cv = formData.documents.cv
          .map(extractUrl)
          .filter((url): url is string => url !== null);
      }

      if (
        formData.documents.certificates &&
        Array.isArray(formData.documents.certificates) &&
        formData.documents.certificates.length > 0
      ) {
        submissionData.documents.certificates = formData.documents.certificates
          .map(extractUrl)
          .filter((url): url is string => url !== null);
      }

      if (
        formData.documents.photo &&
        Array.isArray(formData.documents.photo) &&
        formData.documents.photo.length > 0
      ) {
        submissionData.documents.photo = formData.documents.photo
          .map(extractUrl)
          .filter((url): url is string => url !== null);
      }

      if (
        formData.documents.experienceLetters &&
        Array.isArray(formData.documents.experienceLetters) &&
        formData.documents.experienceLetters.length > 0
      ) {
        submissionData.documents.experienceLetters =
          formData.documents.experienceLetters
            .map(extractUrl)
            .filter((url): url is string => url !== null);
      }

      if (
        formData.documents.taxForms &&
        Array.isArray(formData.documents.taxForms) &&
        formData.documents.taxForms.length > 0
      ) {
        submissionData.documents.taxForms = formData.documents.taxForms
          .map(extractUrl)
          .filter((url): url is string => url !== null);
      }

      if (
        formData.documents.pensionForms &&
        Array.isArray(formData.documents.pensionForms) &&
        formData.documents.pensionForms.length > 0
      ) {
        submissionData.documents.pensionForms = formData.documents.pensionForms
          .map(extractUrl)
          .filter((url): url is string => url !== null);
      }

      // 2. Extract URLs from Education Documents
      if (formData.education && formData.education.length > 0) {
        submissionData.education = formData.education.map((edu) => {
          if (edu.costSharingDocument) {
            if (typeof edu.costSharingDocument === "string") {
              return { ...edu, costSharingDocument: edu.costSharingDocument };
            } else if (
              typeof edu.costSharingDocument === "object" &&
              "url" in edu.costSharingDocument
            ) {
              if (edu.costSharingDocument.error) {
                throw new Error(
                  `Cost sharing document failed to upload: ${edu.costSharingDocument.error}`
                );
              }
              return {
                ...edu,
                costSharingDocument: edu.costSharingDocument.url,
              };
            }
          }
          return edu;
        });
      }

      // 3. Extract URLs from Certification Documents
      if (formData.certifications && formData.certifications.length > 0) {
        submissionData.certifications = formData.certifications.map((cert) => {
          if (cert.certificateDocument) {
            if (typeof cert.certificateDocument === "string") {
              return {
                ...cert,
                certificateDocument: cert.certificateDocument,
              };
            } else if (
              typeof cert.certificateDocument === "object" &&
              "url" in cert.certificateDocument
            ) {
              if (cert.certificateDocument.error) {
                throw new Error(
                  `Certificate document failed to upload: ${cert.certificateDocument.error}`
                );
              }
              return {
                ...cert,
                certificateDocument: cert.certificateDocument.url,
              };
            }
          }
          return cert;
        });
      }

      console.log("Submitting with Uploaded URLs:", submissionData);

      // Save documents to backend (completes onboarding)
      await onboardingService.updateDocuments({
        documents: {
          cv: submissionData.documents.cv,
          certificates: submissionData.documents.certificates,
          photo: submissionData.documents.photo,
          experienceLetters: submissionData.documents.experienceLetters,
          taxForms: submissionData.documents.taxForms,
          pensionForms: submissionData.documents.pensionForms,
        },
      });

      toast.dismiss(submittingToast);
      toast.success(
        "Application submitted successfully! Onboarding completed."
      );

      try {
        sessionStorage.setItem("onboardingRedirectOverride", "1");
      } catch {
        // ignore
      }

      try {
        const meResponse = await api.get("/users/me");
        const payload: any = meResponse?.data;
        const user =
          payload?.data?.user || payload?.data || payload?.user || null;

        if (user) {
          dispatch(authActions.getMeSuccess(user));
        } else {
          dispatch(authActions.getMeRequest());
        }
      } catch {
        dispatch(authActions.getMeRequest());
      }

      navigate("/employee/dashboard", { replace: true });
    } catch (error: unknown) {
      console.error("Submission error:", error);
      toast.dismiss(submittingToast);
      const errorObj = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        errorObj.response?.data?.message ||
        errorObj.message ||
        "Failed to submit application. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (section: string, data: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
    setErrors({});
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Modal handlers
  const handleAutoFill = (extractedData: ExtractedData) => {
    console.log("Auto-fill data received:", extractedData);

    setFormData((prev) => ({
      ...prev,
      fullName: extractedData.personalInfo?.fullName || prev.fullName,
      gender: extractedData.personalInfo?.gender || prev.gender,
      dateOfBirth: extractedData.personalInfo?.dateOfBirth || prev.dateOfBirth,
      tinNumber: extractedData.personalInfo?.tinNumber || prev.tinNumber,
      pensionNumber:
        extractedData.personalInfo?.pensionNumber || prev.pensionNumber,
      placeOfWork: extractedData.personalInfo?.placeOfWork || prev.placeOfWork,

      region: extractedData.contactInfo?.region || prev.region,
      city: extractedData.contactInfo?.city || prev.city,
      subCity: extractedData.contactInfo?.subCity || prev.subCity,
      woreda: extractedData.contactInfo?.woreda || prev.woreda,
      phones: extractedData.contactInfo?.phones?.length
        ? extractedData.contactInfo.phones
        : prev.phones,

      education: extractedData.education?.length
        ? extractedData.education
        : prev.education,
      workExperience: extractedData.workExperience?.length
        ? extractedData.workExperience
        : prev.workExperience,
      certifications: extractedData.certifications?.length
        ? extractedData.certifications
        : prev.certifications,

      documents: {
        ...prev.documents,
        ...(extractedData.documents || {}),
      },
    }));

    console.log("Form data updated with extracted information");
    setWizardStarted(true);
    setShowModal(false);
  };

  const handleManualStart = () => {
    setWizardStarted(true);
    setShowModal(false);
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  // Redirect immediately if onboarding is completed (prevent flash)
  if (shouldRedirect) {
    return null;
  }

  // Show loading state while fetching onboarding status
  if (isLoadingStatus) {
    return (
      <div className="min-h-screen bg-k-light-grey flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-k-orange mx-auto mb-4"></div>
          <p className="text-k-medium-grey">Loading your onboarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showModal && !wizardStarted}
        onClose={() => setShowModal(false)}
        onAutoFill={handleAutoFill}
        onManualStart={handleManualStart}
      />

      <div className="min-h-screen bg-k-light-grey py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-k-dark-grey">
              Employee Onboarding
            </h1>
            <p className="text-k-medium-grey mt-2">
              Please complete your profile information
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute left-0 top-4 transform -translate-y-1/2 w-full h-[3px] bg-gray-200 z-10" />

              {/* Active Progress Line */}
              <div
                className="absolute left-0 top-4 transform -translate-y-1/2 h-[3px] bg-success transition-all duration-500 z-20"
                style={{
                  width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                }}
              />

              {STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center cursor-pointer z-30"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(step.id);
                    }}
                  >
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isCompleted
                          ? "bg-success border-white"
                          : isCurrent
                          ? "bg-white border-k-orange"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <MdCheck className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-medium font-heading ${
                            isCurrent ? "text-k-orange" : "text-gray-500"
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                        isCurrent
                          ? "text-k-orange"
                          : isCompleted
                          ? "text-success"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-10 mb-8 animate-[slideUp_0.4s_ease-out]">
            <h2 className="text-2xl font-bold text-k-dark-grey mb-6 border-b pb-4 flex justify-between items-center">
              {STEPS[currentStep - 1].title}
              {Object.keys(errors).length > 0 && (
                <span className="text-error text-sm font-normal flex items-center gap-1">
                  <MdError /> Please fill in all required fields
                </span>
              )}
            </h2>

            <CurrentStepComponent
              formData={formData}
              handleChange={handleChange}
              updateFormData={updateFormData}
              errors={errors}
              onEditStep={(stepId: number) => {
                setCurrentStep(stepId);
                window.scrollTo(0, 0);
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={MdArrowBack}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
              icon={currentStep === STEPS.length ? MdCheck : MdArrowForward}
              iconPosition="right"
              loading={
                (isSubmitting && currentStep === STEPS.length) ||
                (isSaving && currentStep !== STEPS.length) ||
                isLoadingStatus
              }
              disabled={isLoadingStatus}
            >
              {currentStep === STEPS.length
                ? "Finish"
                : currentStep === STEPS.length - 1
                ? "Review and Submit"
                : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
