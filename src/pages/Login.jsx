import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // 1️⃣ تسجيل الدخول
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 2️⃣ التحقق من أن المستخدم إدمن
      const docRef = doc(db, "admins", user.uid);
      const docSnap = await getDoc(docRef);

      // 3️⃣ حفظ البيانات في localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: docSnap.exists() && docSnap.data().role === "admin" ? "admin" : "user",
        })
      );

      // 4️⃣ إشعار تسجيل الدخول
      window.dispatchEvent(new Event("user-login"));

      // 5️⃣ التوجيه
      if (docSnap.exists() && docSnap.data().role === "admin") {
        toast.success("Welcome Admin 🛍️");
        navigate("/admin/dashboard");
      } else {
        toast.success("Login successful 👟");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ minHeight: "100vh" }}
      direction={{ xs: "column", md: "row" }}
      display="flex"
      justifyContent={"center"}
      alignItems="center"
    >
      {/* LEFT SIDE */}
      <Grid
        size={{ xs: 12, md: 6 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={3}
      >
        <div style={{ textAlign: "center" }}>
          <h3 className="logo auth-logo">Athletica</h3>
          <img src={logo} alt="" style={{ width: "150px" }} />
        </div>
      </Grid>

      {/* RIGHT SIDE */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          gap={3}
          px={5}
        >
          <Typography
            variant="h5"
            style={{
              color: "var(--tertiary-color)",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            LOGIN
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
          >
            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                {...register("email")}
                style={{ width: "100%" }}
              />
              {errors.email && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                {...register("password")}
                style={{ width: "100%" }}
              />
              {errors.password && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "var(--tertiary-color)",
                width: "100%",
                padding: "10px",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#1976d2" }}>
                Sign Up
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
