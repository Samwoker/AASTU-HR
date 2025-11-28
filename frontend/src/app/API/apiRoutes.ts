const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api/v1';

const apiRoutes = {
  // Define your routes here as you add them
  login: `${BASE_URL}/auth/login`,
  users: `${BASE_URL}/users`,
  employees: `${BASE_URL}/employees`,
};

export default apiRoutes;
