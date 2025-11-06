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
  onSuccess?: () => void; 
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {

  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.category.list);

  const [form, setForm] = useState<{ serialNumber: string; catId: string }>({
    serialNumber: "",
    catId: "", 
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories());
    }

    // 모달을 닫으면 입력항목 초기화
    if (!open) {
      setForm({ 
        serialNumber: "", 
        catId: "" 
      });
    }
  }, [dispatch, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(addDevice({
      serialNumber: form.serialNumber,
      catId: form.catId,
    })).unwrap();

    alert("장치가 등록되었습니다.");
    onClose();
    if (onSuccess) {
      onSuccess();
    }
    // 등록이 완료되면 입력항목 초기화
    setForm({ 
      serialNumber: "", 
      catId: "" 
    });
  }

  const handleCancel = () => {
    onClose();
    // 취소 버튼을 누르면 입력항목 초기화
    setForm({ 
      serialNumber: "", 
      catId: "" 
    });
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>장치 등록</DialogTitle>
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
            label="장치분류"
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
          <DialogActions sx={{ px: 0 }}>
            <Button type="submit" variant="contained" color="primary">
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