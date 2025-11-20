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
  Typography,
  Stack
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { fetchRoles } from "../store/roleSlice";
import { User, updateRole } from "../store/userSlice";

interface UpdateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  user: User;
}

const UpdateRoleModal: React.FC<UpdateRoleModalProps> = ({
  open,
  onClose,
  onSuccess,
  user,
}) => {

  const dispatch = useAppDispatch();
  const roles = useAppSelector((s) => s.role.list);

  const [form, setForm] = useState({
    userid: "",
    name: "",
    role: "", 
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchRoles());
      setForm({
        userid: user.userid,
        name: user.name,
        role: user.role,
      })
    }
  }, [dispatch, open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(updateRole(form));

    onClose();
    onSuccess();
  }

  const handleCancel = () => {
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>권한 변경</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Stack spacing={2.5} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Typography variant="body1" color="text.secondary" sx={{ width: 104 }}>
                이름
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: "1.125rem" }}>
                {form.name}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={2.5}>
            <TextField
              select
              label="권한"
              variant="outlined"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              {roles
              .filter((c) => c.roleId !== "admin")
              .map((c) => (
                <MenuItem key={c.roleId} value={c.roleId}>
                  {c.roleName}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <DialogActions sx={{ px: 0, mt: 3 }}>
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

export default UpdateRoleModal;