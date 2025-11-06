import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  userid: string;
  name: string;
  email: string;
}

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  success: boolean;
  isAuthenticated: boolean;
  list: User[];
}

const initialState: UserState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  error: null,
  success: false,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  list: [],
};

const API_BASE_URL = "http://localhost:8080/api/users";

/**
 * 회원가입
 */
export const registerUser = createAsyncThunk(
  "user/register",
  async (
    { 
      userid, 
      password, 
      email, 
      name 
    }: { 
      userid: string; 
      password: string, 
      email: string, 
      name: string 
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        userid,
        password,
        email,
        name,
      });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "회원가입 실패"
      );
    }
  }
);

/**
 * 로그인
 */
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { 
      userid, 
      password 
    }: { 
      userid: string; 
      password: string
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        userid,
        password,
      });
      const data = res.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "로그인 실패"
      );
    }
  }
);

/**
 * Access Token 갱신
 */
export const refreshAccessToken = createAsyncThunk(
  "user/refresh",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await axios.post(`${API_BASE_URL}/refresh`, {
        refreshToken,
      });
      const data = res.data;
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "토큰 갱신 실패"
      );
    }
  }
);

/**
 * 사용자 전체 조회
 */
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll", 
  async () => {
    const res = await axios.get<User[]>(API_BASE_URL);
    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 회원가입
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.error = "회원가입 실패";
      })

      // 로그인
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.success = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.error = "로그인 실패";
      })

      // 토큰 갱신
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.error = "토큰 갱신 실패";
      })

      // 사용자 전체 조회
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.list = [];
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
