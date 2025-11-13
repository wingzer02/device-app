import axios from "axios";
import { logout } from "../store/userSlice";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401) {
      try {
        console.log("roatate token");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token not available.");
        }
        const res = await axios.create().post(
          "/api/user/reissue",
          {},
          {
            baseURL: "http://localhost:8080",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "Content-type": "application/json",
            },
          }
        );

        const newAccessToken = res.data.accessToken.newAccessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalConfig);
        }
      } catch (refreshError) {
        console.error(refreshError);
        localStorage.clear();
        logout();
        return Promise.reject(refreshError);
      }
    }

    localStorage.clear();
    return Promise.reject(error);
  }
);