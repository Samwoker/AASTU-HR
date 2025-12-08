import { routeConstants } from '../constants';
import AdminDashboard from '../../app/pages/Admin/Dashboard';
import CreateUser from '../../app/pages/Admin/CreateAccount';
import CreateEmployment from '../../app/pages/Admin/CreateEmployment';
import CreateEmployee from '../../app/pages/Admin/CreateEmployee';
import Departments from '../../app/pages/Admin/Departments';
import Employees from '../../app/pages/Admin/Employees';
import EmployeeDashboard from '../../app/pages/employee/Dashboard';
import Login from '../../app/pages/Authentication/Login';
import EmployeeLogin from '../../app/pages/Authentication/EmployeeLogin';
import AdminLogin from '../../app/pages/Authentication/AdminLogin';
import EmployeeOnboarding from '../../app/pages/employee/Onboarding';
import LeaveApplication from '../../app/pages/employee/LeaveApplication';
import LeaveRecall from '../../app/pages/employee/LeaveRecall';
import ProfileUpdateLayout from '../../app/pages/employee/ProfileUpdate/ProfileUpdateLayout';
import Settings from '../../app/pages/Admin/Settings';
import NotFound from '../../app/pages/ErrorDisplayPage/NotFound';
import NoAuthorized from '../../app/pages/ErrorDisplayPage/NoAuthorized';
import { IRoute } from './types';

export const routes: IRoute[] = [
  {
    path: routeConstants.login,
    element: <Login />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.home,
    element: <Login />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.employeeLogin,
    element: <EmployeeLogin />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.adminLogin,
    element: <AdminLogin />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.dashboard,
    element: <AdminDashboard />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.createUser,
    element: <CreateUser />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.createEmployment,
    element: <CreateEmployment />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.createEmployee,
    element: <CreateEmployee />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employees,
    element: <Employees />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employeeDashboard,
    element: <EmployeeDashboard />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.departments,
    element: <Departments />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employeeOnboarding,
    element: <EmployeeOnboarding />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employeeLeave,
    element: <LeaveApplication />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employeeLeaveRecall,
    element: <LeaveRecall />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.employeeProfile,
    element: <ProfileUpdateLayout />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.settings,
    element: <Settings />,
    isAuthenticated: true,
  },
  {
    path: routeConstants.noAuthorized,
    element: <NoAuthorized />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.notFound,
    element: <NotFound />,
    isAuthenticated: false,
  },
];
