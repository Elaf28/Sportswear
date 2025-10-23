import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (!userData)
    return (
      <Typography textAlign="center" mt={8} color="text.secondary">
        No profile data found.
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 50px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: " #f5faff",
        p: 4,
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          p: 3,
          backgroundColor: "primary.main",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "secondary.main",
              color:"primary.main",
              fontSize: 36,
              mb: 2,
            }}
          >
            {userData.fullName
              ? userData.fullName[0].toUpperCase()
              : <PersonIcon fontSize="large" />}
          </Avatar>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
          >
            {userData.fullName || "No name provided"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }}  color="white" />

        <CardContent sx={{ px: 2 }}>
          <Box display="flex" alignItems="center" mb={1.5}>
            <PersonIcon sx={{ color: "secondary.main", mr: 1 }} />
            <Typography variant="body1"  color="white">
              <strong>Name:</strong> {userData.fullName || "No name provided"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1.5}>
            <EmailIcon sx={{ color: "secondary.main", mr: 1 }} />
            <Typography variant="body1"  color="white">
              <strong>Email:</strong> {userData.email}
            </Typography>
          </Box>

          {userData.createdAt && (
            <Box display="flex" alignItems="center">
              <CalendarTodayIcon  sx={{ color: "secondary.main", mr: 1 }} />
              <Typography variant="body1" color="white">
                <strong>Joined:</strong>{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
