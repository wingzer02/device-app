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

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AssetPageParams {
  page: number;
  size: number;
  sortKey: string;
  sortDir: string;
}

interface AssetState {
  list: Asset[];
  asset: Asset;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
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
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

/**
 * 자산 전체 조회
 */
export const fetchAssets = createAsyncThunk(
  "asset/fetchAssets",
  async () => {
    const res = await axios.get<Asset[]>(`${API_BASE_URL}/all`);
    return res.data;
  }
);

export const fetchAssetsPage = createAsyncThunk(
  "asset/fetchAssetsPage",
  async (params: AssetPageParams) => {
    const { page = 1, size = 10, sortKey = "", sortDir = "asc" } = params;
    const res = await axios.get<PageResponse<Asset>>(API_BASE_URL, {
      params: { page, size, sortKey, sortDir },
    });
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

      .addCase(fetchAssetsPage.fulfilled, (state, action) => {
        const p = action.payload;
        state.list = p.items;
        state.page = p.page;
        state.size = p.size;
        state.totalElements = p.totalElements;
        state.totalPages = p.totalPages;
        state.hasNext = p.hasNext;
        state.hasPrev = p.hasPrev;
      })
      .addCase(fetchAssetsPage.rejected, (state) => {
        state.list = [];
        state.page = 1;
        state.totalElements = 0;
        state.totalPages = 1;
        state.hasNext = false;
        state.hasPrev = false;
      })

      .addCase(fetchAssetBySerialNumber.fulfilled, (state, action) => {
        state.asset = action.payload;
      })
  },
});

export default assetSlice.reducer;
