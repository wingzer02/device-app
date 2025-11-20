import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  fetchLogByAssetSerialNumber,
  updateLog,
  Log,
} from "../store/logSlice";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const LogEditPage: React.FC = () => {
  const { assetSerialNumber } = useParams<{ assetSerialNumber: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { log } = useAppSelector((s) => s.log);

  const [form, setForm] = useState<Log>(
    {
      assetSerialNumber: "",
      assetName: "",
      deviceSerialNumber: "",
      deviceName: "",
      cpuUsage: "",
      memoryUsage: "",
      diskUsage: "",
      checkDate: "",
    }
  );

  useEffect(() => {
    if (assetSerialNumber) {
      dispatch(fetchLogByAssetSerialNumber(assetSerialNumber));
    }
  }, [dispatch, assetSerialNumber]);

  useEffect(() => {
    setForm({
      ...log,
      cpuUsage: log.cpuUsage ?? "",
      memoryUsage: log.memoryUsage ?? "",
      diskUsage: log.diskUsage ?? "",
      checkDate: log.checkDate ?? "",
    });
  }, [log]);

  const handleSubmit = async () => {
    if (!form) return;
    if (isNaN(Number(form.cpuUsage))
      || isNaN(Number(form.memoryUsage))
      || isNaN(Number(form.diskUsage))) {
        alert("CPU, 메모리, 디스크사용률은 숫자여야 합니다.");
        return;
    }
    setForm({
      ...form,
      cpuUsage: Number(form.cpuUsage),
      memoryUsage: Number(form.memoryUsage),
      diskUsage: Number(form.diskUsage),
    });
    await dispatch(updateLog(form));
    navigate("/logs");
  };

  const handleCancel = () => {
    navigate("/logs");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: 480 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          로그 수정
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              자산명
            </Typography>
            <Typography variant="body1">
              {form.assetName}
            </Typography>
          </Box>
          <TextField
            label="CPU사용률"
            type="text"
            value={form.cpuUsage}
            onChange={(e) => setForm({ ...form, cpuUsage: e.target.value })}
            fullWidth
          />
          <TextField
            label="메모리사용률"
            type="text"
            value={form.memoryUsage}
            onChange={(e) => setForm({ ...form, memoryUsage: e.target.value })}
            fullWidth
          />
          <TextField
            label="디스크사용률"
            type="text"
            value={form.diskUsage}
            onChange={(e) => setForm({ ...form, diskUsage: e.target.value })}
            fullWidth
          />
          <TextField
            label="점검일자"
            type="date"
            value={form.checkDate}
            onChange={(e) => setForm({ ...form, checkDate: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            저장
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            취소
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LogEditPage;
