import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Device {
  id?: string;
  serialNumber: string;
  catId: string;
  catName?: string;
  userid?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
}

interface DeviceState {
  list: Device[];
}

const initialState: DeviceState = {
  list: [],
};

const API_BASE_URL = "http://localhost:8080/api/devices";

/**
 * 장치 전체 조회
 */
export const fetchDevices = createAsyncThunk(
  "device/fetchDevices",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get<Device[]>(API_BASE_URL);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "장치 목록 조회 실패"
      );
    }
  }
);

/**
 * 장치 등록
 */
export const addDevice = createAsyncThunk(
  "device/addDevice",
  async (device: Device, thunkAPI) => {
    try {
      const res = await axios.post(API_BASE_URL, device);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "장치 등록 실패"
      );
    }
  }
);

/**
 * 장치 삭제
 */
export const deleteDevice = createAsyncThunk(
  "device/deleteDevice",
  async (serialNumber: string, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${serialNumber}`);
      return serialNumber;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "장치 삭제 실패"
      );
    }
  }
);

/**
 * 장치 사용자 등록
 */
export const registerDeviceUser = createAsyncThunk(
  "device/registerDeviceUser",
  async (
    device: {
      serialNumber: string;
      category: string;
      userid: string;
      startDate: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/register`,
        device
      );
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        "장치 사용자 등록 실패"
      );
    }
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 장치 전체 조회
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchDevices.rejected, (state) => {
        state.list = [];
      })
  },
});

export default deviceSlice.reducer;
