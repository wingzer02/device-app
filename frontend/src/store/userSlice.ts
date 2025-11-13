import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  userid: string;
  name: string;
  email: string;
  password: string;
  photoUrl: string;
  role: string;
  roleName: string;
  delFlg: boolean;
}

interface UserState {
  isAuthenticated: boolean;
  list: User[];
  profile: User;
}

const initialState: UserState = {
  isAuthenticated: false,
  list: [],
  profile: {
    userid: "",
    name: "",
    email: "",
    password: "",
    photoUrl: "",
    role: "",
    roleName: "",
    delFlg: false,
  },
};

const API_BASE_URL = "http://localhost:8080/api/user";
const ERR_MSG_USE_DIFFERENT_ID = " 다른 아이디를 사용해주세요.";

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
      name,
      role 
    }: { 
      userid: string; 
      password: string, 
      email: string, 
      name: string,
      role: string 
    }, { rejectWithValue }    
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        userid,
        password,
        email,
        name,
        role
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message;
        return rejectWithValue(message + ERR_MSG_USE_DIFFERENT_ID);
      } 
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
    }, { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        userid,
        password,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message;
        return rejectWithValue(message);
      } 
    }
  }
);

/**
 * 사용자 전체 조회
 */
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAll", 
  async () => {
    const res = await axios.get<User[]>(API_BASE_URL);
    return res.data;
  }
);

/**
 * 사용자 정보 조회
 */
export const fetchUserByUserid = createAsyncThunk(
  "user/fetchUserByUserid",
  async (userid: string) => {
    const res = await axios.get(`${API_BASE_URL}/${userid}`);
    return res.data;
  }
);

/**
 * 사용자 정보 갱신
 */
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userid, formData }: 
    {
      userid: string;
      formData: FormData;
    }
  ) => {
    const res = await axios.put(`${API_BASE_URL}/${userid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

/**
 * 사용자 탈퇴
 */
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userid: string) => {
    const res = await axios.post(`${API_BASE_URL}/${userid}`);
    return res.data;
  }
);

/**
 * 사용자 권한 갱신
 */
export const updateRole = createAsyncThunk(
  "user/updateRole",
  async ({ userid, role }: 
    { 
      userid: string;
      role: string;
    }
  ) => {
    const res = await axios.post(
      `${API_BASE_URL}/updateRole`, {
      userid,
      role
    });
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
      localStorage.removeItem("userid");
      state.isAuthenticated = false;
      state.profile = { 
        userid: "", 
        name: "", 
        email: "", 
        password: "", 
        photoUrl: "", 
        role: "", 
        roleName: "",
        delFlg: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        const userid = action.meta.arg.userid;
        localStorage.setItem("userid", userid);
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })

      // 사용자 전체 조회
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.list = [];
      })

      .addCase(fetchUserByUserid.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // 사용자 정보 갱신
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
