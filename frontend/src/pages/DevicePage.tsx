import React, { useEffect, useState, useMemo } from "react";
import AddDeviceModal from "../components/AddDeviceModal";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { deleteDevice, Device, fetchDevices } from "../store/deviceSlice";
import { logoutUser  } from "../store/userSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Paper,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Link,
  Avatar,
 } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toUploadsUrl } from "../utils/url"; 
import { 
  USER_NAME_NULL,
  NO_PHOTO_URL,
  DELETE_DEVICE_OK,
  TOOLTIP_LOGOUT,
  WARNING_GUEST,
} from "../utils/text";
import ManagementSidebar from "../components/ManagementSidebar";

const DevicePage: React.FC = () => {

  const { list } = useAppSelector((s) => s.device);
  const { isAuthenticated, profile } = useAppSelector((s) => s.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const isGuest = profile.role === "guest";

  const hasToken = isAuthenticated;

  let userName = profile.name;
  if (!userName) {
    if (hasToken && (profile.userid)) {
      userName = profile.userid || "";
    } else {
      userName = USER_NAME_NULL;
    }
  }
  const photoSrc = toUploadsUrl(profile.photoUrl) || NO_PHOTO_URL;
  const isRelogin = !hasToken;

  // 장비 전체 목록 조회
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // 뒤로 버튼 클릭
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // 장비 삭제 버튼 클릭
  const handleDeleteClick = (serialNumber: string) => {
    setDeleteTarget(serialNumber);
    setDeleteConfirmOpen(true);
  };

  // 장비 삭제 모달 - 확인 버튼 클릭
  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await dispatch(deleteDevice(deleteTarget));
      alert(DELETE_DEVICE_OK);
      setDeleteTarget("");
      setDeleteConfirmOpen(false);
      dispatch(fetchDevices());
    }
  };

  // 장비 삭제 모달 - 취소 버튼 클릭
  const handleDeleteCancel = () => {
    setDeleteTarget("");
    setDeleteConfirmOpen(false);
  };

  // 테이블 헤더 클릭 (레코드 정렬)
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortList = useMemo(() => {
    const arr = [...list];
    const getVal = (d: Device) => {
      switch (sortKey) {
        case 'catName' : return d.catName;
        case 'purchaseDate' : return d.purchaseDate;
        default : return "";
      }
    }
    arr.sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);

      // 값이 없으면 맨 뒤로 배치
      if (!av) {
        return 1;
      }
      if (!bv) {
        return -1;
      }

      // 날짜의 경우
      if (sortKey === "purchaseDate") {
        const at = new Date(av).getTime();
        const bt = new Date(bv).getTime();
        return sortDirection === "asc" ? at - bt : bt - at;
      // 날짜 이외의 경우 (문자)
      } else {
        if (av < bv) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (av > bv) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      }
    })
    return arr;
  }, [list, sortKey, sortDirection]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title={TOOLTIP_LOGOUT}>
            <IconButton edge="start" onClick={handleLogout}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            장비 관리
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
            <Avatar src={photoSrc} alt="profile" sx={{ width: 40, height: 40 }} />
            <Link
              component={RouterLink}
              to={isRelogin ? "/" : "/user-info"}
              underline="hover"
              sx={{ fontWeight: 600 }}
              onClick={() => {
                if (isRelogin) {
                  handleLogout();
                }
              }}
            >
              {userName}
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {!isRelogin && (
        <Box sx={{ display: "flex" }}>
          <ManagementSidebar />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              {isGuest ? (
                <Typography variant="body2" color="warning">
                  {WARNING_GUEST}
                </Typography> 
              ) : (
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                  <Box sx={{ display: "inline-flex", gap: 1 }}>
                    <Button variant="contained" onClick={() => setOpen(true)}>장비등록</Button> 
                  </Box>
                </Stack>
              )}
            </Paper>
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <TableContainer sx={{ maxHeight: "calc(100vh - 240px)" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: 160 }}>일련번호</TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, width: 160, cursor: "pointer" }}
                        onClick={() => handleSort("catName")}
                      >
                        분류{sortKey === "catName" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, width: 160 }}
                      >
                        장비명
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, width: 160 }}
                      >
                        제조사
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, width: 160, cursor: "pointer" }}
                        onClick={() => handleSort("purchaseDate")}
                      >
                        구입일자{sortKey === "purchaseDate" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 140 }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sortList.map((d: Device) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.serialNumber}</TableCell>
                        <TableCell>{d.catName}</TableCell>
                        <TableCell>{d.deviceName}</TableCell>
                        <TableCell>{d.company ?? "-"}</TableCell>
                        <TableCell>{d.purchaseDate}</TableCell>
                        {isGuest ? <TableCell></TableCell> : (
                          <TableCell>
                            <Stack direction="row" spacing={1.2}>
                              <Button
                                size="small"
                                color="error"
                                variant="text"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => handleDeleteClick(d.serialNumber)}
                              >
                                삭제
                              </Button>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Container>
        </Box>
      )}

      <AddDeviceModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => dispatch(fetchDevices())}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>장비 삭제</DialogTitle>
        <DialogContent>
          해당 장비를 삭제하시겠습니까?
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
    </Box>
  );
};

export default DevicePage;
