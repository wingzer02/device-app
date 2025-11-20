import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { fetchAllUsersAdminPage, deleteUser, logoutUser, User } from "../store/userSlice";
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
  TextField,
 } from "@mui/material";
import UpdateRoleModal from "../components/UpdateRoleModal";
import CommonSidebar from "../components/CommonSidebar";
import CommonHeader from "../components/CommonHeader";
import { NO_PHOTO_URL, USER_NAME_NULL } from "../utils/text";
import { toUploadsUrl } from "../utils/url";

const UserListPage: React.FC = () => {

  const { listAdminPage, isAuthenticated, profile } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [searchName, setSearchName] = useState("");

  const photoSrc = toUploadsUrl(profile.photoUrl) || NO_PHOTO_URL;
  const userName = profile.name ? profile.name : USER_NAME_NULL;
  
  useEffect(() => {
    dispatch(fetchAllUsersAdminPage());
  }, [dispatch]);

  // 검색
  const keyword = searchName.trim().toLowerCase();
  const filteredList = 
    keyword === ""
      ? listAdminPage
      : listAdminPage.filter((u) => u.name.toLowerCase().includes(keyword))

  // 뒤로 버튼 클릭
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  // 회원탈퇴 버튼 클릭
  const handleDeleteClick = async (userid: string) => {
    await dispatch(deleteUser(userid));
    alert("사용자가 탈퇴되었습니다.");
    dispatch(fetchAllUsersAdminPage());
  };

  const handleOpenUpdateRole = (u: User) => {
    setSelectedUser(u);
    setOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CommonHeader
        title="사용자 관리"
        userName={userName}
        photoSrc={photoSrc}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
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
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <TextField
                size="small"
                label="이름 검색"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Box>
            <TableContainer sx={{ maxHeight: "calc(100vh - 240px)" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ fontWeight: 700, width: 160 }}
                    >
                      아이디
                    </TableCell>
                    <TableCell 
                      sx={{ fontWeight: 700, width: 160 }}
                    >
                      이름
                    </TableCell>
                    <TableCell 
                      sx={{ fontWeight: 700, width: 300 }}
                    >
                      이메일
                    </TableCell>
                    <TableCell 
                      sx={{ fontWeight: 700, width: 120 }}
                    >
                      권한
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 220 }}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredList.map((u: User) => (
                      <TableRow 
                        key={u.userid}
                        hover
                        sx={
                          u.delFlg
                          ? (t) => ({
                            backgroundColor: t.palette.action.hover,
                            "& .MuiTableCell-root": { color: t.palette.text.disabled },
                          }) : null
                        }
                      >
                        <TableCell>{u.userid}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.roleName}</TableCell>
                        <TableCell>
                          {u.delFlg ? null :(
                            <Stack direction="row" spacing={1.2}>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => handleOpenUpdateRole(u)}
                              >
                                권한변경
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="text"
                                onClick={() => handleDeleteClick(u.userid)}
                              >
                                회원탈퇴
                              </Button>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      {selectedUser ? (
        <UpdateRoleModal
          open={open}
          user={selectedUser} 
          onClose={() => {
            setOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setOpen(false);
            setSelectedUser(null);
            dispatch(fetchAllUsersAdminPage());
          }}
        />
      ) : null}
    </Box>
  );
};

export default UserListPage;
