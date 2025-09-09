import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'https://almino-testing.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any common headers here
  }
});

// Add request interceptors if needed
apiClient.interceptors.request.use(config => {
  // Add auth token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptors if needed
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default apiClient;