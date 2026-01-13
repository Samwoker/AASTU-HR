import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Avoid 304 Not Modified responses for XHR/fetch requests (Axios treats 304 as error)
    if ((config.method || "").toLowerCase() === "get") {
      config.params = { ...(config.params || {}), _ts: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if 401 response returned from api
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = '/'; // Optional: Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
