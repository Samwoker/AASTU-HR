import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepPersonalInfo from "../../components/employees/wizard/StepPersonalInfo";
import StepContactInfo from "../../components/employees/wizard/StepContactInfo";
import StepEducation from "../../components/employees/wizard/StepEducation";
import StepWorkExperience from "../../components/employees/wizard/StepWorkExperience";
import StepCertifications from "../../components/employees/wizard/StepCertifications";
import StepDocuments from "../../components/employees/wizard/StepDocuments";
import RegistrationModal from "../../components/employees/RegistrationModal";
import Button from "../../components/common/Button";
import { MdCheck, MdArrowBack, MdArrowForward, MdError } from "react-icons/md";

const STEPS = [
  { id: 1, title: "Personal Info", component: StepPersonalInfo },
  { id: 2, title: "Contact Info", component: StepContactInfo },
  { id: 3, title: "Education", component: StepEducation },
  { id: 4, title: "Work Experience", component: StepWorkExperience },
  { id: 5, title: "Certifications", component: StepCertifications },
  { id: 6, title: "Documents", component: StepDocuments },
];

export default function EmployeeRegistrationWizard() {
  const [showModal, setShowModal] = useState(true);
  const [wizardStarted, setWizardStarted] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
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

    // Documents
    documents: {
      cv: null,
      certificates: null,
      experienceLetters: null,
      photo: null,
      taxForms: null,
    },
  });

  const validateStep = (step) => {
    const newErrors = {};
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
      if (!formData.documents.cv) newErrors.cv = "CV/Resume is required";
      if (!formData.documents.certificates)
        newErrors.certificates = "Educational Certificates are required";
      if (!formData.documents.photo) newErrors.photo = "Photo/ID is required";
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
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    } else {
      // Scroll to top to see errors if needed, or show a toast
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Form Submitted:", formData);
      // TODO: API call to submit data
      navigate("/dashboard"); // Redirect to dashboard after submission
    }
  };

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data, // Or merge depending on structure
    }));
    // Clear errors for this section on change (simplified)
    setErrors({});
  };

  // Helper to update specific fields directly
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Modal handlers
  const handleAutoFill = (extractedData) => {
    console.log('Auto-fill data received:', extractedData);
    
    // Flatten and merge extracted data with form data
    setFormData(prev => ({
      ...prev,
      // Personal Info - flatten from nested structure
      fullName: extractedData.personalInfo?.fullName || prev.fullName,
      gender: extractedData.personalInfo?.gender || prev.gender,
      dateOfBirth: extractedData.personalInfo?.dateOfBirth || prev.dateOfBirth,
      tinNumber: extractedData.personalInfo?.tinNumber || prev.tinNumber,
      pensionNumber: extractedData.personalInfo?.pensionNumber || prev.pensionNumber,
      placeOfWork: extractedData.personalInfo?.placeOfWork || prev.placeOfWork,
      
      // Contact Info - flatten from nested structure
      region: extractedData.contactInfo?.region || prev.region,
      city: extractedData.contactInfo?.city || prev.city,
      subCity: extractedData.contactInfo?.subCity || prev.subCity,
      woreda: extractedData.contactInfo?.woreda || prev.woreda,
      phones: extractedData.contactInfo?.phones?.length > 0 
        ? extractedData.contactInfo.phones 
        : prev.phones,
      
      // Education, Work Experience, Certifications - direct arrays
      education: extractedData.education && extractedData.education.length > 0
        ? extractedData.education
        : prev.education,
      workExperience: extractedData.workExperience && extractedData.workExperience.length > 0
        ? extractedData.workExperience
        : prev.workExperience,
      certifications: extractedData.certifications && extractedData.certifications.length > 0
        ? extractedData.certifications
        : prev.certifications,
      
      // Documents
      documents: {
        ...prev.documents,
        ...(extractedData.documents || {})
      }
    }));
    
    console.log('Form data updated with extracted information');
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
          >
            {currentStep === STEPS.length ? "Submit Application" : "Next Step"}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
