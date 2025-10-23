import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Container from '@mui/material/Container';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { BsCart4 } from "react-icons/bs";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", user.uid, "cart")
          );
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartItems(data);
          calculateTotal(data);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
    setTotalPrice(total);
  };

  const handleIncrease = async (item) => {
    const newQuantity = item.quantity + 1;
    await updateQuantity(item, newQuantity);
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      await updateQuantity(item, newQuantity);
    }
  };

  const updateQuantity = async (item, newQuantity) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const itemRef = doc(db, "users", user.uid, "cart", item.id);
      await updateDoc(itemRef, { quantity: newQuantity });

      const updatedItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "cart", itemId));

      const updatedItems = cartItems.filter((i) => i.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (cartItems.length === 0)
  return (
    <Box
      textAlign="center"
      mt={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ color: "#115173" , minHeight: "50vh" }}
    >
      <BsCart4 style={{ fontSize: "6rem", color: "#115173", marginBottom: "1rem" }} />
      <Typography variant="h5" mb={2}>
        Your cart is empty.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "secondary.main",
          color: "primary.main",
          px: 4,
          py: 1.2,
          borderRadius: "30px",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#bfff00c1" },
        }}
        onClick={() => (window.location.href = "/products")} 
      >
        Start Shopping
      </Button>
    </Box>
  );


  return (
      <Box sx={{ p: { xs: 2, md: 6 }, minHeight: "70vh" }}>
        <Typography
          variant="h4"
          textAlign="center"
          mb={5}
          fontWeight="bold"
          color="#115173"
        >
          Shopping Cart
        </Typography>

        <Grid container spacing={4} display="flex" justifyContent="center">
          {/* 🛒 عمود المنتجات */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    position: "relative", // 👈 علشان نقدر نحط الـ delete فوق
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    border: "2px solid #115173 ",
                  }}
                >
                  {/* 🗑️ زر الحذف فوق اليمين */}
                  <IconButton
                    onClick={() => handleRemove(item.id)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "error.main",
                      "&:hover": { backgroundColor: "#ffe5e5" },
                    }}
                  >
                    <HighlightOffRoundedIcon />
                  </IconButton>

                  {/* الصورة + التفاصيل */}
                  <Box display="flex" alignItems="center" gap={2} py={2}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        objectFit: "cover",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      image={item.imageUrl || "https://via.placeholder.com/150"}
                      alt={item.name}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="600">
                        {item.name}
                      </Typography>
                      <Typography color="text.secondary">
                        ${Number(item.price).toFixed(2)} each
                      </Typography>
                    </Box>
                  </Box>

                  {/* الكمية + السعر */}
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, px: 1 }}
                    >
                      <IconButton size="small" onClick={() => handleDecrease(item)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography fontWeight="bold">{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => handleIncrease(item)}>
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography fontWeight="bold" color="#115173">
                     total: ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* 💰 عمود الإجمالي */}
          <Grid item xs={12} md={4} >
            <Box
              sx={{
                position: "sticky",
                top: 100,
                backgroundColor: "primary.main",
                borderRadius: 3,
                p: 3,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={2}
                color="white"
                textAlign="center"
              >
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} color="white"/>
              <Typography
                variant="h6"
                mb={3}
                textAlign="center"
                fontWeight="bold"
                color="white"
              >
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 1.3,
                  fontSize: "1rem",
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                  "&:hover": { backgroundColor: "#bfff00e1" },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
  );
}

