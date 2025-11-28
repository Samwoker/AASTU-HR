export interface CreateEmployeeState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface CreateEmployeePayload {
  employee_id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  tin_number?: string;
  pension_number?: string;
  place_of_work?: string;
}
