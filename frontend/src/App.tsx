import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DevicePage from "./pages/DevicePage";
import DeviceUserRegisterPage from "./pages/DeviceUserRegisterPage";
import UserInfoPage from "./pages/UserInfoPage";
import UserListPage from "./pages/UserListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/devices" element={<DevicePage />} />
        <Route path="/devices/reg-dev-user" element={<DeviceUserRegisterPage />} />
        <Route path="/user-info" element={<UserInfoPage />} />
        <Route path="/user-list" element={<UserListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
