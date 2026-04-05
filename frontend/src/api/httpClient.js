import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('carpooling_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'A aparut o eroare neasteptata. Incearca din nou.';

    return Promise.reject(new Error(message));
  }
);
