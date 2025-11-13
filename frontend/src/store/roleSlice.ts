import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Role {
  roleId: string;
  roleName: string;
}

interface RoleState {
  list: Role[];
}

const initialState: RoleState = {
  list: [],
};

const ROLE_API_URL = "http://localhost:8080/api/roles";

/**
 * 권한 전체 조회
 */
export const fetchRoles = createAsyncThunk (
  "role/fetchRoles",
  async () => {
    const res = await axios.get<Role[]>(ROLE_API_URL);
    return res.data;
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 권한 전체 조회
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.list = [];
      })
  },
});

export default roleSlice.reducer;
