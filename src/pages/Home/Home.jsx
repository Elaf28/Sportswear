import React from "react";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import heroImg from "../../assets/hero.jpg";
import men from "../../assets/men.jpg";
import women from "../../assets/women.jpg";
import kids from "../../assets/kids.jpg";
import bags from "../../assets/bags.png";
import equipment from "../../assets/accessories.jpg";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const categories = [
        { name: "Men", img: men },
        { name: "Women", img: women },
        { name: "Kids", img: kids },
        { name: "Equipment", img: equipment },
        { name: "Bags & Accessories", img: bags },
    ];

    return (
        <Box>
        {/* Hero Section */}
        <Box
            sx={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: "60vh", md: "80vh" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            }}
        >
            <Box
            sx={{
                backgroundColor: "rgba(5, 63, 94, 0.7)",
                width: "100%",
                height: "100%",
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            >
            <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: "var(--secondary-color)" }}
            >
                Begin your fitness journey today
            </Typography>
            <Typography variant="h6" mt={2} mb={3}>
                Train smart, move freely, and conquer every challenge.
            </Typography>

            <Button
                variant="contained"
                sx={{
                backgroundColor: "var(--secondary-color)",
                color: "var(--primary-color)",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                "&:hover": { backgroundColor: "#bfff00d2" },
                }}
                onClick={() => navigate("/products")}
            >
                Shop Now
            </Button>
            </Box>
        </Box>

        {/* Featured Categories */}
        <Box sx={{ py: 8, px: { xs: 2, md: 6 }, textAlign: "center" }}>
            <Typography
            variant="h4"
            fontWeight="bold"
            mb={5}
            sx={{
                color: "var(--primary-color)",
                textTransform: "uppercase",
                letterSpacing: "2px",
            }}
            >
            Featured Categories
            </Typography>

            <Grid container spacing={3} justifyContent="center">
            {categories.map((cat, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Box
                    sx={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    height: { xs: 180, sm: 220, md: 250 },
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    },
                    }}
                    onClick={() =>
                    navigate(`/products?category=${encodeURIComponent(cat.name)}`)
                    }
                >
                    <img
                    src={cat.img}
                    alt={cat.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(75%)",
                    }}
                    />
                    <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    >
                    <Typography
                        variant="h6"
                        sx={{
                        color: "white",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        textShadow: "0 3px 8px rgba(0,0,0,0.5)",
                        transition: "0.3s",
                        "&:hover": { color: "var(--secondary-color)" },
                        }}
                    >
                        {cat.name}
                    </Typography>
                    </Box>
                </Box>
                </Grid>
            ))}
            </Grid>
        </Box>

        {/* Newsletter */}
        <Box
            sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "var(--primary-color)",
            color: "white",
            }}
        >
            <Typography
            variant="h4"
            fontWeight="bold"
            mb={2}
            color="var(--secondary-color)"
            >
            Join Our Newsletter
            </Typography>
            <Typography mb={4}>
            Get updates on new arrivals and special offers!
            </Typography>

            <Box
            component="form"
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                px: 3,
            }}
            >
            <TextField
                placeholder="Enter your email"
                variant="outlined"
                sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                width: { xs: "100%", sm: "350px" },
                }}
            />
            <Button
                variant="contained"
                sx={{
                backgroundColor: "var(--secondary-color)",
                color: "var(--primary-color)",
                fontWeight: "bold",
                px: 4,
                "&:hover": { backgroundColor: "#bfff00d2" },
                }}
            >
                Subscribe
            </Button>
            </Box>
        </Box>
        </Box>
    );
}
