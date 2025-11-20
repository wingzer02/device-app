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
  adminRequestFlg: boolean;
}

interface UserState {
  isAuthenticated: boolean;
  list: User[];
  listAdminPage: User[];
  profile: User;
  status: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  list: [],
  listAdminPage: [],
  profile: {
    userid: "",
    name: "",
    email: "",
    password: "",
    photoUrl: "",
    role: "",
    roleName: "",
    delFlg: false,
    adminRequestFlg: false,
  },
  status: "none",
};

const API_BASE_URL = "http://localhost:8080/api/user";

/**
 * 현재 로그인 상태 체크
 */
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<User>(`${API_BASE_URL}/me`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          return rejectWithValue("unauthorized");
        }
      }
      return rejectWithValue("error");
    }
  }
);

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
        const message = error.response?.data?.message;
        return rejectWithValue(message);
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
        const message = error.response?.data?.message;
        return rejectWithValue(message);
      } 
    }
  }
);

/**
 * 로그아웃
 */
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue("로그아웃 실패");
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

export const fetchAllUsersAdminPage = createAsyncThunk(
  "user/fetchAllUsersAdminPage", 
  async () => {
    const res = await axios.get<User[]>(`${API_BASE_URL}/admin`);
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
      `${API_BASE_URL}/update-role`, {
      userid,
      role
    });
    return res.data;
  }
);

/**
 * 관리자 권한 신청
 */
export const requestAdmin = createAsyncThunk(
  "user/requestAdmin",
  async (userid: string) => {
    const res = await axios.post(`${API_BASE_URL}/request-admin/${userid}`);
    return res.data;
  }
);

/**
 * 관리자 신청 승인
 */
export const approveAdmin = createAsyncThunk(
  "user/approveAdmin",
  async (userid: string) => {
    const res = await axios.post(`${API_BASE_URL}/approve-admin/${userid}`);
    return res.data;
  }
);

/**
 * 관리자 신청 취소
 */
export const cancelAdmin = createAsyncThunk(
  "user/cancelAdmin",
  async (userid: string) => {
    const res = await axios.post(`${API_BASE_URL}/cancel-admin/${userid}`);
    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
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
        adminRequestFlg: false,
      };
      state.status = "none";
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(loginUser.fulfilled, (state) => {
        state.isAuthenticated = true;
      })

      // 로그아웃
      .addCase(logoutUser.fulfilled, (state) => {
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
          adminRequestFlg: false,
        };
      })

      // 로그인 체크
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.profile = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "failed";
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
          adminRequestFlg: false,
        };
      })

      // 사용자 전체 조회
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.list = [];
      })

      .addCase(fetchAllUsersAdminPage.fulfilled, (state, action) => {
        state.listAdminPage = action.payload;
      })
      .addCase(fetchAllUsersAdminPage.rejected, (state) => {
        state.listAdminPage = [];
      })

      .addCase(fetchUserByUserid.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // 사용자 정보 갱신
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.profile.adminRequestFlg = true;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
