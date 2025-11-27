const BASE_URL = import.meta.env.VITE_BASE_URL;

//  Auth API
export const authAPI = {
  login: `${BASE_URL}/api/v1/auth/login`,
  register: `${BASE_URL}/api/v1/auth/register`,
};

//  Helper API
export const helperAPI = {
  companies: `${BASE_URL}/api/v1/companies`,
  roles: (companyId = "") =>
    `${BASE_URL}/api/v1/roles${companyId ? `?company_id=${companyId}` : ""}`,
};

//  Employee API
export const employeeAPI = {
  create: `${BASE_URL}/api/v1/employees/create`,
  getEmployees: `${BASE_URL}/api/v1/employees/fetchall`,
  getEmployee: `${BASE_URL}/api/v1/employees/fetchEmployee`,
  getManager: `${BASE_URL}/api/v1/employees/fetchManager`,
};

//  Onboarding Flow
export const onboardingAPI = {
  createEmployment: `${BASE_URL}/api/v1/employments/create`,
  createUser: `${BASE_URL}/api/v1/users`,
};
