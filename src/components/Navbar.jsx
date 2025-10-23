import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const categories = [
  "Home",
  "Men",
  "Women",
  "Kids",
  "Equipment",
  "Bags & Accessories",
];

export default function Navbar() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category");
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", updateUser);
    window.addEventListener("user-login", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("user-login", updateUser);
    };
  }, []);

  // 🔹 Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(17, 81, 115, 0.3)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            className="logo"
            variant="h5"
            noWrap
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              cursor: "pointer",
              fontFamily: "Lobster, sans-serif",
              fontSize: { xs: "1.5rem", md: "2.5rem" },
            }}
            onClick={() => navigate("/")}
          >
            Athletica
          </Typography>

          {/* Desktop menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 2,
            }}
          >
            {categories.map((cat) => {
              const isActive =
                (cat === "Home" && location.pathname === "/") ||
                (cat !== "Home" && activeCategory === cat);

              return (
                <Button
                  key={cat}
                  onClick={() =>
                    cat === "Home"
                      ? navigate("/")
                      : navigate(`/products?category=${encodeURIComponent(cat)}`)
                  }
                  sx={{
                    color: isActive ? "primary.main" : "black",
                    fontWeight: isActive ? "bold" : 500,
                    borderBottom: isActive
                      ? "2px solid #115173"
                      : "2px solid transparent",
                    borderRadius: 0,
                    "&:hover": {
                      color: "primary.main",
                      borderBottom: "2px solid #115173",
                    },
                  }}
                >
                  {cat}
                </Button>
              );
            })}
          </Box>

          {/* Right side (icons + login/logout) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.8, sm: 1.2, md: 2 },
              flexShrink: 0,
            }}
          >
            {/* Mobile Menu */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={handleOpenNavMenu}>
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {categories.map((cat) => (
                  <MenuItem
                    key={cat}
                    onClick={() => {
                      handleCloseNavMenu();
                      cat === "Home"
                        ? navigate("/")
                        : navigate(
                            `/products?category=${encodeURIComponent(cat)}`
                          );
                    }}
                  >
                    <Typography textAlign="center">{cat}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {user && (
              <>
                <IconButton onClick={() => navigate("/favorites")}>
                  <FavoriteBorderIcon sx={{ color: "black" }} />
                </IconButton>
                <IconButton onClick={() => navigate("/cart")}>
                  <ShoppingCartOutlinedIcon sx={{ color: "black" }} />
                </IconButton>
                <IconButton onClick={() => navigate("/profile")}>
                  <AccountCircleIcon sx={{ color: "black" }} />
                </IconButton>
              </>
            )}

            {!user ? (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  sx={{ color: "black", textTransform: "none" }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "white",
                    backgroundColor: "#115173",
                    "&:hover": { backgroundColor: "#0e3f59" },
                    textTransform: "none",
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                sx={{
                  color: "white",
                  backgroundColor: "#115173",
                  "&:hover": { backgroundColor: "#0e3f59" },
                  textTransform: "none",
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
