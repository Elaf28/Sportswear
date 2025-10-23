import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import "./Product.css";

export default function Product({ product, isFavoritePage = false, onRemoved }) {
  const navigate = useNavigate();
  const [isFav, setIsFav] = React.useState(isFavoritePage);

  // ✅ Add to cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login"); // 👈 تحويل المستخدم إلى صفحة تسجيل الدخول
      return;
    }

    try {
      const cartRef = doc(db, "users", user.uid, "cart", product.id);
      await setDoc(cartRef, {
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      toast.success(`${product.name} added to cart 🛒`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // ✅ Toggle favorite
  const handleToggleFav = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login to manage favorites");
      navigate("/login"); // 👈 تحويل المستخدم إلى صفحة تسجيل الدخول
      return;
    }

    const favRef = doc(db, "users", user.uid, "favorites", product.id);

    try {
      if (isFav) {
        // Remove from favorites
        await deleteDoc(favRef);
        setIsFav(false);
        toast.info(`${product.name} removed from favorites 🩶`);
        if (onRemoved) onRemoved(product.id);
      } else {
        // Add to favorites
        await setDoc(favRef, {
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          addedAt: new Date().toISOString(),
        });
        setIsFav(true);
        toast.success(`${product.name} added to favorites ❤️`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <Card
      className="product-card"
      sx={{
        boxShadow: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 6,
        },
        "&:hover .hover-icons": {
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={product.imageUrl}
          alt={product.name}
          sx={{
            width: "100%",
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
            transition: "0.3s ease",
          }}
        />

        {/* icons hover */}
        <Box
          className="hover-icons"
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: 1,
            opacity: 0,
            transform: "translateY(-10px)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Add to Cart */}
          <IconButton
            sx={{
              bgcolor: "var(--secondary-color)",
              "&:hover": { bgcolor: "primary.main", color: "white" },
              boxShadow: 2,
            }}
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon />
          </IconButton>

          {/* Favorite toggle */}
          <IconButton
            sx={{
              bgcolor: "var(--secondary-color)",
              "&:hover": {
                bgcolor: isFav ? "gray" : "error.main",
                color: "white",
              },
              color: isFav ? "red" : "inherit",
              boxShadow: 2,
            }}
            onClick={handleToggleFav}
          >
            {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* product info */}
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "var(--tertiary-color)" }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#41A67E", fontWeight: 600 }}
        >
          $ {product.price}
        </Typography>
      </CardContent>
    </Card>
  );
}
