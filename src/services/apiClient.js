// import axios from 'axios';

// const apiClient = axios.create({
//   // baseURL: 'http://localhost:3000/api',
//   baseURL: 'https://almino-testing.onrender.com/api',
//   timeout: 60*60*10000,
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any common headers here
//   }
// });

// // Add request interceptors if needed
// apiClient.interceptors.request.use(config => {
//   // Add auth token if exists
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Add response interceptors if needed
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;






import axios from "axios";

// Create Axios instance
const apiClient = axios.create({
  baseURL: "https://almino-testing.onrender.com/api",
  timeout: 60 * 60 * 1000, // 1 hour in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // or cookie
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh token if 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if token expired (401) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const refreshResponse = await axios.post(
          "https://almino-testing.onrender.com/api/refresh-token",
          { refreshToken: localStorage.getItem("refreshToken") }
        );

        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Update original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed: redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
