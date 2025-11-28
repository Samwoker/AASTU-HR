import { DepartmentsState } from '../../app/pages/Admin/Departments/slice/types';
import { CreateAccountState } from '../../app/pages/Admin/CreateAccount/slice/types';
// Import other slice states here as needed, e.g. AuthState

export interface RootState {
  departments?: DepartmentsState;
  createAccount?: CreateAccountState;
  auth?: any; // Temporary placeholder } with actual AuthState when available
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
