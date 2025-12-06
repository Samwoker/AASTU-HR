export interface Department {
  id: number;
  name: string;
}

export interface DepartmentsState {
  isLoading: boolean;
  departments: Department[];
  error: string | null;
}
