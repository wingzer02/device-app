import axios from "axios";
import { store } from "../store";
import { logout } from "../store/userSlice";
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const USER_API_BASE = "http://localhost:8080/api/user";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalConfig = (error.config || {}) as RetryableRequestConfig;
    const status = error.response?.status;
    const url: string = originalConfig.url || "";

    // 인증 관련 API 인지 여부
    const isAuthUrl =
      url.includes("/api/user/login") ||
      url.includes("/api/user/reissue") ||
      url.includes("/api/user/logout");

    // 이미 한 번 재시도했다면 더 이상 처리하지 않음
    if (originalConfig._retry) {
      return Promise.reject(error);
    }

    // 1) 일반 API 에서 401 이 뜨면 → 토큰 재발급 1회 시도
    if (status === 401 && !isAuthUrl) {
      originalConfig._retry = true;

      try {
        // refreshToken 으로 accessToken 재발급 시도
        await axios.post(
          `${USER_API_BASE}/reissue`,
          {},
          { withCredentials: true }
        );

        // 재발급 성공 → 원래 요청 다시 시도
        return axios({
          ...originalConfig,
          withCredentials: true,
        });
      } catch (refreshError) {
        // 재발급 실패 → 추가 HTTP 호출 없이 클라이언트만 로그아웃
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 || status === 403) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);
