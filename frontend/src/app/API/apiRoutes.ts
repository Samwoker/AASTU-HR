const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api/v1';

const apiRoutes = {
  // Define your routes here as you add them
  login: `${BASE_URL}/auth/login`,
  users: `${BASE_URL}/users`,
  employees: `${BASE_URL}/employees`,
  employments: `${BASE_URL}/employments`,
  departments: `${BASE_URL}/department`,
  jobTitles: `${BASE_URL}/job-titles`,
};

export default apiRoutes;
