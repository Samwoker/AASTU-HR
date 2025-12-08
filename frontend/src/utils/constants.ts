export const routeConstants = {
  home: '/',
  login: '/login',
  dashboard: '/admin/dashboard',
  createUser: '/admin/create-user',
  createEmployment: '/admin/employment/create',
  createEmployee: '/admin/employees/create',
  employees: '/admin/employees',
  departments: '/admin/departments',
  employeeLogin: '/employee-login',
  adminLogin: '/admin-login',
  employeeOnboarding: '/employee/onboarding',
  employeeLeave: '/employee/leave',
  employeeLeaveRecall: '/employee/leave-recall',
  employeeProfile: '/employee/profile',
  employeeDashboard: '/employee/dashboard',
  settings: '/admin/settings',
  notFound: '*',
  noAuthorized: '/no-authorized',
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  HR: 'HR',
  EMPLOYEE: 'Employee',
};
