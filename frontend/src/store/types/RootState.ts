import { DepartmentsState } from "../../app/pages/Admin/Departments/slice/types";
import { CreateAccountState } from "../../app/pages/Admin/CreateAccount/slice/types";
import { EmployeesState } from "../../app/pages/Admin/Employees/slice/types";
import { JobTitlesState } from "../../app/pages/Admin/Settings/JobTitles/slice/types";
import { CreateEmploymentState } from "../../app/pages/Admin/CreateEmployment/slice/types";
import { CreateEmployeeState } from "../../app/pages/Admin/CreateEmployee/slice/types";
import { DashboardState } from "../../app/pages/Admin/Dashboard/slice/types";
import { OnboardingState } from "../../app/slice/onboardingSlice";
// Import other slice states here as needed, e.g. AuthState

export interface RootState {
  createAccount?: CreateAccountState;
  employees?: EmployeesState;
  jobTitles?: JobTitlesState;
  createEmployment?: CreateEmploymentState;
  departments?: DepartmentsState;
  createEmployee?: CreateEmployeeState;
  dashboard?: DashboardState;
  auth?: {
    user: { role_id?: number; email?: string } | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
  };
  onboarding: OnboardingState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}

