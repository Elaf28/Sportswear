import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { GoHeart } from "react-icons/go";
import {
  Box,
  Typography,
  CircularProgress,
  Grid
} from "@mui/material";
import Product from "../components/Product/Product";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", user.uid, "favorites")
          );
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (favorites.length === 0)
    return (
      <Typography variant="h5" mt={5} textAlign="center" color="primary.main" minHeight={'60vh'}>
        You have no favorites yet.
      </Typography>
    );

  return (
    <Box sx={{ py: 5, px: 3 , minHeight: '70vh' }}>
      <Typography
        variant="h4"
        textAlign="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mb={4}
        sx={{ fontWeight: "bold", color: "#115173" }}
      >
        <span>My Favorites</span> <GoHeart color="red" />
      </Typography>

      {/* ✅ استخدمنا Grid بدلاً من flex */}
      <Grid container spacing={3} justifyContent="center">
        {favorites.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Product
              product={product}
              isFavoritePage={true}
              onRemoved={handleRemove}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
