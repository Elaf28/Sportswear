import React, { useEffect, useState } from "react";
import {Box, Grid, Card, CardContent, Typography, CircularProgress, Divider} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        const usersSnap = await getDocs(collection(db, "users"));

        setStats({
          products: productsSnap.size,
          orders: 25, 
          users: usersSnap.size,
          revenue: 12000.75, 
        });
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );

  const data = [
    { name: "Products", value: stats.products },
    { name: "Orders", value: stats.orders },
    { name: "Users", value: stats.users },
  ];
  const COLORS = ["#1976d2", "#0288d1", "#0097a7"];

  return (
    <Box
      sx={{
        p: 4,
        // background: "linear-gradient(135deg, #f0f7ff, #e0f2f1)",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" mb={4}>
        Last updated: {new Date().toLocaleString()}
      </Typography>

      {/* الكروت الأساسية */}
      <Grid container spacing={3}>
        {[
          {
            title: "Products",
            value: stats.products,
            icon: <InventoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            color: "#1976d2",
          },
          {
            title: "Orders",
            value: stats.orders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            color: "#0288d1",
          },
          {
            title: "Users",
            value: stats.users,
            icon: <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            color: "#0097a7",
          },
          {
            title: "Revenue",
            value: `$${stats.revenue.toLocaleString()}`,
            icon: <MonetizationOnIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            color: "#00796b",
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)`,
                color: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* قسم الإحصائيات */}
      <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
        Platform Overview
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 350,
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          p: 2,
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
