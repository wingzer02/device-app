import React, { useState } from "react";
import { useAppDispatch } from "../hooks/useApp";
import { loginUser, checkAuth } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ userid: "", password: "" });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await dispatch(loginUser(form)).unwrap();
      await dispatch(checkAuth()).unwrap();
      navigate("/assets")
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <Box 
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          로그인
        </Typography>
          <TextField
            fullWidth
            label="아이디"
            variant="outlined"
            margin="normal"
            value={form.userid}
            onChange={(e) => setForm({ ...form, userid: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            variant="outlined"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, py: 1.2 }}
          >
            로그인
          </Button>
        <Typography textAlign="center" sx={{ mt: 2 }}>
          아직 계정이 없으신가요?{" "}
          <Link
            component="button"
            onClick={() => navigate("/register")}
            underline="hover"
          >
            회원가입
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
