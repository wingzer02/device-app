import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Stack
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fetchUserByUserid, updateUser, requestAdmin } from "../store/userSlice";
import { toUploadsUrl } from "../utils/url";

const UserInfoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { profile, status } = useAppSelector((s) => s.user);
  const objectUrlRef = useRef<string | null>(null);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!profile.userid || status !== "succeeded") return;
    dispatch(fetchUserByUserid(profile.userid));
  }, [dispatch, profile.userid, status]);

  useEffect(() => {
    setEmail(profile.email);
    setPassword("");
  }, [profile.email]);

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    // 미리보기
    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    setPreview(url);
  };

  // 변경 버튼 클릭
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      email,
      password,
      photoUrl: profile.photoUrl,
    };

    const fd = new FormData();
    fd.append("user", new Blob([JSON.stringify(params)], { type: "application/json" }));
    // 새 파일을 선택했을 때만 file 추가
    if (file) {
      fd.append("file", file);
    }

    await dispatch(updateUser({ userid: profile.userid, formData: fd }));

    navigate("/devices");
  };

  const handleRequestAdmin = async () => {
    if (!window.confirm("관리자 승인을 신청하시겠습니까?")) return;
    await dispatch(requestAdmin(profile.userid));
    alert("관리자 승인 신청이 완료되었습니다.");
    dispatch(fetchUserByUserid(profile.userid));
  }

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 560, mx: "auto", mt: 6 }}
    >
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h6" gutterBottom>
          회원 정보
        </Typography>
        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Typography variant="body1" color="text.secondary" sx={{ width: 104 }}>
              아이디
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "1.125rem" }}>
              {profile.userid}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Typography variant="body1" color="text.secondary" sx={{ width: 104 }}>
                이름
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "1.125rem" }}>
              {profile.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Typography variant="body1" color="text.secondary" sx={{ width: 104 }}>
              권한
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontSize: "1.125rem" }}>
                {profile.roleName}
              </Typography>

              {profile.role === "normal" && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleRequestAdmin}
                  disabled={profile.adminRequestFlg}
                >
                  {profile.adminRequestFlg ? "승인 대기중" : "관리자신청"}
                </Button>
              )}
            </Box>
          </Box>
        </Stack>
        <Stack spacing={2.5}>
          <TextField
            fullWidth 
            type={showPassword ? "text" : "password"}
            label="패스워드" 
            margin="normal"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="email" 
            label="이메일" 
            margin="normal"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Stack>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 1,
          mb: 2, 
          alignItems: "center" 
        }}>
          <img
            src={preview || toUploadsUrl(profile.photoUrl) || "/no-photo.jpg"}
            alt="profile"
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%" }}
          />
          <Button variant="outlined" component="label">
            사진 선택
            <input 
              type="file" 
              accept="image/jpeg,image/png,.jpg,.jpeg,.png" 
              hidden 
              onChange={handleImgChange} 
            />
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" type="submit">변경</Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>취소</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserInfoPage;