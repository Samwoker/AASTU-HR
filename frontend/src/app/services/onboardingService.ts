import api from './api';
import apiRoutes from '../API/apiRoutes';

interface PersonalInfoData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  tinNumber?: string;
  pensionNumber?: string;
  placeOfWork?: string;
}

interface Phone {
  number: string;
  type?: string;
  isPrimary?: boolean;
}

interface ContactInfoData {
  region?: string;
  city?: string;
  subCity?: string;
  woreda?: string;
  phones: Phone[];
}

interface EducationData {
  level: string;
  fieldOfStudy: string;
  institution: string;
  programType: string;
  hasCostSharing?: boolean;
  costSharingDocument?: string | null;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface WorkExperienceData {
  companyName: string;
  position?: string;
  level?: string;
  department?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface CertificationData {
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  certificateDocument?: string;
}

interface DocumentsData {
  cv?: string[];
  certificates?: string[];
  photo?: string[];
  experienceLetters?: string[];
  taxForms?: string[];
  pensionForms?: string[];
}

interface OnboardingStatusResponse {
  status: string;
  data: {
    onboarding_status: string;
    employee?: any;
    contact?: any;
    education?: any[];
    workExperience?: any[];
    certifications?: any[];
  };
}

const onboardingService = {
  /**
   * Get current onboarding status and saved data
   */
  getStatus: async (): Promise<OnboardingStatusResponse> => {
    const response = await api.get(apiRoutes.onboardingStatus);
    return response.data;
  },

  /**
   * Step 1: Update personal information
   */
  updatePersonalInfo: async (data: PersonalInfoData) => {
    const response = await api.patch(apiRoutes.onboardingPersonalInfo, data);
    return response.data;
  },

  /**
   * Step 2: Update contact information
   */
  updateContactInfo: async (data: ContactInfoData) => {
    const response = await api.patch(apiRoutes.onboardingContactInfo, data);
    return response.data;
  },

  /**
   * Step 3: Update education
   */
  updateEducation: async (data: { education: EducationData[] }) => {
    const response = await api.patch(apiRoutes.onboardingEducation, data);
    return response.data;
  },

  /**
   * Step 4: Update work experience
   */
  updateWorkExperience: async (data: { workExperience: WorkExperienceData[] }) => {
    const response = await api.patch(apiRoutes.onboardingWorkExperience, data);
    return response.data;
  },

  /**
   * Step 5: Update certifications
   */
  updateCertifications: async (data: { certifications: CertificationData[] }) => {
    const response = await api.patch(apiRoutes.onboardingCertifications, data);
    return response.data;
  },

  /**
   * Step 6: Update documents (completes onboarding)
   */
  updateDocuments: async (data: { documents: DocumentsData }) => {
    const response = await api.patch(apiRoutes.onboardingDocuments, data);
    return response.data;
  },
};

export default onboardingService;
export type {
  PersonalInfoData,
  ContactInfoData,
  EducationData,
  WorkExperienceData,
  CertificationData,
  DocumentsData,
  OnboardingStatusResponse,
};

