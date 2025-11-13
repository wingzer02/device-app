import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Device {
  id?: string;
  serialNumber: string;
  catId?: string;
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
 * 장비 전체 조회
 */
export const fetchDevices = createAsyncThunk(
  "device/fetchDevices",
  async () => {
    const res = await axios.get<Device[]>(API_BASE_URL);
    return res.data;
  }
);

/**
 * 장비 등록
 */
export const addDevice = createAsyncThunk(
  "device/addDevice",
  async (device: Device) => {
    const res = await axios.post(API_BASE_URL, device);
    return res.data;
  }
);

/**
 * 장비 삭제
 */
export const deleteDevice = createAsyncThunk(
  "device/deleteDevice",
  async (serialNumber: string) => {
    const res = await axios.delete(`${API_BASE_URL}/${serialNumber}`);
    return res.data;
  }
);

/**
 * 장비 사용자 등록
 */
export const registerDeviceUser = createAsyncThunk(
  "device/registerDeviceUser",
  async (device: Device) => {
    const res = await axios.post(
      `${API_BASE_URL}/registerDeviceUser`,
      device
    );
    return res.data;
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 장비 전체 조회
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchDevices.rejected, (state) => {
        state.list = [];
      })
  },
});

export default deviceSlice.reducer;
