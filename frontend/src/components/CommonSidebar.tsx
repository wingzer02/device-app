import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAppSelector } from "../hooks/useApp";

type SectionKey = "assets" | "devices" | "logs" | "users";

const labels: Record<SectionKey, string> = {
  assets: "자산 관리",
  devices: "장비 관리",
  logs: "로그 관리",
  users: "사용자 관리",
};

const CommonSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAppSelector((s) => s.user);
  const isAdmin = profile.role === "admin";

  const currentKey: SectionKey =
    location.pathname.startsWith("/assets")
      ? "assets"
      : location.pathname.startsWith("/devices")
      ? "devices"
      : location.pathname.startsWith("/logs")
      ? "logs"
      : "users";

  const handleNavigate = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <Box
      component="nav" 
      sx={{ 
        width: 200,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "Background.paper",
        py: 2,
      }} 
    >
      <List disablePadding>
        <ListItemButton
          selected={currentKey === "assets"}
          onClick={() => handleNavigate("/assets")}
        >
          <ListItemText primary={labels.assets} />
        </ListItemButton>
        <ListItemButton
          selected={currentKey === "devices"}
          onClick={() => handleNavigate("/devices")}
        >
          <ListItemText primary={labels.devices} />
        </ListItemButton>
        <ListItemButton
          selected={currentKey === "logs"}
          onClick={() => handleNavigate("/logs")}
        >
          <ListItemText primary={labels.logs} />
        </ListItemButton>
        {isAdmin && (
          <ListItemButton
            selected={currentKey === "users"}
            onClick={() => handleNavigate("/user-list")}
          >
            <ListItemText primary={labels.users} />
          </ListItemButton>
        )}
      </List>
    </Box>
  );
};

export default CommonSidebar;
