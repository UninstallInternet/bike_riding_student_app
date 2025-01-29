import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LogInIcon } from "lucide-react";
import { useState } from "react";
import { CircleCheckBig } from "lucide-react";
import { supabase } from "../lib/supabase";

const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export default function SendResetLink() {
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailError, setEmailError] = useState(false); 

  const handleSendResetLink = async () => {
    if (!isValidEmail(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/login/passwordreset",
    });

    if (error) {
      console.error("Error sending password reset email:", error.message);
    } else {
      console.log("Password reset email sent");
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "50vh",
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
            Reset Your Password
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

          <Typography
            variant="body2"
            fontWeight="medium"
            color="text.black"
            sx={{ mb: 2, width: "334px" }}
          >
            Please enter the email address linked to your account. We will send
            you a link to reset your password.
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
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={
                emailError ? "Please enter a valid email address" : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              onClick={handleSendResetLink}
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
              <Typography variant="body2" sx={{ color: "white" }}>
                Send Reset Link
              </Typography>
            </Button>
          </Box>
        </Box>
      </Container>

      <Dialog
        slotProps={{
          paper: { sx: { borderRadius: "28px" } },
        }}
        open={isDialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogContent
          sx={{
            width: 324,
            height: 210,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <CircleCheckBig size={48} color="#718EBF" />
          <DialogContentText
            sx={{
              fontSize: 18,
              fontWeight: 500,
              color: "black",
              textAlign: "center",
            }}
          >
            A request link has been sent to your email.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
