import { routeConstants } from "../constants";
import AdminDashboard from "../../app/pages/Admin/Dashboard";
import CreateUser from "../../app/pages/Admin/CreateAccount";
import CreateEmployment from "../../app/pages/Admin/CreateEmployment";
import CreateEmployee from "../../app/pages/Admin/CreateEmployee";
import Departments from "../../app/pages/Admin/Departments";
import Employees from "../../app/pages/Admin/Employees";
import EmployeeDetail from "../../app/pages/Admin/EmployeeDetail";
import FullEmployeeProfile from "../../app/pages/Admin/FullEmployeeProfile";
import SubmittedUsers from "../../app/pages/Admin/SubmittedUsers";
import SubmittedUserDetail from "../../app/pages/Admin/SubmittedUserDetail";
import PendingUsers from "../../app/pages/Admin/PendingUsers";
import LeaveManagement from "../../app/pages/Admin/LeaveManagement";
import LeaveTypes from "../../app/pages/Admin/LeaveTypes";
import PublicHolidays from "../../app/pages/Admin/PublicHolidays";
import LeaveSettings from "../../app/pages/Admin/LeaveSettings";
import AdminManagers from "../../app/pages/Admin/Managers";
import AdminConnectManager from "../../app/pages/Admin/Managers/AssignManager";
import ManagerDetail from "../../app/pages/Admin/Managers/Detail";
import BuildTeamPage from "../../app/pages/Admin/Managers/BuildTeam";
import PromotionPage from "../../app/pages/Admin/Employees/Promotion";
import WaitingApproval from "../../app/pages/employee/WaitingApproval";
import EmployeeDashboard from "../../app/pages/employee/Dashboard";
import Login from "../../app/pages/Authentication/Login";
import EmployeeLogin from "../../app/pages/Authentication/EmployeeLogin";
import AdminLogin from "../../app/pages/Authentication/AdminLogin";
import ForgotPassword from "../../app/pages/Authentication/ForgotPassword";
import ResetPassword from "../../app/pages/Authentication/ResetPassword";
import SetupAccount from "../../app/pages/Authentication/SetupAccount";
import EmployeeOnboarding from "../../app/pages/employee/Onboarding";
import LeaveApplication from "../../app/pages/employee/LeaveApplication";
import LeaveRecall from "../../app/pages/employee/LeaveRecall";
import LeaveCashOut from "../../app/pages/employee/LeaveCashOut";
import ProfileUpdateLayout from "../../app/pages/employee/ProfileUpdate/ProfileUpdateLayout";
import Settings from "../../app/pages/Admin/Settings";
import NotFound from "../../app/pages/ErrorDisplayPage/NotFound";
import NoAuthorized from "../../app/pages/ErrorDisplayPage/NoAuthorized";
import { IRoute } from "./types";

export const routes: IRoute[] = [
  {
    path: routeConstants.login,
    element: <Login />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.forgotPassword,
    element: <ForgotPassword />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.resetPassword,
    element: <ResetPassword />,
    isAuthenticated: false,
  },
  {
    path: routeConstants.setupAccount,
    element: <SetupAccount />,
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
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.createUser,
    element: <CreateUser />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.createEmployment,
    element: <CreateEmployment />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.createEmployee,
    element: <CreateEmployee />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.employees,
    element: <Employees />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.employeeDetail,
    element: <EmployeeDetail />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.fullEmployeeProfile,
    element: <FullEmployeeProfile />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: "/admin/managers",
    element: <AdminManagers />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.assignManager,
    element: <AdminConnectManager />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.managerDetail,
    element: <ManagerDetail />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.buildTeam,
    element: <BuildTeamPage />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.submittedUsers,
    element: <SubmittedUsers />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.submittedUserDetail,
    element: <SubmittedUserDetail />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.pendingUsers,
    element: <PendingUsers />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.employeeDashboard,
    element: <EmployeeDashboard />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.departments,
    element: <Departments />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.employeeOnboarding,
    element: <EmployeeOnboarding />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.waitingApproval,
    element: <WaitingApproval />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.promoteEmployee,
    element: <PromotionPage />,
    isAuthenticated: true,
    allowedRoles: [1],
  },
  {
    path: routeConstants.employeeLeave,
    element: <LeaveApplication />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.employeeLeaveRecall,
    element: <LeaveRecall />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.employeeLeaveCashOut,
    element: <LeaveCashOut />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.employeeProfile,
    element: <ProfileUpdateLayout />,
    isAuthenticated: true,
    allowedRoles: [3],
  },
  {
    path: routeConstants.settings,
    element: <Settings />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.adminLeaves,
    element: <LeaveManagement />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.adminLeaveTypes,
    element: <LeaveTypes />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.adminPublicHolidays,
    element: <PublicHolidays />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
  },
  {
    path: routeConstants.adminLeaveSettings,
    element: <LeaveSettings />,
    isAuthenticated: true,
    allowedRoles: [1, 2],
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
