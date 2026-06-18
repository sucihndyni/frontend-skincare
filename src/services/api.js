import axios from 'axios';

// Gunakan env VITE_API_URL jika tersedia, atau fallback ke backend Railway /api.
const envApiBaseUrl = import.meta.env.VITE_API_URL || 'https://focused-victory-production-0fa6.up.railway.app/api';
const envBaseUrl = import.meta.env.VITE_BASE_URL || 'https://focused-victory-production-0fa6.up.railway.app';
export const API_BASE_URL = envApiBaseUrl.replace(/\/+$/, '');
export const BASE_URL = envBaseUrl.replace(/\/+$/, '');
export const API_URL = API_BASE_URL;

// 2. Buat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor: selalu pasang token terbaru
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 4. Response Interceptor: menangani token expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refresh_token', response.data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          handleLogoutLocal(); // Bersihkan jika refresh gagal
          return Promise.reject(refreshError);
        }
      } else {
        handleLogoutLocal();
      }
    }
    return Promise.reject(error);
  }
);

// 5. Fungsi Logout (Backend & Local)
export const logout = async () => {
  try {
    await api.post('/logout'); // Memanggil endpoint logout di Laravel
  } catch (error) {
    console.error("Gagal logout di server", error);
  } finally {
    handleLogoutLocal();
  }
};

// Helper untuk membersihkan storage
const handleLogoutLocal = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export default api;