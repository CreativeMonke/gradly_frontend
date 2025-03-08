import React, { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
  Divider,
  Typography,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import sidebarItems, { SidebarItem } from "./sidebarItems";
import { useAuthStore } from "../../store/authStore"; // Assume Zustand store for user info

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onMobileClose,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const [openNested, setOpenNested] = useState<{ [key: string]: boolean }>({});

  // Optimize Zustand state selection to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  console.log("user", user);

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive = location.pathname.startsWith(item.path);
    const isNestedActive = item.items?.some(
      (subItem) => location.pathname == subItem.path
    ) || false;

    const handleToggleNested = (path: string) => {
      setOpenNested((prev) => ({ ...prev, [path]: !prev[path] }));
    };
    return (
      <React.Fragment key={item.path}>
        <ListItemButton
          onClick={() => {
            if (item.nested) {
              navigate(item.path); // ✅ Use client-side routing with useNavigate
            }
          }}
          component={item.nested ? "div" : NavLink}
          to={!item.nested ? item.path : undefined}
          selected={isActive}
          sx={{
            backgroundColor: isNestedActive
              ? "warning" // ✅ Color when nested item is active
              : isActive
              ? "primary" // ✅ Color when main item is active
              : "transparent",
            borderRadius: 1,
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />

          {/* Clicking the arrow should only expand/collapse, not navigate */}
          {item.nested && (
            <Box
              onClick={(e) => {
                e.stopPropagation(); // ✅ Prevent list item click from firing
                handleToggleNested(item.path);
              }}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              {openNested[item.path] ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItemButton>

        {item.nested && item.items && (
          <Collapse in={openNested[item.path]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.items.map((subItem) => (
                <ListItemButton
                  key={subItem.path}
                  component={NavLink}
                  to={subItem.path}
                  selected={location.pathname.startsWith(subItem.path)}
                  sx={{
                    pl: 4,
                    borderRadius: 1,
                     backgroundColor: location.pathname.startsWith(subItem.path)
                    ? 'primary.main' 
                    : 'transparent',
                  }}
                >
                  <ListItemIcon>{subItem.icon}</ListItemIcon>
                  <ListItemText primary={subItem.label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 245,
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {isDesktop && (
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Typography variant="h6">Gradly</Typography>
        </Box>
      )}
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </List>
      <Divider />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText
            primary={
              user
                ? `${user.lastName.charAt(0).toUpperCase()}. ${user.firstName}`
                : "Profile"
            }
          />
        </ListItemButton>
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{ "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" } }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" } }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
