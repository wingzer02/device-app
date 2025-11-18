import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DevicePage from "./pages/DevicePage";
import UserInfoPage from "./pages/UserInfoPage";
import UserListPage from "./pages/UserListPage";
import AssetPage from "./pages/AssetPage";
import AssetRegisterPage from "./pages/AssetRegisterPage";
import AssetEditPage from "./pages/AssetEditPage";
import { useAppDispatch } from "./hooks/useApp";
import { checkAuth } from "./store/userSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/devices" element={<DevicePage />} />
        <Route path="/user-info" element={<UserInfoPage />} />
        <Route path="/user-list" element={<UserListPage />} />
        <Route path="/assets" element={<AssetPage />} />
        <Route path="/assets/register" element={<AssetRegisterPage />} />
        <Route path="/assets/:assetSerialNumber/edit" element={<AssetEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
