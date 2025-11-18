import axios from "axios";
import { store } from "../store";
import { logout } from "../store/userSlice";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    const isReissue = originalConfig?.url?.includes('/api/user/reissue');
    if ((error.response?.status === 401 
      || error.response?.status === 403) 
      && !originalConfig._retry 
      && !isReissue) {
      originalConfig._retry = true;

      try {
        await axios.create().post(
          "http://localhost:8080/api/user/reissue",
          {},
          { withCredentials: true }          
        );

        return axios({
          ...originalConfig,
          withCredentials: true,
        })
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    store.dispatch(logout());
    return Promise.reject(error);
  }
);