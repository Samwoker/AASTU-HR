import { DepartmentsState } from "../../app/pages/Admin/Departments/slice/types";
import { CreateAccountState } from "../../app/pages/Admin/CreateAccount/slice/types";
import { EmployeesState } from "../../app/pages/Admin/Employees/slice/types";
import { JobTitlesState } from "../../app/pages/Admin/Settings/JobTitles/slice/types";
import { CreateEmploymentState } from "../../app/pages/Admin/CreateEmployment/slice/types";
import { CreateEmployeeState } from "../../app/pages/Admin/CreateEmployee/slice/types";
import { DashboardState } from "../../app/pages/Admin/Dashboard/slice/types";
import { OnboardingState } from "../../app/slice/onboardingSlice";
import { AuthState } from "../../app/slice/authSlice/types";
import { UserState } from "../../app/slice/userSlice/types";
import { EmployeeState } from "../../app/slice/employeeSlice/types";
import { EmploymentState } from "../../app/slice/employmentSlice/types";
import { AdminState } from "../../app/slice/adminSlice/types";

export interface RootState {
  createAccount?: CreateAccountState;
  employees?: EmployeesState;
  jobTitles?: JobTitlesState;
  createEmployment?: CreateEmploymentState;
  departments?: DepartmentsState;
  createEmployee?: CreateEmployeeState;
  dashboard?: DashboardState;
  auth?: AuthState;
  onboarding: OnboardingState;
  user?: UserState;
  employee?: EmployeeState;
  employment?: EmploymentState;
  admin?: AdminState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
