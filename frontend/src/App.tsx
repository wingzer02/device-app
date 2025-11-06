import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DevicePage from "./pages/DevicePage";
import DeviceUserRegisterPage from "./pages/DeviceUserRegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/devices" element={<DevicePage />} />
        <Route path="/devices/register" element={<DeviceUserRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
