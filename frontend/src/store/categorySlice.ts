// frontend/src/store/categorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
  catId: string;
  catName: string;
}

interface CategoryState {
  list: Category[];
}

const initialState: CategoryState = {
  list: [],
};

const CATEGORY_API_URL = "http://localhost:8080/api/categories";

/** 카테고리 전체 조회 */
export const fetchCategories = createAsyncThunk (
  "category/fetchCategories",
  async () => {
    const res = await axios.get<Category[]>(CATEGORY_API_URL);
    return res.data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 장치분류 전체 조회
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.list = [];
      })
  },
});

export default categorySlice.reducer;
