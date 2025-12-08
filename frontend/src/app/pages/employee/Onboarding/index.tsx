import { useState } from "react";
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
import employeeService from "../../../services/employeeService";

// Define types for the form data
interface Phone {
  number: string;
  type: string;
  isPrimary: boolean;
}

interface Education {
  level: string;
  fieldOfStudy: string;
  institution: string;
  programType: string;
  hasCostSharing: boolean;
  costSharingDocument?: File | null;
  [key: string]: any;
}

interface WorkExperience {
  companyName: string;
  startDate: string;
  [key: string]: any;
}

interface Certification {
  name: string;
  certificateDocument?: File | null;
  [key: string]: any;
}

interface Documents {
  cv: File[];
  certificates: File[];
  experienceLetters: File[];
  photo: File[];
  taxForms: File[];
  pensionForms: File[];
  [key: string]: File[];
}

export interface OnboardingFormData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  tinNumber: string;
  pensionNumber: string;
  placeOfWork: string;
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  phones: Phone[];
  education: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  documents: Documents;
  [key: string]: any;
}

const STEPS = [
  { id: 1, title: "Personal Info", component: StepPersonalInfo },
  { id: 2, title: "Contact Info", component: StepContactInfo },
  { id: 3, title: "Education", component: StepEducation },
  { id: 4, title: "Work Experience", component: StepWorkExperience },
  { id: 5, title: "Certifications", component: StepCertifications },
  { id: 6, title: "Documents", component: StepDocuments },
  { id: 7, title: "Review", component: StepReview },
];

export default function EmployeeRegistrationWizard() {
  const [showModal, setShowModal] = useState(true);
  const [wizardStarted, setWizardStarted] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<OnboardingFormData>({
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

  const validateStep = (step: number) => {
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

        if (edu.hasCostSharing && !edu.costSharingDocument) {
          newErrors[`edu_cost_doc_${index}`] =
            "Cost Sharing Document is required";
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
      if (!formData.documents.cv || formData.documents.cv.length === 0)
        newErrors.cv = "CV/Resume is required";
      if (
        !formData.documents.certificates ||
        formData.documents.certificates.length === 0
      )
        newErrors.certificates = "Educational Certificates are required";
      if (!formData.documents.photo || formData.documents.photo.length === 0)
        newErrors.photo = "Photo/ID is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }

    return isValid;
  };

  const handleNext = () => {
    if (currentStep === STEPS.length) {
      handleSubmit();
      return;
    }

    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Show validation error toast
      toast.error("Please fill in all required fields correctly");
      // Scroll to top to see errors
      window.scrollTo(0, 0);
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
    if (validateStep(currentStep)) {
      setIsSubmitting(true);

      try {
        // Deep copy formData to avoid mutating state directly during upload process
        const submissionData = JSON.parse(JSON.stringify(formData));

        // Helper to upload a single file
        const uploadIfFile = async (fileOrUrl: any) => {
          // Check if it's a File object (has name, size, type) - simplified check
          // In a real browser environment, instanceof File is better, but this works for now
          if (fileOrUrl && typeof fileOrUrl === "object" && fileOrUrl.name) {
            try {
              // Upload as raw for PDFs/docs, auto for others
              // const isDoc =
              //   fileOrUrl.type.includes("pdf") ||
              //   fileOrUrl.type.includes("document");
              // const options = isDoc ? { resourceType: "raw" } : {};
              // Note: We reverted fileUploadService to simple version, so no options supported currently.
              // Just call uploadFile(fileOrUrl)
              // If we re-enable raw support later, we can pass options.

              // Import uploadFile dynamically or ensure it's imported at top
              const { uploadFile } = await import(
                "../../../services/fileUploadService"
              );
              return await uploadFile(fileOrUrl);
            } catch (err) {
              console.error(`Failed to upload file ${fileOrUrl.name}`, err);
              throw new Error(`Failed to upload ${fileOrUrl.name}`);
            }
          }
          return fileOrUrl; // Return as is if it's already a URL or null
        };

        // 1. Upload Main Documents (all as arrays now)
        if (
          formData.documents.cv &&
          Array.isArray(formData.documents.cv) &&
          formData.documents.cv.length > 0
        ) {
          submissionData.documents.cv = await Promise.all(
            formData.documents.cv.map((file) => uploadIfFile(file))
          );
        }

        if (
          formData.documents.certificates &&
          Array.isArray(formData.documents.certificates) &&
          formData.documents.certificates.length > 0
        ) {
          submissionData.documents.certificates = await Promise.all(
            formData.documents.certificates.map((file) => uploadIfFile(file))
          );
        }

        if (
          formData.documents.photo &&
          Array.isArray(formData.documents.photo) &&
          formData.documents.photo.length > 0
        ) {
          submissionData.documents.photo = await Promise.all(
            formData.documents.photo.map((file) => uploadIfFile(file))
          );
        }

        if (
          formData.documents.experienceLetters &&
          Array.isArray(formData.documents.experienceLetters) &&
          formData.documents.experienceLetters.length > 0
        ) {
          submissionData.documents.experienceLetters = await Promise.all(
            formData.documents.experienceLetters.map((file) =>
              uploadIfFile(file)
            )
          );
        }

        // Handle arrays of files (taxForms, pensionForms) if they exist
        if (
          formData.documents.taxForms &&
          Array.isArray(formData.documents.taxForms) &&
          formData.documents.taxForms.length > 0
        ) {
          submissionData.documents.taxForms = await Promise.all(
            formData.documents.taxForms.map((file) => uploadIfFile(file))
          );
        }

        if (
          formData.documents.pensionForms &&
          Array.isArray(formData.documents.pensionForms) &&
          formData.documents.pensionForms.length > 0
        ) {
          submissionData.documents.pensionForms = await Promise.all(
            formData.documents.pensionForms.map((file) => uploadIfFile(file))
          );
        }

        // 2. Upload Education Documents
        if (formData.education && formData.education.length > 0) {
          submissionData.education = await Promise.all(
            formData.education.map(async (edu: any) => {
              if (edu.costSharingDocument) {
                return {
                  ...edu,
                  costSharingDocument: await uploadIfFile(
                    edu.costSharingDocument
                  ),
                };
              }
              return edu;
            })
          );
        }

        // 3. Upload Certification Documents
        if (formData.certifications && formData.certifications.length > 0) {
          submissionData.certifications = await Promise.all(
            formData.certifications.map(async (cert: any) => {
              if (cert.certificateDocument) {
                return {
                  ...cert,
                  certificateDocument: await uploadIfFile(
                    cert.certificateDocument
                  ),
                };
              }
              return cert;
            })
          );
        }

        console.log("Submitting with Uploaded URLs:", submissionData);

        await employeeService.onboardEmployee(submissionData);
        toast.success("Application submitted successfully!");

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate("/employee/dashboard");
        }, 1000);
      } catch (error: any) {
        console.error("Submission error:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit application. Please try again.";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix all errors before submitting");
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data, // Or merge depending on structure
    }));
    // Clear errors for this section on change (simplified)
    setErrors({});
  };

  // Helper to update specific fields directly
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Modal handlers
  const handleAutoFill = (extractedData: any) => {
    console.log("Auto-fill data received:", extractedData);

    // Flatten and merge extracted data with form data
    setFormData((prev) => ({
      ...prev,
      // Personal Info - flatten from nested structure
      fullName: extractedData.personalInfo?.fullName || prev.fullName,
      gender: extractedData.personalInfo?.gender || prev.gender,
      dateOfBirth: extractedData.personalInfo?.dateOfBirth || prev.dateOfBirth,
      tinNumber: extractedData.personalInfo?.tinNumber || prev.tinNumber,
      pensionNumber:
        extractedData.personalInfo?.pensionNumber || prev.pensionNumber,
      placeOfWork: extractedData.personalInfo?.placeOfWork || prev.placeOfWork,

      // Contact Info - flatten from nested structure
      region: extractedData.contactInfo?.region || prev.region,
      city: extractedData.contactInfo?.city || prev.city,
      subCity: extractedData.contactInfo?.subCity || prev.subCity,
      woreda: extractedData.contactInfo?.woreda || prev.woreda,
      phones:
        extractedData.contactInfo?.phones?.length > 0
          ? extractedData.contactInfo.phones
          : prev.phones,

      // Education, Work Experience, Certifications - direct arrays
      education:
        extractedData.education && extractedData.education.length > 0
          ? extractedData.education
          : prev.education,
      workExperience:
        extractedData.workExperience && extractedData.workExperience.length > 0
          ? extractedData.workExperience
          : prev.workExperience,
      certifications:
        extractedData.certifications && extractedData.certifications.length > 0
          ? extractedData.certifications
          : prev.certifications,

      // Documents
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
                      // Optional: Allow clicking to go back to completed steps
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
              onClick={handleNext}
              icon={currentStep === STEPS.length ? MdCheck : MdArrowForward}
              iconPosition="right"
              loading={isSubmitting && currentStep === STEPS.length}
            >
              {currentStep === STEPS.length
                ? "Submit Application"
                : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
