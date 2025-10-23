import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, MenuItem } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const categoryOptions = {
  Men: ["T-Shirts", "Shorts", "Tracksuits", "Shoes"],
  Women: ["Tops", "Leggings", "Sports Bras", "Shoes"],
  Kids: ["T-Shirts", "Shorts", "Tracksuits", "Shoes"],
  Equipment: ["Dumbbells", "Yoga Mats", "Resistance Bands", "Jump Ropes"],
  "Bags & Accessories": ["Gym Bags", "Water Bottles", "Caps", "Socks"],
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "products"), {
        ...product,
        price: Number(product.price),
      });

      Swal.fire({
        icon: "success",
        title: "Product added successfully!",
        showConfirmButton: false,
        timer: 1400,
      });

      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add product.",
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Add Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            fullWidth
            required
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Category"
            fullWidth
            required
            value={product.category || ""}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value, subcategory: "" })
            }
            sx={{ mb: 2 }}
          >
            {Object.keys(categoryOptions).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Subcategory"
            fullWidth
            required
            value={product.subcategory || ""}
            onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
            sx={{ mb: 2 }}
            disabled={!product.category}
          >
            {product.category
              ? categoryOptions[product.category].map((sub) => (
                  <MenuItem key={sub} value={sub}>
                    {sub}
                  </MenuItem>
                ))
              : []}
          </TextField>

          <TextField
            label="Price"
            type="number"
            fullWidth
            required
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Image URL"
            fullWidth
            value={product.imageUrl}
            onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            sx={{ mb: 3 }}
          />

          <Button type="submit" variant="contained" fullWidth>
            Add Product
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
