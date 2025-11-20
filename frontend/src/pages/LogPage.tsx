import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { fetchLogs } from "../store/logSlice";
import { logoutUser } from "../store/userSlice";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toUploadsUrl } from "../utils/url";
import {
  USER_NAME_NULL,
  NO_PHOTO_URL,
} from "../utils/text";
import CommonSidebar from "../components/CommonSidebar";
import CommonHeader from "../components/CommonHeader";

const LogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { list: logs } = useAppSelector((s) => s.log);
  const { isAuthenticated, profile } = useAppSelector((s) => s.user);

  const photoSrc = toUploadsUrl(profile.photoUrl) || NO_PHOTO_URL;
  const userName = profile.name ? profile.name : USER_NAME_NULL;

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  // 뒤로 버튼 클릭
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleEditClick = (assetSerialNumber: string) => {
    navigate(`/logs/${assetSerialNumber}/edit`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CommonHeader
        title="로그 관리"
        userName={userName}
        photoSrc={photoSrc}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      {isAuthenticated && (
        <Box sx={{ display: "flex" }}>
          <CommonSidebar />
          <Container maxWidth="lg" sx={{ py: 3 }}>
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
                      <TableCell sx={{ fontWeight: 700 }}>장비일련번호</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>장비명</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>CPU사용률</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>메모리사용률</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>디스크사용률</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>점검일자</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 120 }}>관리</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((l) => (
                      <TableRow key={l.assetSerialNumber}>
                        <TableCell>{l.assetSerialNumber}</TableCell>
                        <TableCell>{l.assetName}</TableCell>
                        <TableCell>{l.deviceSerialNumber}</TableCell>
                        <TableCell>{l.deviceName}</TableCell>
                        <TableCell>{l.cpuUsage ? `${l.cpuUsage}%` : "-"}</TableCell>
                        <TableCell>{l.memoryUsage ? `${l.memoryUsage}%` : "-"}</TableCell>
                        <TableCell>{l.diskUsage ? `${l.diskUsage}%` : "-"}</TableCell>
                        <TableCell>{l.checkDate ?? "-"}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.2}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => handleEditClick(l.assetSerialNumber)}
                            >
                              수정
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default LogPage;
