// Types for completed employees API response

export interface Address {
  id: number;
  company_id: number;
  employee_id: string;
  region: string | null;
  city: string | null;
  sub_city: string | null;
  woreda: string | null;
}

export interface Phone {
  id: number;
  company_id: number;
  employee_id: string;
  phone_number: string;
  phone_type: string;
  is_primary: boolean;
}

export interface Education {
  id: number;
  employee_id: string;
  education_level_id: number;
  field_of_study_id: number;
  institution_id: number;
  program_type: string;
  has_cost_sharing: boolean;
  cost_sharing_document_url: string | null;
  start_date: string;
  end_date: string;
  is_verified: boolean;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmploymentHistory {
  id: number;
  employee_id: string;
  previous_company_name: string;
  job_title_id: number | null;
  previous_job_title_text: string | null;
  previous_level: string | null;
  department_name: string | null;
  start_date: string;
  end_date: string;
  is_verified: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LicenseOrCertification {
  id: number;
  employee_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Documents {
  id: number;
  employee_id: string;
  company_id: number;
  cv: string[];
  certificates: string[];
  photo: string[];
  experienceLetters: string[];
  taxForms: string[];
  pensionForms: string[];
}

export interface EmployeeDetails {
  id: string;
  company_id: number;
  full_name: string;
  gender: string | null;
  date_of_birth: string | null;
  tin_number: string | null;
  pension_number: string | null;
  place_of_work: string;
  created_at: string;
  updated_at: string;
  addresses: Address[];
  phones: Phone[];
  educations: Education[];
  employmentHistories: EmploymentHistory[];
  licensesAndCertifications: LicenseOrCertification[];
  documents: Documents | null;
  employments: any[];
}

export interface Role {
  id: number;
  company_id?: number;
  name: string;
  description?: string;
}

export interface CompletedEmployee {
  id: number;
  company_id: number;
  employee_id: string;
  email: string;
  role_id: number;
  is_active: boolean;
  onboarding_status: 'COMPLETED' | 'PENDING_APPROVAL' | 'IN_PROGRESS';
  created_at: string;
  updated_at: string;
  employee: EmployeeDetails;
  role: Role;
}

// Legacy Employee type for backwards compatibility
export interface Employee {
  id: string; // "EMP-0001"
  fullName: string;
  department: string;
  jobTitle: string;
  status: string;
  onboarding_status?: string;
  gender?: string;
  date_of_birth?: string;
  manager?: {
    id: string;
    full_name: string;
    jobTitle: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EmployeeFilters {
  search?: string;
  department_id?: string;
  job_title_id?: string;
  employment_type?: string;
  status?: string;
  gender?: string;
  hire_date_from?: string;
  hire_date_to?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface EmployeesState {
  loading: boolean;
  error: string | null;
  employees: Employee[];
  completedEmployees: CompletedEmployee[];
  selectedEmployee: CompletedEmployee | null;
  pagination: Pagination;
  filters: EmployeeFilters;
}
