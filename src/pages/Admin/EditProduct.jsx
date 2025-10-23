// src/pages/admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  // ✅ جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          Swal.fire({
            icon: "error",
            title: "Not Found",
            text: "This product does not exist!",
            confirmButtonColor: "#1976d2",
          }).then(() => navigate("/admin/products"));
        }
      } catch (error) {
        console.error("Error loading product:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product data.",
          confirmButtonColor: "#1976d2",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // ✅ تأكيد التعديل قبل الحفظ
  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure you want to edit this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, "products", id);
          await updateDoc(docRef, {
            ...product,
            price: Number(product.price),
          });

          Swal.fire({
            icon: "success",
            title: "Product updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });

          // ✅ الانتقال بعد التعديل
          setTimeout(() => navigate("/admin/products"), 1500);
        } catch (error) {
          console.error("Error updating product:", error);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Something went wrong. Please try again.",
            confirmButtonColor: "#1976d2",
          });
        }
      } else {
        // ❌ المستخدم رفض التعديل → نرجعه لصفحة المنتجات
        navigate("/admin/products");
      }
    });
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading product...</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Edit Product
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
            label="Category"
            fullWidth
            required
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            sx={{ mb: 2 }}
          />
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

          <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
