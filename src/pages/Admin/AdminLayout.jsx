// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
          transition: "all 0.3s ease",
          marginLeft: open ? "240px" : "80px", // ✅ تظل المسافة مظبوطة
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
