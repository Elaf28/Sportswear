import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
        const usersSnap = await getDocs(collection(db, "users"));
        const data = usersSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUsers(data);
        } catch (error) {
        console.error("Error loading users:", error);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the user.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
        try {
            await deleteDoc(doc(db, "users", id));
            setUsers((prev) => prev.filter((u) => u.id !== id));

            Swal.fire({
            title: "Deleted!",
            text: "The user has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire("Error", "Failed to delete user.", "error");
        }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading)
        return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
        >
            <CircularProgress />
        </Box>
        );

    return (
        <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="primary">
            Manage Users
            </Typography>
        </Box>

        {users.length === 0 ? (
            <Typography>No users found.</Typography>
        ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: "var(--tertiary-color)" }}>
                <TableRow>
                    <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Full Name</TableCell>
                    <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Created At</TableCell>
                    <TableCell sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {users.map((user, index) => (
                    <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.fullName || "—"}</TableCell>
                    <TableCell>{user.email || "—"}</TableCell>
                    <TableCell>{user.createdAt || "—"}</TableCell>
                    <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
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
