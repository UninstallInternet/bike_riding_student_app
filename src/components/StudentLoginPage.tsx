"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LogInIcon } from "lucide-react";
import { Link } from "react-router-dom";
export default function StudentLoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography variant="h6" component="h1">
            Student login
          </Typography>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#EBF5FF",
              borderRadius: "50%",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogInIcon size={32} color="#3B82F6" />
          </Paper>

          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            Login to Your Account
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your credentials to access your dashboard.
          </Typography>

          <Box
            component="form"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Email or Username"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#34D399",
                "&:hover": {
                  bgcolor: "#10B981",
                },
                borderRadius: "100px",
                py: 1.5,
                mt: 1,
              }}
            >
              Login
            </Button>

            <Link
              to="/login/reset"
              style={{
                color: "#121212",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              <Typography variant="body2" sx={{ mb: 2 }}>
                Forgot Password? Reset
              </Typography>{" "}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
