import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/assets";

export interface Asset {
  assetSerialNumber: string;
  assetName: string;
  location: string;
  userIds?: string[];
  userNames?: string[];
  deviceSerialNumber: string;
  deviceName: string;
  startDate?: string;
  endDate?: string;
}

interface AssetState {
  list: Asset[];
  asset: Asset;
}

const initialState: AssetState = {
  list: [],
  asset: {
    assetSerialNumber: "",
    assetName: "",
    location: "",
    userIds: [""],
    userNames: [""],
    deviceSerialNumber: "",
    deviceName: "",
    startDate: "",
    endDate: "",
  },
};

/**
 * 자산 전체 조회
 */
export const fetchAssets = createAsyncThunk(
  "asset/fetchAssets",
  async () => {
    const res = await axios.get<Asset[]>(API_BASE_URL);
    return res.data;
  }
);

/**
 * 자산 단건 조회
 */
export const fetchAssetBySerialNumber = createAsyncThunk(
  "asset/fetchAssetBySerialNumber",
  async (assetSerialNumber: string) => {
    const res = await axios.get<Asset>(`${API_BASE_URL}/${assetSerialNumber}`);
    return res.data;
  }
);

/**
 * 자산 등록
 */
export const addAsset = createAsyncThunk(
  "asset/addAsset",
  async (asset: Asset) => {
    const res = await axios.post(API_BASE_URL, asset);
    return res.data;
  }
);

/**
 * 자산 수정
 */
export const updateAsset = createAsyncThunk(
  "asset/updateAsset",
  async (asset: Asset) => {
    await axios.put(`${API_BASE_URL}/${asset.assetSerialNumber}`, asset);
    return asset;
  }
);

/**
 * 자산 삭제
 */
export const deleteAsset = createAsyncThunk(
  "asset/deleteAsset",
  async (assetSerialNumber: string) => {
    await axios.delete(`${API_BASE_URL}/${assetSerialNumber}`);
    return assetSerialNumber;
  }
);

const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchAssets.rejected, (state) => {
        state.list = [];
      })

      .addCase(fetchAssetBySerialNumber.fulfilled, (state, action) => {
        state.asset = action.payload;
      })
  },
});

export default assetSlice.reducer;
