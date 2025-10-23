import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(3, "Full name is required"),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  // 🟢 submit handler
  const onSubmit = async (data) => {
    try {
      // 1️⃣ إنشاء المستخدم في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 2️⃣ حفظ بيانات إضافية في Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName: data.fullName,
            email: data.email,
            createdAt: new Date().toISOString(),
        });


      // 3️⃣ حفظ بيانات المستخدم في localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          fullName: data.fullName,
        })
      );

      // 4️⃣ إخطار الـ Navbar إن في تغيير في الحالة
      window.dispatchEvent(new Event("storage"));

      // 5️⃣ تنبيه وعودة للصفحة الرئيسية
      toast.success("User registered successfully 🎉");
      navigate("/login"); // ← الانتقال إلى الصفحة الرئيسية
    } catch (error) {
      toast.error(error.message);
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
      py={2}
    >
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

      <Grid size={{ xs: 12, md: 6 }} py={0} my={0}>
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
            REGISTER
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
          >
            {/* Full Name */}
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                label="Full Name"
                variant="outlined"
                id="fullName"
                type="text"
                {...register("fullName")}
                style={{ width: "100%", marginTop: "5px" }}
              />
              {errors.fullName && (
                <p style={{ color: "red", margin: "5px 0 0" }}>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <TextField
                label="Email"
                variant="outlined"
                id="email"
                type="email"
                {...register("email")}
                style={{ width: "100%", marginTop: "5px" }}
              />
              {errors.email && (
                <p style={{ color: "red", margin: "5px 0 0" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <TextField
                label="Password"
                variant="outlined"
                id="password"
                type="password"
                {...register("password")}
                style={{ width: "100%", marginTop: "5px" }}
              />
              {errors.password && (
                <p style={{ color: "red", margin: "5px 0 0" }}>
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
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Already have account?
              <a
                href="/login"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                {" "}
                Sign in
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
