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
  reliefOfficers: `${BASE_URL}/employees/relief-officers`,

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

  // Allowance Type Management routes
  allowanceTypes: `${BASE_URL}/allowance-types`,

  // ==========================================
  // Leave Management routes
  // ==========================================

  // Leave Types
  leaveTypes: `${BASE_URL}/leave-types`,
  leaveTypeById: (id: string | number) => `${BASE_URL}/leave-types/${id}`,
  applicableLeaveTypes: `${BASE_URL}/leave-types/applicable`,
  seedDefaultLeaveTypes: `${BASE_URL}/leave-types/seed-defaults`,

  // Leave Balance
  myLeaveBalance: `${BASE_URL}/leave-balances/my-balance`,
  leaveBalances: `${BASE_URL}/leave-balances`,
  leaveBalanceByEmployee: (employeeId: string) =>
    `${BASE_URL}/leave-balances/${employeeId}`,
  allocateLeaveBalance: (employeeId: string) =>
    `${BASE_URL}/leave-balances/allocate/${employeeId}`,
  bulkAllocateLeaveBalance: `${BASE_URL}/leave-balances/bulk-allocate`,
  adjustLeaveBalance: (employeeId: string) =>
    `${BASE_URL}/leave-balances/${employeeId}/adjust`,
  expiringLeaveBalances: `${BASE_URL}/leave-balances/expiring`,
  carryOverLeave: `${BASE_URL}/leave-balances/carry-over`,
  notifyExpiringBalances: `${BASE_URL}/leave-balances/notify-expiring`,

  // Leave Applications
  leaveApplications: `${BASE_URL}/leave-applications`,
  leaveApplicationById: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}`,
  myLeaveApplications: `${BASE_URL}/leave-applications/my-applications`,
  pendingLeaveApplications: `${BASE_URL}/leave-applications/pending`,
  cancellableLeaves: `${BASE_URL}/leave-applications/cancellable`,
  onLeaveEmployees: `${BASE_URL}/leave-applications/on-leave`,
  leaveStats: `${BASE_URL}/leave-applications/statistics`,
  leaveReliefOfficers: `${BASE_URL}/leave-applications/relief-officers`,
  approveLeaveApplication: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}/approve`,
  rejectLeaveApplication: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}/reject`,
  cancelLeaveApplication: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}/cancel`,

  // Leave Recall
  leaveRecalls: `${BASE_URL}/leave-recalls`,
  leaveRecallById: (id: string | number) => `${BASE_URL}/leave-recalls/${id}`,
  myLeaveRecalls: `${BASE_URL}/leave-recalls/me`,
  activeLeavesForRecall: `${BASE_URL}/leave-recalls/active-leaves`,
  respondToRecall: (id: string | number) =>
    `${BASE_URL}/leave-recalls/${id}/respond`,

  // Leave Cash-Out
  calculateCashOut: `${BASE_URL}/leave-cash-out/calculate`,
  requestCashOut: `${BASE_URL}/leave-cash-out/request`,
  myCashOutRequests: `${BASE_URL}/leave-cash-out/my-requests`,
  allCashOutRequests: `${BASE_URL}/leave-cash-out`,
  approveCashOut: (id: string | number) =>
    `${BASE_URL}/leave-cash-out/${id}/approve`,
  rejectCashOut: (id: string | number) =>
    `${BASE_URL}/leave-cash-out/${id}/reject`,

  // Public Holidays
  publicHolidays: `${BASE_URL}/public-holidays`,
  publicHolidayById: (id: string | number) =>
    `${BASE_URL}/public-holidays/${id}`,
  upcomingHolidays: `${BASE_URL}/public-holidays/upcoming`,
  seedDefaultHolidays: `${BASE_URL}/public-holidays/seed-defaults`,

  // Leave Settings
  leaveSettings: `${BASE_URL}/leave-settings`,

  // ==========================================
  // Export Management routes
  // ==========================================
  exportFields: (type: string) => `${BASE_URL}/export/fields?type=${type}`,
  exportEmployees: `${BASE_URL}/export/employees`,
  exportEmployments: `${BASE_URL}/export/employments`,
  exportEmployeeProfile: (id: string) => `${BASE_URL}/export/employee/${id}`,

  // ==========================================
  // Career Management routes
  // ==========================================
  careerPromote: `${BASE_URL}/career/promote`,
  careerDemote: `${BASE_URL}/career/demote`,
  careerTransfer: `${BASE_URL}/career/transfer`,
  careerEvents: `${BASE_URL}/career/events`,
  careerEventsByEmployee: (employeeId: string) =>
    `${BASE_URL}/career/events/${employeeId}`,
};

export default apiRoutes;
