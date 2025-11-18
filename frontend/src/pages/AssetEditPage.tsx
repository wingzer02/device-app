import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { Asset, fetchAssets, updateAsset } from "../store/assetSlice";
import { fetchDevices } from "../store/deviceSlice";
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

const AssetEditPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { assetSerialNumber } = useParams<{ assetSerialNumber: string }>();

  const assets = useAppSelector((state) => state.asset.list);
  const devices = useAppSelector((state) => state.device.list);

  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const targetAsset: any = assets.find(
    (a: Asset) => a.assetSerialNumber === assetSerialNumber
  );

  useEffect(() => {
    if (!assets.length) {
      dispatch(fetchAssets());
    }
    if (!devices.length) {
      dispatch(fetchDevices());
    }
  }, [assets.length, devices.length, dispatch]);

  useEffect(() => {
    if (!targetAsset) return;

    setLocation(targetAsset.location ?? "");
    setStartDate(targetAsset.startDate ?? "");
    setEndDate(targetAsset.endDate ?? "");
  }, [targetAsset]);

  const handleCancel = () => {
    navigate("/assets");
  };

  const handleSave = async () => {
    if (startDate && endDate && startDate > endDate) {
      alert(ERR_REGISTER_DATE);
      return;
    }

    const params: Asset = {
      ...targetAsset,
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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
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
              {targetAsset.assetSerialNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              자산명
            </Typography>
            <Typography variant="body1">{targetAsset.assetName}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              장비일련번호
            </Typography>
            <Typography variant="body1">{targetAsset.deviceSerialNumber}</Typography>
          </Box>
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
          <Button variant="contained" onClick={handleSave}>
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
