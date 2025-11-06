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
  Alert,
} from "@mui/material";

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    userid: "",
    name: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/");
    } else {
      setError("회원가입 중 오류가 발생했습니다.");
    }
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
          회원가입
        </Typography>
        <form onSubmit={handleSubmit}>
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
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          <Button
            fullWidth
            variant="contained"
            color="success"
            type="submit"
            sx={{ mt: 2, py: 1.2 }}
          >
            회원가입
          </Button>
        </form>
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
