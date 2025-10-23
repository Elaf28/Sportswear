import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import {Box,Typography,Button,CircularProgress,CardMedia,IconButton,Divider,} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
            } else {
            toast.error("Product not found");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const user = auth.currentUser;
        if (!user) {
        toast.error("Please login to add items to cart");
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

    const handleToggleFav = async () => {
        const user = auth.currentUser;
        if (!user) {
        toast.error("Please login to manage favorites");
        return;
        }

        const favRef = doc(db, "users", user.uid, "favorites", product.id);

        try {
        if (isFav) {
            await deleteDoc(favRef);
            setIsFav(false);
            toast.info(`${product.name} removed from favorites 🩶`);
        } else {
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

    if (loading)
        return (
        <Box textAlign="center" mt={10}>
            <CircularProgress />
        </Box>
        );

    if (!product)
        return (
        <Typography textAlign="center" mt={5}>
            Product not found.
        </Typography>
        );

    return (
        <Box
        sx={{
            p: { xs: 2, md: 6 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            gap: 6,
            minHeight: "100vh",
        }}
        >
        {/* product image */}
        <CardMedia
            component="img"
            image={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            sx={{
            width: { xs: "100%", md: "420px" },
            height: "420px",
            borderRadius: 3,
            objectFit: "cover",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
        />

        <Box sx={{ flex: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold" color="#115173">
                {product.name}
            </Typography>

            <IconButton
                onClick={handleToggleFav}
                sx={{
                color: isFav ? "error.main" : "#999",
                "&:hover": { color: isFav ? "gray" : "error.main" },
                }}
            >
                {isFav ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
            </IconButton>
            </Box>

            <Typography variant="h5" color="#41A67E" mt={1}>
            ${product.price}
            </Typography>

            <Divider sx={{ my: 3 }} />
            {/* category & subcategory */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr ", gap: 2 }}>
            <Typography>
                <strong>Category:</strong> {product.category || "N/A"}
            </Typography>
            <Typography>
                <strong>Subcategory:</strong> {product.subcategory || "N/A"}
            </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* description*/}
            <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.7}>
            {product.description ||
                "This product currently has no detailed description available. Please check back later."}
            </Typography>

            {/* add to cart */}
            <Button
            variant="contained"
            onClick={handleAddToCart}
            sx={{
                backgroundColor: "#115173",
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: "30px",
                color:"secondary.main",
                "&:hover": { backgroundColor: "#0e3f59" },
            }}
            >
            Add to Cart
            </Button>
        </Box>
        </Box>
    );
}
