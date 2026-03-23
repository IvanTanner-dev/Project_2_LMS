import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
// In unit tests, `axios` may be mocked and `create()` may exist but return `undefined`.
// Fall back to the mocked axios object to avoid crashing at import time.
const createdApi =
  typeof axios?.create === "function" ? axios.create({ baseURL }) : undefined;
const api = createdApi && typeof createdApi?.get === "function" ? createdApi : axios;

// Remember to automate the Token injection here later!
if (api?.interceptors?.request?.use) {
  api.interceptors.request.use((config) => {
    // Used internally to avoid infinite loops / invalid-header auth on refresh
    if (config.skipAuthRefresh) return config;

    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

if (api?.interceptors?.response?.use) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;
      const status = error?.response?.status;

      // Only try refresh on auth errors we can recover from.
      if (status !== 401) return Promise.reject(error);
      if (!originalRequest) return Promise.reject(error);
      if (originalRequest._retry) return Promise.reject(error);
      if (originalRequest.skipAuthRefresh) return Promise.reject(error);

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Make refresh call without sending the (possibly expired) access token header.
        const refreshResponse = await axios.post(
          `${baseURL}/api/token/refresh/`,
          { refresh: refreshToken },
          { skipAuthRefresh: true },
        );

        const newAccessToken = refreshResponse.data?.access;
        if (!newAccessToken) throw new Error("No access token returned");

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    },
  );
}

export default api;
