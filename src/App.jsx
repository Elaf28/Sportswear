// import React from 'react'
// import { Routes, Route } from "react-router-dom";
// import Register from './pages/Register.jsx';
// import Login from './pages/Login.jsx';
// import Home from './pages/Home/Home.jsx';
// import ProductsPage from './pages/ProductsPage/ProductsPage.jsx';
// import { ToastContainer } from "react-toastify";
// import { createTheme , ThemeProvider} from '@mui/material/styles';
// import Navbar from './components/Navbar.jsx';
// import Profile from './pages/Profile.jsx';
// import Favorites from './pages/Favorites.jsx';
// import Cart from './pages/Cart.jsx';
// import ProductDetails from './pages/ProductDetails.jsx';
// import Footer from './components/Footer.jsx';

// export default function App() {
//   const theme = createTheme({
//   palette: {
//     primary: {
//       main:'#115173',
//     },
//     secondary: {
//       main: '#BFFF00',
//     },
//   },
// });
//   return (
//     <ThemeProvider theme={theme}>
//     <Navbar/>
//     <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Home/>} />
//         <Route path="/products" element={<ProductsPage/>} />
//         <Route path="/profile" element={<Profile/>} />
//         <Route path="/favorites" element={<Favorites/>} />
//         <Route path="/cart" element={<Cart/>} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//       </Routes>
//       <Footer/>
//       <ToastContainer position="top-right" autoClose={2000} />
//     </ThemeProvider>
//   )
// }








import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import ProductsPage from "./pages/ProductsPage/ProductsPage.jsx";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "./components/Navbar.jsx";
import Profile from "./pages/Profile.jsx";
import Favorites from "./pages/Favorites.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Footer from "./components/Footer.jsx";

import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import EditProduct from "./pages/Admin/EditProduct.jsx";
import AddProduct from "./pages/Admin/AddProduct.jsx";

export default function App() {
  const theme = createTheme({
    palette: {
      primary: { main: "#115173" },
      secondary: { main: "#BFFF00" },
    },
  });

  // 🔹 نستخدم useLocation علشان نعرف المسار الحالي
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ThemeProvider theme={theme}>
      {/* 🔸 Navbar/Footer يظهروا فقط لو مش في صفحة أدمن */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<ProtectedAdminRoute element={AdminLayout} />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="users" element={<AdminUsers/>} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}

      <ToastContainer position="top-right" autoClose={2000} />
    </ThemeProvider>
  );
}

