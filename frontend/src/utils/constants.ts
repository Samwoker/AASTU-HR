export const routeConstants = {
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  setupAccount: "/setup-account/:token",
  dashboard: "/admin/dashboard",
  createUser: "/admin/users/create",
  assignManager: "/admin/managers/assign",
  managerDetail: "/admin/managers/:managerId",
  createEmployment: "/admin/employment/create",
  createEmployee: "/admin/employees/create",
  employees: "/admin/employees",
  employeeDetail: "/admin/employees/:employeeId",
  fullEmployeeProfile: "/admin/employees/:employeeId/full-profile",
  submittedUsers: "/admin/users/submitted",
  submittedUserDetail: "/admin/users/submitted/:userId",
  pendingUsers: "/admin/users/pending",
  departments: "/admin/departments",
  employeeLogin: "/employee-login",
  adminLogin: "/admin-login",
  employeeOnboarding: "/employee/onboarding",
  employeeLeave: "/employee/leave",
  employeeLeaveRecall: "/employee/leave-recall",
  employeeLeaveCashOut: "/employee/leave-cash-out",
  employeeProfile: "/employee/profile",
  employeeDashboard: "/employee/dashboard",
  settings: "/admin/settings",
  // Missing routes restored
  waitingApproval: "/employee/waiting-approval",
  promoteEmployee: "/admin/employees/:id/promote",
  
  // Admin Leave Management
  adminLeaves: "/admin/leaves",
  adminLeaveTypes: "/admin/leave-types",
  adminPublicHolidays: "/admin/public-holidays",
  adminLeaveSettings: "/admin/leave-settings",
  buildTeam: "/admin/managers/:managerId/build-team",
  notFound: "*",
  noAuthorized: "/no-authorized",
};

export const USER_ROLES = {
  ADMIN: "Admin",
  HR: "HR",
  EMPLOYEE: "Employee",
};

export const ROLE_OPTIONS = [
  { id: 1, name: "Admin" },
  { id: 3, name: "Employee" },
  { id: 2, name: "HR" },
] as const;

export const getRoleNameById = (roleId?: number | null): string => {
  if (!roleId) return "Employee";
  return ROLE_OPTIONS.find((r) => r.id === roleId)?.name || "Employee";
};
