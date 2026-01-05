export interface EmploymentTypeStats {
  fullTime: number;
  partTime: number;
  contract: number;
  outsourced: number;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  activeEmployees: number;
  totalManagers: number;
  inactiveEmployees?: number;
  employmentType?: EmploymentTypeStats;
}

export interface DashboardFilters {
  department_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface DashboardState {
  loading: boolean;
  error: string | null;
  stats: DashboardStats;
  filters: DashboardFilters;
}
