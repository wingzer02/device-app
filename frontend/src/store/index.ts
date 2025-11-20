import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import deviceReducer from "./deviceSlice";
import categoryReducer from "./categorySlice";
import roleReducer from "./roleSlice";
import assetReducer from "./assetSlice"
import logReducer from './logSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    device: deviceReducer,
    category: categoryReducer,
    role: roleReducer,
    asset: assetReducer,
    log: logReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
