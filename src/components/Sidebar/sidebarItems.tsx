import React from "react";
import {
  Home,
  School,
  Assignment,
  CalendarMonth,
  MenuBook,
  Folder,
  Notes,
  FlashOn,
  AdminPanelSettings,
  Group,
} from "@mui/icons-material";

// Define sidebar item types
export interface SidebarItem {
  path: string;
  icon: React.ReactElement;
  label: string;
  color?: "primary" | "warning";
  nested?: boolean;
  permissionLevel: "guest" | "student" | "teacher" | "admin";
  items?: SidebarItem[];
}

// Sidebar item structure
const sidebarItems: SidebarItem[] = [
  {
    path: "/dashboard",
    icon: <Home />,
    label: "Dashboard",
    color: "primary",
    permissionLevel: "guest", // Everyone can access this
  },
  {
    path: "/subjects",
    icon: <School />,
    label: "Subjects",
    color: "primary",
    nested: true,
    permissionLevel: "student",
    items: [
      {
        path: "/subjects/my-subjects",
        icon: <Folder />,
        label: "My Subjects",
        color: "primary",
        permissionLevel: "student",
      },
      {
        path: "/subjects/marketplace",
        icon: <Notes />,
        label: "Marketplace",
        color: "primary",
        permissionLevel: "guest",
      },
      {
        path: "/subjects/created",
        icon: <FlashOn />,
        label: "Created Subjects",
        color: "warning",
        permissionLevel: "teacher",
      },
    ],
  },
  {
    path: "/to-do",
    icon: <Assignment />,
    label: "To-Do",
    color: "primary",
    permissionLevel: "student",
  },
  {
    path: "/kanban",
    icon: <CalendarMonth />,
    label: "Kanban Board",
    color: "primary",
    permissionLevel: "student",
  },
  {
    path: "/materials",
    icon: <MenuBook />,
    label: "Materials",
    color: "primary",
    permissionLevel: "teacher",
  },
  {
    path: "/admin",
    icon: <AdminPanelSettings />,
    label: "Admin Panel",
    color: "warning",
    permissionLevel: "admin",
    nested: true,
    items: [
      {
        path: "/admin/users",
        icon: <Group />,
        label: "Manage Users",
        color: "warning",
        permissionLevel: "admin",
      },
    ],
  },
];

export default sidebarItems;
