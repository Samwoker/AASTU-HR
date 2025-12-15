const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const apiRoutes = {
  // Authentication routes
  login: `${BASE_URL}/auth/login`,
  forgotPassword: `${BASE_URL}/auth/forgotPassword`,
  resetPassword: `${BASE_URL}/auth/resetPassword/:token`,
  updateMyPassword: `${BASE_URL}/auth/updateMyPassword`,

  // Onboarding routes
  onboardingStatus: `${BASE_URL}/onboarding/status`,
  onboardingPersonalInfo: `${BASE_URL}/onboarding/personal-info`,
  onboardingContactInfo: `${BASE_URL}/onboarding/contact-info`,
  onboardingEducation: `${BASE_URL}/onboarding/education`,
  onboardingWorkExperience: `${BASE_URL}/onboarding/work-experience`,
  onboardingCertifications: `${BASE_URL}/onboarding/certifications`,
  onboardingDocuments: `${BASE_URL}/onboarding/documents`,

  // User Management routes
  users: `${BASE_URL}/users`,
  me: `${BASE_URL}/users/me`,
  userById: (id: number | string) => `${BASE_URL}/users/${id}`,
  userPassword: (id: number) => `${BASE_URL}/users/${id}/password`,
  usersCount: `${BASE_URL}/users/count`,
  submittedUsers: `${BASE_URL}/users/submitted`,
  pendingUsers: `${BASE_URL}/users/pending`,
  approveUser: (id: string) => `${BASE_URL}/users/pending/${id}/approve`,

  // Employee Management routes
  employees: `${BASE_URL}/employees`,
  employeeById: (id: string) => `${BASE_URL}/employees/${id}`,
  employeesCount: `${BASE_URL}/employees/count`,
  completedEmployees: `${BASE_URL}/employees/completed`,

  // Employment Management routes
  employments: `${BASE_URL}/employments`,
  employmentById: (id: number) => `${BASE_URL}/employments/${id}`,
  employmentByEmployee: (employeeId: string) =>
    `${BASE_URL}/employments/employee/${employeeId}/latest`,
  employmentsCount: `${BASE_URL}/employments/count`,
  activeEmploymentsCount: `${BASE_URL}/employments/count/active`,
  inactiveEmploymentsCount: `${BASE_URL}/employments/count/inactive`,
  managersCount: `${BASE_URL}/employments/count/managers`,
  genderDistribution: `${BASE_URL}/employments/gender-dist`,
  managerDistribution: `${BASE_URL}/employments/manager-dist`,
  jobDistribution: `${BASE_URL}/employments/job-dist`,
  departmentDistribution: `${BASE_URL}/employments/dept-dist`,
  employmentTypeDistribution: `${BASE_URL}/employments/emp-type-dist`,

  // Role Management routes
  roles: `${BASE_URL}/roles`,

  // Department Management routes
  departments: `${BASE_URL}/department`,
  departmentsCount: `${BASE_URL}/department/count`,

  // Job Title Management routes
  jobTitles: `${BASE_URL}/job-titles`,
};

export default apiRoutes;
