import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { Asset, fetchAssets, fetchAssetBySerialNumber, updateAsset } from "../store/assetSlice";
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
import { Device, fetchDevices } from "../store/deviceSlice";
import { fetchAllUsers, User } from "../store/userSlice";

const locationOptions = ["A city", "B city", "C city", "D city"];

const AssetEditPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { assetSerialNumber } = useParams<{ assetSerialNumber: string }>();

  const asset = useAppSelector((state) => state.asset.asset);
  const devices = useAppSelector((state) => state.device.list);
  const assets = useAppSelector((state) => state.asset.list);
  const users = useAppSelector((state) => state.user.list);

  const [assetName, setAssetName] = useState("");
  const [deviceSerialNumber, setDeviceSerialNumber] = useState("");
  const [userid, setUserid] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchDevices());
    dispatch(fetchAssets());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!assetSerialNumber) return;
    dispatch(fetchAssetBySerialNumber(assetSerialNumber));
  }, [dispatch, assetSerialNumber]);

  useEffect(() => {
    if (!asset || asset.assetSerialNumber !== assetSerialNumber) return;
    setAssetName(asset.assetName);
    setDeviceSerialNumber(asset.deviceSerialNumber);
    setUserid(asset.userid ?? "");
    setLocation(asset.location);
    setStartDate(asset.startDate ?? "");
    setEndDate(asset.endDate ?? "");
  }, [asset, assetSerialNumber]);

  const handleCancel = () => {
    navigate("/assets");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && startDate > endDate) {
      alert(ERR_REGISTER_DATE);
      return;
    }

    const params: Asset = {
      ...asset,
      assetName,
      deviceSerialNumber,
      userid,
      location,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    await dispatch(updateAsset(params));
    await dispatch(fetchAssets());
    alert("자산 정보가 수정되었습니다.");
    navigate("/assets");
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSave}
      sx={{ maxWidth: 600, mx: "auto", mt: 6 }}
    >
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h6" gutterBottom>
          자산 수정
        </Typography>

        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              관리코드
            </Typography>
            <Typography variant="body1">
              {asset.assetSerialNumber}
            </Typography>
          </Box>
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
              .filter((d: Device) => {
                // 기존에 선택된 장비는 제외하지 않음
                if (d.serialNumber === asset.deviceSerialNumber) {
                  return true
                }
                // 다른 자산에서 선택된 장비는 제외
                return !assets.some(
                  (a: Asset) =>
                    a.assetSerialNumber !== assetSerialNumber &&
                    a.deviceSerialNumber === d.serialNumber
                );
              })
              .map((d: Device) => (
                <MenuItem key={d.serialNumber} value={d.serialNumber}>
                  {d.serialNumber + " - " + d.deviceName}
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
            label="사용 시작일"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <TextField
            label="사용 종료일"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
        </Stack>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            저장
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AssetEditPage;
