import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { registerDeviceUser, fetchDevices } from "../store/deviceSlice";
import { fetchAllUsers, User } from "../store/userSlice";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { 
  DEVICE_USER_REGISTER_COMPLETE, 
  ERR_REGISTER_DATE,
  ERR_REGISTER_USER_NO_SELECTED 
} from "../utils/text"

const DeviceUserRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const device = (location.state as any)?.device || {};
  const users = useAppSelector((s) => s.user.list);

  const [userid, setUserid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 페이지 진입 시 유저 목록 조회
  useEffect(() => {
    dispatch(fetchAllUsers());

    if (device.userid) {
      setUserid(device.userid);
    }
    if (device.startDate) {
      const sd = String(device.startDate).slice(0, 10);
      setStartDate(sd);
    }
    if (device.endDate) {
      const ed = String(device.endDate).slice(0, 10);
      setEndDate(ed);
    }
  }, [dispatch, device.userid, device.startDate, device.endDate]);

  const handleRegister = async () => {
    if (!userid) {
      alert(ERR_REGISTER_USER_NO_SELECTED);
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      alert(ERR_REGISTER_DATE);
      return;
    }

    await dispatch(
      registerDeviceUser({
        serialNumber: device.serialNumber,
        userid,
        startDate,
        endDate,
      })
    ).unwrap();

    alert(DEVICE_USER_REGISTER_COMPLETE);
    dispatch(fetchDevices());
    navigate("/devices");
  };

  const handleCancel = () => {
    navigate("/devices");
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h6" gutterBottom>
          장비 사용자 등록
        </Typography>
        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Typography variant="body1" color="text.secondary" sx={{ width: 104 }}>
              일련번호
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "1.125rem" }}>
              {device.serialNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Typography variant="body1" color="text.secondary" sx={{ width: 104 }}>
                분류
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "1.125rem" }}>
              {device.catName}
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={2.5}>
          <TextField
            select
            label="사용자"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            fullWidth
          >
            <MenuItem value="">선택</MenuItem>
              {users
                .filter((u: User) => !u.delFlg)
                .map((u: User) => (
                <MenuItem key={u.userid} value={u.userid}>
                  {u.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="시작일"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="종료일"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" onClick={handleRegister}>
            등록
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeviceUserRegisterPage;
