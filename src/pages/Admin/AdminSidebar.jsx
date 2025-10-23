// src/layouts/AdminSidebar.jsx
import React from "react";
import {Drawer,Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const drawerWidth = 240;

export default function AdminSidebar({ open, setOpen }) {
    const navigate = useNavigate();
    const auth = getAuth();

    // handleLogout
    const handleLogout = async () => {
        try {
        await signOut(auth);
        navigate("/login"); 
        } catch (error) {
        console.error("Logout error:", error);
        }
    };

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
        { text: "Products", icon: <InventoryIcon />, path: "/admin/products" },
        { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    ];

    return (
        <Box
        sx={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: open ? drawerWidth : 80,
            backgroundColor: "var(--primary-color)",
            color: "#fff",
            transition: "width 0.3s ease",
            overflowX: "hidden",
            zIndex: 1300,
        }}
        >
        {/* Logo + Toggle Button */}
        <Box
            sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
            height: "64px",
            }}
        >
            {open && (
            <Typography
                variant="h4"
                sx={{
                fontWeight: "bold",
                fontFamily: "'Lobster', sans-serif",
                color: "var(--secondary-color)",
                }}
            >
                Athletica
            </Typography>
            )}
            <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: "var(--secondary-color)" }}
            size="small"
            >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        <List>
            {menuItems.map((item) => (
            <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
                onClick={() => navigate(item.path)}
            >
                <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
                >
                <ListItemIcon
                    sx={{
                    color: "var(--secondary-color)",
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            ))}
        </List>

        

        {/* logout*/}
        <List sx={{ position: "absolute",  width: "100%" }}>
            <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
                onClick={handleLogout}
                sx={{
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
            >
                <ListItemIcon
                sx={{
                    color: "var(--secondary-color)",
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                }}
                >
                <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </ListItem>
        </List>
        </Box>
    );
}
