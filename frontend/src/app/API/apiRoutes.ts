const RAW_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

if (!RAW_BASE_URL) {
  throw new Error(
    "Missing API base URL. Set VITE_API_URL (recommended) or VITE_BASE_URL in frontend/.env (example: VITE_API_URL=http://localhost:5000/api/v1)."
  );
}

const BASE_URL = String(RAW_BASE_URL).replace(/\/+$/, "");

export const SERVER_URL = BASE_URL.replace(/\/api\/v1\/?$/, "");

const apiRoutes = {
  // Define your routes here as you add them
  auth: `${BASE_URL}/auth`,
  login: `${BASE_URL}/auth/login`,
  // Auth helpers used by authSaga
  me: `${BASE_URL}/users/me`,
  forgotPassword: `${BASE_URL}/auth/forgotPassword`,
  resetPassword: `${BASE_URL}/auth/resetPassword/:token`,
  updateMyPassword: `${BASE_URL}/auth/updateMyPassword`,
  activateAccount: (token: string) =>
    `${BASE_URL}/auth/activate-account/${token}`,
  users: `${BASE_URL}/users`,
  employees: `${BASE_URL}/employees`,
  employeeDetail: (id: string) => `${BASE_URL}/employees/${id}/detail`,
  employments: `${BASE_URL}/employments`,
  promote: `${BASE_URL}/employments/promote`, // Updated v2
  departments: `${BASE_URL}/departments`,
  jobTitles: `${BASE_URL}/job-titles`,
  employeesCount: `${BASE_URL}/employments/count`,
  departmentsCount: `${BASE_URL}/departments/count`,
  activeEmploymentsCount: `${BASE_URL}/employments/count/active`,
  inactiveEmploymentsCount: `${BASE_URL}/employments/count/inactive`,
  managersCount: `${BASE_URL}/employments/count/managers`,
  genderDist: `${BASE_URL}/employments/gender-dist`,
  empTypeDist: `${BASE_URL}/employments/emp-type-dist`,
  deptDist: `${BASE_URL}/employments/dept-dist`,
  jobLevelDist: `${BASE_URL}/employments/job-dist`,
  managerDist: `${BASE_URL}/employments/manager-dist`,
  onboarding: `${BASE_URL}/onboarding`,
  onboardingStatus: `${BASE_URL}/onboarding/status`,
  onboardingPersonalInfo: `${BASE_URL}/onboarding/personal-info`,
  onboardingContactInfo: `${BASE_URL}/onboarding/contact-info`,
  onboardingEducation: `${BASE_URL}/onboarding/education`,
  onboardingWorkExperience: `${BASE_URL}/onboarding/work-experience`,
  onboardingCertifications: `${BASE_URL}/onboarding/certifications`,
  onboardingDocuments: `${BASE_URL}/onboarding/documents`,
  approveOnboarding: (id: string) =>
    `${BASE_URL}/employees/${id}/approve-onboarding`,
  activate: (id: string) => `${BASE_URL}/employees/${id}/activate`,
  // Granular Updates
  updatePersonal: (id: string) =>
    `${BASE_URL}/employees/${id}/personal-details`,
  updateFinancial: (id: string) =>
    `${BASE_URL}/employees/${id}/financial-details`,
  updateEmployment: (id: string) =>
    `${BASE_URL}/employees/${id}/employment-details`,
  updateContact: (id: string) => `${BASE_URL}/employees/${id}/contact-info`,
  updateAddresses: (id: string) => `${BASE_URL}/employees/${id}/addresses`,
  updatePhones: (id: string) => `${BASE_URL}/employees/${id}/phones`,
  updateEducation: (id: string) =>
    `${BASE_URL}/employees/${id}/education-details`,
  updateWorkExperience: (id: string) =>
    `${BASE_URL}/employees/${id}/work-experience-details`,
  updateCertifications: (id: string) =>
    `${BASE_URL}/employees/${id}/certifications-details`,
  updateDocuments: (id: string) =>
    `${BASE_URL}/employees/${id}/documents-details`,

  suggestions: {
    departments: `${BASE_URL}/suggestions/departments`,
    jobTitles: `${BASE_URL}/suggestions/job-titles`,
    jobLevels: `${BASE_URL}/suggestions/job-levels`,
    fieldsOfStudy: `${BASE_URL}/suggestions/fields-of-study`,
    institutions: `${BASE_URL}/suggestions/institutions`,
  },
  upload: `${BASE_URL}/upload`,
  exportEmployees: `${BASE_URL}/export/employees`,
  assignManagers: {
    search: `${BASE_URL}/assign-managers/search`,
    bulkAssign: `${BASE_URL}/assign-managers/bulk-assign`,
    existingManagers: `${BASE_URL}/assign-managers/existing-managers`,
    removeMember: `${BASE_URL}/assign-managers/remove-member`,
    teamMembers: (id: string) =>
      `${BASE_URL}/assign-managers/${id}/team-members`,
  },
  analytics: {
    advancedStats: `${BASE_URL}/analytics/advanced-stats`,
  },
  experienceLetter: (id: string) => `${BASE_URL}/experience-letter/${id}`,
  certificateOfService: (id: string) =>
    `${BASE_URL}/certificate-of-service/${id}`,

  // Leave Management
  leaveTypes: `${BASE_URL}/leave-types`,
  leaveTypeById: (id: string | number) => `${BASE_URL}/leave-types/${id}`,
  applicableLeaveTypes: `${BASE_URL}/leave-types/applicable`,
  seedLeaveTypes: `${BASE_URL}/leave-types/seed-defaults`,
  seedDefaultLeaveTypes: `${BASE_URL}/leave-types/seed-defaults`,
  leaveBalances: `${BASE_URL}/leave-balances`,
  leaveBalanceByEmployee: (employeeId: string) =>
    `${BASE_URL}/leave-balances/employee/${employeeId}`,
  myLeaveBalance: `${BASE_URL}/leave-balances/me`,
  adjustLeaveBalance: (id: string) => `${BASE_URL}/leave-balances/${id}/adjust`,
  allocateLeaveBalance: (employeeId: string) =>
    `${BASE_URL}/leave-balances/allocate/${employeeId}`,
  bulkAllocateLeaveBalance: `${BASE_URL}/leave-balances/bulk-allocate`,
  expiringLeaveBalances: `${BASE_URL}/leave-balances/expiring`,
  notifyExpiringBalances: `${BASE_URL}/leave-balances/notify-expiring`,
  carryOverLeave: `${BASE_URL}/leave-balances/carry-over`,
  leaveApplications: `${BASE_URL}/leave-applications`,
  leaveApplicationById: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}`,
  myLeaveApplications: `${BASE_URL}/leave-applications/me`,
  leaveApplicationsMe: `${BASE_URL}/leave-applications/me`,
  pendingLeaveApplications: `${BASE_URL}/leave-applications/pending`,
  leaveApplicationsPending: `${BASE_URL}/leave-applications/pending`,
  onLeaveEmployees: `${BASE_URL}/leave-applications/on-leave`,
  leaveApplicationsOnLeave: `${BASE_URL}/leave-applications/on-leave`,
  leaveApplicationsStats: `${BASE_URL}/leave-applications/stats`,
  cancellableLeaves: `${BASE_URL}/leave-applications/cancellable`,
  approveLeaveApplication: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}/approve`,
  rejectLeaveApplication: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}/reject`,
  cancelLeaveApplication: (id: string | number) =>
    `${BASE_URL}/leave-applications/${id}/cancel`,
  leaveRecalls: `${BASE_URL}/leave-recalls`,
  leaveRecallById: (id: string | number) => `${BASE_URL}/leave-recalls/${id}`,
  myLeaveRecalls: `${BASE_URL}/leave-recalls/me`,
  activeLeavesForRecall: `${BASE_URL}/leave-recalls/active-leaves`,
  respondToRecall: (id: string) => `${BASE_URL}/leave-recalls/${id}/respond`,
  leaveReliefOfficers: `${BASE_URL}/leave-applications/relief-officers`,
  leaveStats: `${BASE_URL}/leave-applications/statistics`,
  leaveSettings: `${BASE_URL}/leave-settings`,

  // Leave Cash-Out
  calculateCashOut: `${BASE_URL}/leave-cash-out/calculate`,
  requestCashOut: `${BASE_URL}/leave-cash-out/request`,
  myCashOutRequests: `${BASE_URL}/leave-cash-out/my-requests`,
  allCashOutRequests: `${BASE_URL}/leave-cash-out`,
  approveCashOut: (id: string) => `${BASE_URL}/leave-cash-out/${id}/approve`,
  rejectCashOut: (id: string) => `${BASE_URL}/leave-cash-out/${id}/reject`,

  // Public Holidays
  publicHolidays: `${BASE_URL}/public-holidays`,
  publicHolidayById: (id: string | number) =>
    `${BASE_URL}/public-holidays/${id}`,
  seedDefaultHolidays: `${BASE_URL}/public-holidays/seed-defaults`,
  upcomingHolidays: `${BASE_URL}/public-holidays/upcoming`,
};

export default apiRoutes;
