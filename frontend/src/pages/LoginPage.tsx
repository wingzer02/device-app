import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { loginUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
} from "@mui/material";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ userid: "", password: "" });
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/devices");
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <Box
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
        <form onSubmit={handleLogin}>
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
            color="primary"
            type="submit"
            sx={{ mt: 2, py: 1.2 }}
          >
            로그인
          </Button>
        </form>
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
