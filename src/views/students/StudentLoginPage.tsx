import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { LogInIcon } from "lucide-react";
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function StudentLoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate("/student/dashboard");
      return null;
    }
  };

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
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {message && (
              <Typography
                color="error"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                {message}
              </Typography>
            )}
            <TextField
              fullWidth
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
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
              {loading ? "Logging in..." : "Login"}
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
