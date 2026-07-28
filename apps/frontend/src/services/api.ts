import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('janani_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('janani_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post('/api/v1/auth/refresh', { refreshToken });
          const accessToken = res.data?.accessToken || res.data?.tokens?.accessToken;
          const newRefreshToken = res.data?.refreshToken || res.data?.tokens?.refreshToken;

          if (accessToken) {
            localStorage.setItem('janani_access_token', accessToken);
            if (newRefreshToken) localStorage.setItem('janani_refresh_token', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshErr) {
          console.warn('⚠️ Token refresh failed. Preserving local session state.');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
