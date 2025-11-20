import React from "react";
import { 
  AppBar,
  Avatar,
  Box,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link as RouterLink } from "react-router-dom";
import { TOOLTIP_LOGOUT } from "../utils/text";

interface CommonHeaderProps {
  title: string;
  onLogout: () => void;
  userName: string;
  photoSrc: string;
  isAuthenticated: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  onLogout,
  userName,
  photoSrc,
  isAuthenticated,
}) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        <Tooltip title={TOOLTIP_LOGOUT}>
          <IconButton edge="start" onClick={onLogout}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
          <Avatar src={photoSrc} alt="profile" sx={{ width: 40, height: 40 }} />
          <Link
            component={RouterLink}
            to={!isAuthenticated ? "/" : "/user-info"}
            underline="hover"
            sx={{ fontWeight: 600 }}
            onClick={() => {
              if (!isAuthenticated) {
                onLogout();
              }
            }}
          >
            {userName}
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CommonHeader;