// src/pages/user/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation } from "react-router-dom";
import Product from "../../components/Product/Product";
import {
  Grid,
  Button,
  CircularProgress,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ProductsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryFromUrl = params.get("category") || "Men";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Subcategories per category
  const subcategoriesMap = {
    Men: ["T-Shirts", "Shorts", "Tracksuits", "Shoes"],
    Women: ["Tops", "Leggings", "Sports Bras", "Shoes"],
    Kids: ["T-Shirts", "Shorts", "Tracksuits", "Shoes"],
    Equipment: ["Dumbbells", "Yoga Mats", "Resistance Bands", "Jump Ropes"],
    "Bags & Accessories": ["Gym Bags", "Water Bottles", "Caps", "Socks"],
  };

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSelectedSubcategory("");
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q =
          selectedSubcategory
            ? query(
                collection(db, "products"),
                where("category", "==", selectedCategory),
                where("subcategory", "==", selectedSubcategory)
              )
            : query(
                collection(db, "products"),
                where("category", "==", selectedCategory)
              );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory]);

  // فلترة المنتجات حسب البحث
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ py: 5, px: 3, minHeight: "70vh" }}>
      {/* Search Input */}
      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          variant="outlined"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "100%", maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Subcategory Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          variant={selectedSubcategory === "" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setSelectedSubcategory("")}
        >
          All
        </Button>

        {subcategoriesMap[selectedCategory]?.map((sub) => (
          <Button
            key={sub}
            variant={selectedSubcategory === sub ? "contained" : "outlined"}
            color="primary"
            onClick={() =>
              setSelectedSubcategory(sub === selectedSubcategory ? "" : sub)
            }
          >
            {sub}
          </Button>
        ))}
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No products found matching your search.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Product product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
