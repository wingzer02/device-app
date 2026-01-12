import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { deleteAsset, Asset, fetchAssetsPage } from "../store/assetSlice";
import { logoutUser } from "../store/userSlice";
import { fetchDevices } from "../store/deviceSlice";
import { fetchLogByAssetSerialNumber } from "../store/logSlice";
import {
  Box,
  Container,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toUploadsUrl } from "../utils/url";
import {
  USER_NAME_NULL,
  NO_PHOTO_URL,
} from "../utils/text";
import CommonSidebar from "../components/CommonSidebar";
import CommonHeader from "../components/CommonHeader";

const AssetPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { list: assets, totalPages } = useAppSelector((s) => s.asset);
  const { list: devices } = useAppSelector((s) => s.device);
  const { log } = useAppSelector((s) => s.log);
  const { isAuthenticated, profile } = useAppSelector((s) => s.user);

  const [deleteTarget, setDeleteTarget] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [logModalOpen, setLogModalOpen] = useState(false);

  const userName = profile.name ? profile.name : USER_NAME_NULL;
  const photoSrc = toUploadsUrl(profile.photoUrl) || NO_PHOTO_URL;
  const isGuest = profile.role === "guest";

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAssetsPage({
        page,
        size: rowsPerPage,
        sortKey,
        sortDir: sortDirection,
      })
    );
  }, [dispatch, page, rowsPerPage, sortKey, sortDirection]);

  // 뒤로 버튼 클릭
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // 자산 등록 클릭
  const handleAssetRegister = () => {
    navigate("/assets/register");
  };

  // 자산 삭제 클릭
  const handleDeleteClick = (assetSerialNumber: string) => {
    setDeleteTarget(assetSerialNumber);
    setDeleteConfirmOpen(true);
  };

  // 자산 삭제 모달 - 확인 버튼 클릭
  const handleDeleteConfirm = async () => {
    await dispatch(deleteAsset(deleteTarget));
    setDeleteTarget("");
    setDeleteConfirmOpen(false);

    if (page === 1) {
      dispatch(
        fetchAssetsPage({
          page: 1,
          size: rowsPerPage,
          sortKey,
          sortDir: sortDirection,
        })
      );
    } else {
      setPage(1);
    }
  };

  // 자산 삭제 모달 - 취소 버튼 클릭
  const handleDeleteCancel = () => {
    setDeleteTarget("");
    setDeleteConfirmOpen(false);
  };

  // 자산 일련번호 클릭
  const handleSerialNumberClick = (asset: Asset) => {
    dispatch(fetchLogByAssetSerialNumber(asset.assetSerialNumber));
    setLogModalOpen(true);    
  }

  // 페이지 변경
  const handleChangePage = (_event: unknown, value: number) => {
    setPage(value);
  };

  // 테이블 헤더 클릭 (레코드 정렬)
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CommonHeader
        title="자산 관리"
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
                    <Button variant="contained" onClick={handleAssetRegister}>
                      자산등록
                    </Button>
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
                      <TableCell sx={{ fontWeight: 700 }}>관리코드</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>자산명</TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, cursor: "pointer" }}
                        onClick={() => handleSort("location")}
                      >
                        설치장소{sortKey === "location" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>장비일련번호</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>장비명</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>사용자명</TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, cursor: "pointer" }}
                        onClick={() => handleSort("startDate")}
                      >
                        사용시작일{sortKey === "startDate" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell 
                        sx={{ fontWeight: 700, cursor: "pointer" }}
                        onClick={() => handleSort("endDate")}
                      >
                        사용종료일{sortKey === "endDate" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((a) => {
                      // 장비 정보 조회
                      const device = devices.find(
                        d => d.serialNumber === a.deviceSerialNumber
                      );
                      const isPc = device && Number(device.catId) === 2;

                      // 사용자명 표시 처리
                      const userNames = a.userNames ?? [];
                      const primaryName = userNames[0] ?? "-";
                      const extraCount = userNames.length === 2 ? 1 : 0;
                      const displayText =
                        extraCount > 0 ? `${primaryName} 외 ${extraCount}명` : primaryName;
                      const tooltipText = userNames.join(", ");

                      return (
                        <TableRow key={a.assetSerialNumber}>
                          <TableCell
                            sx={
                              isPc ? {
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: "primary.main",
                              } : undefined
                            }
                            onClick={isPc ? () => handleSerialNumberClick(a) : undefined}
                          >
                            {a.assetSerialNumber}
                          </TableCell>
                          <TableCell>{a.assetName}</TableCell>
                          <TableCell>{a.location}</TableCell>
                          <TableCell>{a.deviceSerialNumber}</TableCell>
                          <TableCell>{a.deviceName}</TableCell>
                          <TableCell>
                            {userNames.length > 1 ? (
                              <Tooltip title={tooltipText} enterDelay={1000} arrow>
                                <span>{displayText}</span>
                              </Tooltip>
                            ) : (
                              displayText
                            )}
                          </TableCell>
                          <TableCell>{a.startDate ?? "-"}</TableCell>
                          <TableCell>{a.endDate ?? "-"}</TableCell>
                          {isGuest ? <TableCell></TableCell> : (
                            <TableCell>
                              <Stack direction="row" spacing={1.2}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  component={RouterLink}
                                  to={`/assets/${a.assetSerialNumber}/edit`}
                                >
                                  수정
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="text"
                                  startIcon={<DeleteOutlineIcon />}
                                  onClick={() => handleDeleteClick(a.assetSerialNumber)}
                                >
                                  삭제
                                </Button>
                              </Stack>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Paper>

            <Dialog
              open={logModalOpen}
              onClose={() => setLogModalOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogContent dividers>
                <Typography sx={{ mb: 5 }}>
                  {log.assetName}
                </Typography>
                <Stack spacing={1.2}>
                  <Typography>
                    CPU 사용률 : {log.cpuUsage ? `${log.cpuUsage}%` : "-"}
                  </Typography>
                  <Typography>
                    메모리 사용률 : {log.memoryUsage ? `${log.memoryUsage}%` : "-"}
                  </Typography>
                  <Typography>
                    디스크 사용률 : {log.diskUsage ? `${log.diskUsage}%` : "-"}
                  </Typography>
                  <Typography>
                    점검일자 : {log.checkDate || "-"}
                  </Typography>
                </Stack>
              </DialogContent>
            </Dialog>

            <Dialog
              open={deleteConfirmOpen}
              onClose={handleDeleteCancel}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>자산 삭제</DialogTitle>
              <DialogContent>
                해당 자산을 삭제하시겠습니까?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleDeleteConfirm}
                  color="error"
                  variant="contained"
                >
                  확인
                </Button>
                <Button
                  onClick={handleDeleteCancel}
                  variant="outlined"
                  color="secondary"
                >
                  취소
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default AssetPage;
