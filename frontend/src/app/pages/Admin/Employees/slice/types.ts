export interface Employee {
  id: string; // This might be the database UUID
  employee_id: string; // This is the custom ID like EMP-001
  full_name: string;
  email?: string;
  gender: string;
  date_of_birth: string;
  tin_number?: string;
  pension_number?: string;
  place_of_work?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EmployeesState {
  loading: boolean;
  error: string | null;
  employees: Employee[];
  pagination: Pagination;
}
