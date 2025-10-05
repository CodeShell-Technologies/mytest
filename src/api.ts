// // src/api.ts
// import axios from "axios";

// // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
// const BASE_URL = process.env.REACT_APP_API_URL || "https://almino-testing.onrender.com/api";

// // keep a global controller reference
// let controller: AbortController | null = null;

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000, // auto fail after 15s if server hangs
// });

// // Request interceptor → attach token + cancel old request
// api.interceptors.request.use((config) => {
//   // cancel previous pending request if exists
//   if (controller) controller.abort();
//   controller = new AbortController();
//   config.signal = controller.signal;

//   // attach token
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor → handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Handle timeout
//     if (error.code === "ECONNABORTED") {
//       console.error("⏳ Request timed out:", originalRequest.url);
//       return Promise.reject(new Error("Request timed out"));
//     }

//     // Handle invalid token → refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = localStorage.getItem("refresh_token");
//         if (!refreshToken) throw new Error("No refresh token");

//         // Refresh request
//         const res = await axios.post(`${BASE_URL}/auth/refresh`, {
//           refresh_token: refreshToken,
//         });

//         const newAccessToken = res.data.access_token;
//         localStorage.setItem("access_token", newAccessToken);

//         // retry original with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         // refresh failed → force logout
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



// src/api.ts
import axios from "axios";

const BASE_URL =  "https://almino-testing.onrender.com/api";

// create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout
});

// Request interceptor → attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Timeout handling
    if (error.code === "ECONNABORTED") {
      console.error("⏳ Request timed out:", originalRequest.url);
      return Promise.reject(new Error("Request timed out"));
    }

    // Refresh token if 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        console.error("Refresh token failed:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
