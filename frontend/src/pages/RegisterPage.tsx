import React, { useState } from "react";
import { useAppDispatch } from "../hooks/useApp";
import { registerUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { REGISTER_COMPLETE } from "../utils/text"

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    userid: "",
    name: "",
    password: "",
    email: "",
    role: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      alert(REGISTER_COMPLETE);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
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
          회원가입
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
            label="이름"
            variant="outlined"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="이메일"
            type="email"
            variant="outlined"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            color="success"
            type="submit"
            sx={{ mt: 2, py: 1.2 }}
          >
            회원가입
          </Button>
        <Typography textAlign="center" sx={{ mt: 2 }}>
          이미 계정이 있으신가요?{" "}
          <Link
            component="button"
            onClick={() => navigate("/")}
            underline="hover"
          >
            로그인
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
