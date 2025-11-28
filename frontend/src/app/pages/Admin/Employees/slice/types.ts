export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Add other fields as needed
}

export interface EmployeesState {
  loading: boolean;
  error: string | null;
  employees: Employee[];
}
