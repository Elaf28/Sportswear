// src/components/Footer/Footer.jsx
import React from "react";
import { Box, Typography, Link, Grid, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, Twitter, Email, Phone } from "@mui/icons-material";

export default function Footer() {
    return (
        <Box sx={{color: "#d4d3d3ff",background:"var(--primary-color)", pt: 6, pb: 3, px: { xs: 3, md: 8 },}}>
        <Grid container spacing={6}  display="flex"  alignItems="flex-start" justifyContent="space-around">
            {/* Brand Info */}
            <Grid item xs={12} md={4}>
            <Typography
            className="logo"
                variant="h4"
                sx={{
                fontWeight: "bold",
                fontFamily: "Lobster, cursive",
                mb: 1,
                color: "var(--secondary-color)",
                textShadow: "none",
                }}
            >
                Athletica
            </Typography>
            <Typography variant="body2" sx={{ color: "#d4d3d3ff", lineHeight: 1.6 }}>
                Athletica offers high-quality sportswear and accessories designed <br />
                for comfort, performance, and style. Empower your workouts with <br />
                confidence.
            </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                { label: "Home", path: "/" },
                { label: "Men", path: "/products?category=Men" },
                { label: "Women", path: "/products?category=Women" },
                { label: "Kids", path: "/products?category=Kids" },
                { label: "Equipment", path: "/products?category=Equipment" },
                { label: "Cart", path: "/cart" },
                ].map((link) => (
                <Link
                    key={link.label}
                    href={link.path}
                    sx={{
                    color: "#d4d3d3ff",
                    textDecoration: "none",
                    "&:hover": { transform: "scale(1.05)" },
                    }}
                >
                    {link.label}
                </Link>
                ))}
            </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Contact Us
            </Typography>
            <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
                <Email sx={{ mr: 1, fontSize: 20 }} /> athletica@gmail.com
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton  style={{color:"var(--tertiary-color)"}} href="https://facebook.com" target="_blank">
                <Facebook />
                </IconButton>
                <IconButton style={{color:"var(--tertiary-color)"}} href="https://instagram.com" target="_blank">
                <Instagram />
                </IconButton>
                <IconButton style={{color:"var(--tertiary-color)"}} href="https://twitter.com" target="_blank">
                <Twitter />
                </IconButton>
            </Box>
            </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ backgroundColor: "primary.main", my: 4 }} />

        {/* Footer Bottom */}
        <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#acababff", letterSpacing: 0.5 }}
        >
            © {new Date().getFullYear()} Athletica. All rights reserved.
        </Typography>
        </Box>
    );
    }

    
