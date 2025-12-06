export interface CreateEmploymentPayload {
  employee_id: string;
  manager_id?: string;
  employment_type: string;
  start_date: string;
  end_date?: string;
  gross_salary: number;
  department?: string;
  job_title_id?: number;
  cost_sharing_status?: string;
  cost_sharing_amount?: number;
  provider_company?: string;
  contract_reference?: string;
  probation_end_date?: string;
  notes?: string;
}

export interface CreateEmploymentState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
