// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import {Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // ✅ جلب المنتجات من Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        const data = productsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🗑️ حذف منتج
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Manage Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("/admin/products/add")}
        >
          Add Product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "var(--tertiary-color)",color:"var(--secondary-color)" }}>
              <TableRow>
                <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{p.name || "—"}</TableCell>
                  <TableCell>{p.category || "—"}</TableCell>
                  <TableCell>${p.price || 0}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(p.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
