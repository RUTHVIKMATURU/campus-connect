import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the entire response.data instead of response.data.data
    return response.data;
  },
  (error) => {
    if (!error.response) {
      if (!navigator.onLine) {
        return Promise.reject(new Error('Please check your internet connection'));
      }
      return Promise.reject(new Error('Unable to reach the server. Please try again later.'));
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }

    // Return error message from server if available
    const errorMessage = error.response.data?.error || error.response.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;



