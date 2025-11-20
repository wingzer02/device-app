import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Device {
  id?: string;
  serialNumber: string;
  catId?: string;
  catName?: string;
  deviceName?: string;
  company?: string | null;
  purchaseDate?: string;
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
  async (serialNumber: string, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${serialNumber}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        const message = error.response?.data?.message;
        return rejectWithValue(
          "해당 장비는 관리코드 " 
          + message + 
          " 의 자산으로 등록 되어 있어 삭제할 수 없습니다.");
      }
    }
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
