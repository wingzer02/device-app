import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { fetchAssets, deleteAsset } from "../store/assetSlice";
import { logoutUser } from "../store/userSlice";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Paper,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
  Tooltip,
  Link,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toUploadsUrl } from "../utils/url";
import {
  USER_NAME_NULL,
  NO_PHOTO_URL,
  TOOLTIP_LOGOUT,
} from "../utils/text";
import ManagementSidebar from "../components/ManagementSidebar";

const AssetPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { list: assets } = useAppSelector((s) => s.asset);
  const { isAuthenticated, profile } = useAppSelector((s) => s.user);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const hasToken = isAuthenticated;

  let userName = profile.name;
  if (!userName) {
    if (hasToken && profile.userid) {
      userName = profile.userid || "";
    } else {
      userName = USER_NAME_NULL;
    }
  }
  const photoSrc = toUploadsUrl(profile.photoUrl) || NO_PHOTO_URL;
  const isRelogin = !hasToken;

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // 뒤로 버튼 클릭
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleAssetRegister = () => {
    navigate("/assets/register");
  };

  // 자산 삭제 클릭
  const handleDeleteClick = (assetSerialNumber: string) => {
    setDeleteTarget(assetSerialNumber);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteAsset(deleteTarget));
    await dispatch(fetchAssets());
    setDeleteTarget(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDeleteConfirmOpen(false);
  };

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
            자산 관리
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
              <Stack direction="row" justifyContent="flex-end" alignItems="center">
                <Box sx={{ display: "inline-flex", gap: 1 }}>
                  <Button variant="contained" onClick={handleAssetRegister}>
                    자산등록
                  </Button>
                </Box>
              </Stack>
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
                      <TableCell sx={{ fontWeight: 700 }}>관리코드</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>자산명</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>설치장소</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>사용자명</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>장비일련번호</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>사용시작일</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>사용종료일</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 220 }}>관리</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((a) => (
                      <TableRow key={a.assetSerialNumber}>
                        <TableCell>{a.assetSerialNumber}</TableCell>
                        <TableCell>{a.assetName}</TableCell>
                        <TableCell>{a.location}</TableCell>
                        <TableCell>{a.userName}</TableCell>
                        <TableCell>{a.deviceSerialNumber}</TableCell>
                        <TableCell>{a.startDate ?? "-"}</TableCell>
                        <TableCell>{a.endDate ?? "-"}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

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
