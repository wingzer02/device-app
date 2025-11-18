import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { Asset, addAsset, fetchAssets } from "../store/assetSlice";
import { Device, fetchDevices } from "../store/deviceSlice";
import { User, fetchAllUsers } from "../store/userSlice";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { ERR_REGISTER_DATE } from "../utils/text";

const locationOptions = ["서울", "대전", "대구", "부산"];

const AssetRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const devices = useAppSelector((state) => state.device.list);
  const users = useAppSelector((state) => state.user.list);
  const assets = useAppSelector((state) => state.asset.list);

  const [assetSerialNumber, setAssetSerialNumber] = useState("");
  const [assetName, setAssetName] = useState("");
  const [location, setLocation] = useState("");
  const [deviceSerialNumber, setDeviceSerialNumber] = useState("");
  const [userid, setUserid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchDevices());
    dispatch(fetchAllUsers());
    dispatch(fetchAssets());
  }, [dispatch]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (startDate && endDate && startDate > endDate) {
      alert(ERR_REGISTER_DATE);
      return;
    }

    const selectedUser = users.find((u: User) => u.userid === userid);

    const newAsset: Asset = {
      assetSerialNumber,
      assetName,
      location,
      userid,
      userName: selectedUser?.name ?? "",
      deviceSerialNumber,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    await dispatch(addAsset(newAsset)).unwrap();
    alert("자산 등록이 완료되었습니다.");
    await dispatch(fetchAssets());
    navigate("/assets");
  };

  const handleCancel = () => {
    navigate("/assets");
  };

  return (
    <Box 
      component="form"
      onSubmit={handleRegister} 
      sx={{ maxWidth: 600, mx: "auto", mt: 6 }}
    >
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h6" gutterBottom>
          자산 등록
        </Typography>

        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <TextField
            label="관리코드"
            value={assetSerialNumber}
            onChange={(e) => setAssetSerialNumber(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="자산명"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            select
            label="설치장소"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">선택</MenuItem>
            {locationOptions.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="장비일련번호"
            value={deviceSerialNumber}
            onChange={(e) => setDeviceSerialNumber(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">선택</MenuItem>
            {devices
              .filter(
                (d: Device) =>
                  !assets.some(
                    (a: Asset) => a.deviceSerialNumber === d.serialNumber
                  )
              )
              .map((d: Device) => (
                <MenuItem key={d.serialNumber} value={d.serialNumber}>
                  {d.serialNumber}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            label="사용자명"
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
            label="사용시작일"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="사용종료일"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            등록
          </Button>
          <Button variant="outlined" type="button" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AssetRegisterPage;
