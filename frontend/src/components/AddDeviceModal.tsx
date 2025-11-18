import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { addDevice } from "../store/deviceSlice";
import { fetchCategories } from "../store/categorySlice";

interface AddDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; 
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {

  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.category.list);

  const [form, setForm] = useState({
    serialNumber: "",
    catId: "", 
    deviceName: "",
    company: "",
    purchaseDate: "",
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories());
    }

    // 모달을 닫으면 입력항목 초기화
    if (!open) {
      setForm({ 
        serialNumber: "", 
        catId: "",
        deviceName: "",
        company: "",
        purchaseDate: "",
      });
    }
  }, [dispatch, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(addDevice({
      serialNumber: form.serialNumber,
      catId: form.catId,
      deviceName: form.deviceName,
      company: form.company,
      purchaseDate: form.purchaseDate,
    })).unwrap();

    alert("장비가 등록되었습니다.");
    onClose();
    onSuccess();

    // 등록이 완료되면 입력항목 초기화
    setForm({ 
      serialNumber: "", 
      catId: "",
      deviceName: "",
      company: "",
      purchaseDate: "",
    });
  }

  const handleCancel = () => {
    onClose();
    // 취소 버튼을 누르면 입력항목 초기화
    setForm({ 
      serialNumber: "", 
      catId: "",
      deviceName: "",
      company: "",
      purchaseDate: "",
    });
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>장비 등록</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="일련번호"
            variant="outlined"
            required
            value={form.serialNumber}
            onChange={(e) =>
              setForm({ ...form, serialNumber: e.target.value })
            }
          />
          <TextField
            select
            label="분류"
            variant="outlined"
            required
            value={form.catId}
            onChange={(e) =>
              setForm({ ...form, catId: e.target.value })
            }
          >
            {categories.map((c) => (
              <MenuItem key={c.catId} value={c.catId}>
                {c.catName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="장비명"
            variant="outlined"
            required
            value={form.deviceName}
            onChange={(e) =>
              setForm({ ...form, deviceName: e.target.value })
            }
          />
          <TextField
            label="제조사"
            variant="outlined"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
          />
          <TextField
            label="구입일"
            type="date"
            value={form.purchaseDate}
            onChange={(e) =>
              setForm({ ...form, purchaseDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            required
          />
          <DialogActions sx={{ px: 0 }}>
            <Button type="submit" variant="contained">
              등록
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="secondary">
              취소
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddDeviceModal;