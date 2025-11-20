import React, { useEffect, useState, useMemo } from "react";
import AddDeviceModal from "../components/AddDeviceModal";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { deleteDevice, Device, fetchDevices } from "../store/deviceSlice";
import { logoutUser  } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { 
  Box,
  Container,
  Paper,
  Button,
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
  Pagination,
 } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toUploadsUrl } from "../utils/url"; 
import { 
  USER_NAME_NULL,
  NO_PHOTO_URL,
} from "../utils/text";
import CommonSidebar from "../components/CommonSidebar";
import CommonHeader from "../components/CommonHeader";

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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const isGuest = profile.role === "guest";

  const userName = profile.name ? profile.name : USER_NAME_NULL;
  const photoSrc = toUploadsUrl(profile.photoUrl) || NO_PHOTO_URL;

  // 장비 전체 목록 조회
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(list.length / rowsPerPage));
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [list.length, page, rowsPerPage])

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
    try {
      await dispatch(deleteDevice(deleteTarget)).unwrap();
      setDeleteTarget("");
      setDeleteConfirmOpen(false);
      dispatch(fetchDevices());
    } catch (error) {
      setDeleteConfirmOpen(false);
      alert(error);
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
    setPage(1);
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
      if (!av) return 1;
      if (!bv) return -1;

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

  const pageCount = Math.max(1, Math.ceil(sortList.length / rowsPerPage));

  const handleChangePage = (_event: unknown, value: number) => {
    setPage(value);
  };

  const pagedDevices = useMemo(
    () => sortList.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    ),
    [sortList, page, rowsPerPage]
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CommonHeader
        title="장비 관리"
        userName={userName}
        photoSrc={photoSrc}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      {isAuthenticated && (
        <Box sx={{ display: "flex" }}>
          <CommonSidebar />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            {!isGuest && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                }}
              >
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                  <Box sx={{ display: "inline-flex", gap: 1 }}>
                    <Button variant="contained" onClick={() => setOpen(true)}>장비등록</Button> 
                  </Box>
                </Stack>
              </Paper>
            )}
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>일련번호</TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, cursor: "pointer" }}
                        onClick={() => handleSort("catName")}
                      >
                        분류{sortKey === "catName" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700 }}
                      >
                        장비명
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700 }}
                      >
                        제조사
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, cursor: "pointer" }}
                        onClick={() => handleSort("purchaseDate")}
                      >
                        구입일자{sortKey === "purchaseDate" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {pagedDevices.map((d: Device) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.serialNumber}</TableCell>
                        <TableCell>{d.catName}</TableCell>
                        <TableCell>{d.deviceName}</TableCell>
                        <TableCell>{d.company ?? "-"}</TableCell>
                        <TableCell>{d.purchaseDate ?? "-"}</TableCell>
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
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
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
