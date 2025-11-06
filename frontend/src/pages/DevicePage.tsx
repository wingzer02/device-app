import React, { useEffect, useState } from "react";
import AddDeviceModal from "../components/AddDeviceModal";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { deleteDevice, fetchDevices } from "../store/deviceSlice";
import { logout } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const DevicePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.device);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // 페이지 진입 시 장치 목록 조회
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // 뒤로 버튼 클릭
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // 장치 삭제 버튼 클릭
  const handleDeleteClick = (serialNumber: string) => {
    setDeleteTarget(serialNumber);
    setDeleteConfirmOpen(true);
  }

  // 장치 삭제 모달 - 확인 버튼 클릭
  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await dispatch(deleteDevice(deleteTarget));
      alert("장치가 삭제되었습니다.");
      setDeleteTarget(null);
      setDeleteConfirmOpen(false);
      dispatch(fetchDevices());
    }
  }

  // 장치 삭제 모달 - 취소 버튼 클릭
  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDeleteConfirmOpen(false);
  };

  // 장치 사용자 등록 버튼 클릭
  const handleRegisterClick = (device: any) => {
    navigate("/devices/register", { state: { device } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={handleLogout}>뒤로</button>
        <button onClick={() => setOpen(true)}>장치등록</button>
      </div>

      <h2 style={{ textAlign: "center", margin: "1rem 0" }}>장치 관리</h2>

      <table border={1} width="100%" cellPadding={8}>
        <thead>
          <tr>
            <th>일련번호</th>
            <th>장치분류</th>
            <th>장치사용자</th>
            <th>사용시작일</th>
            <th>사용종료일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {list.map((device) => (
            <tr key={device.id}>
              <td>{device.serialNumber}</td>
              <td>{device.catName}</td>
              <td>{device.userName ?? "-"}</td>
              <td>{device.startDate ?? "-"}</td>
              <td>{device.endDate ?? "-"}</td>
              <td>
                <button onClick={() => handleRegisterClick(device)}>등록</button>
                <button>변경</button>
                <button onClick={() => handleDeleteClick(device.serialNumber)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <AddDeviceModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => dispatch(fetchDevices())}
        />
      </div>
      <div>
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>장치 삭제</DialogTitle>
          <DialogContent>
            해당 장치를 삭제하시겠습니까?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              확인
            </Button>
            <Button onClick={handleDeleteCancel} variant="outlined" color="secondary">
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DevicePage;
