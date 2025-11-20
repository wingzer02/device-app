import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/logs";

export interface Log {
  assetSerialNumber: string;
  assetName: string;
  deviceSerialNumber: string;
  deviceName: string;
  cpuUsage: number | string;
  memoryUsage: number | string;
  diskUsage: number | string;
  checkDate: string;
}

interface LogState {
  list: Log[];
  log: Log;
}

const initialState: LogState = {
  list: [],
  log: {
    assetSerialNumber: "",
    assetName: "",
    deviceSerialNumber: "",
    deviceName: "",
    cpuUsage: "",
    memoryUsage: "",
    diskUsage: "",
    checkDate: "",
  },
};

export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async () => {
    const res = await axios.get<Log[]>(API_BASE_URL);
    return res.data;
  }
);

/**
 * 단건 조회 (수정 화면용)
 */
export const fetchLogByAssetSerialNumber = createAsyncThunk(
  "log/fetchLogByAssetSerialNumber",
  async (assetSerialNumber: string) => {
    const res = await axios.get<Log>(`${API_BASE_URL}/${assetSerialNumber}`);
    return res.data;
  }
);

/**
 * 로그 수정
 */
export const updateLog = createAsyncThunk(
  "log/updateLog",
  async (log: Log) => {
    await axios.put(`${API_BASE_URL}/${log.assetSerialNumber}`, log);
    return log;
  }
);

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchLogs.rejected, (state) => {
        state.list = [];
      })
      .addCase(fetchLogByAssetSerialNumber.fulfilled, (state, action) => {
        state.log = action.payload;
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        state.log = action.payload;
        const idx = state.list.findIndex(
          (l) => l.assetSerialNumber === action.payload.assetSerialNumber
        );
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      });
  },
});

export default logSlice.reducer;
