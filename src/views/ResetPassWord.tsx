"use client";

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
import { CircleCheckBig, LockIcon } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase"; 
export default function ResetPassword() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Error updating password:", error.message);
        setErrorMessage(error.message);
      } else {
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewPassword(""); 
    setNewPasswordConfirm(""); 
    setErrorMessage(null);
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
            Set a New Password
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
            <LockIcon size={32} color="#3B82F6" />
          </Paper>

          <Typography
            variant="body2"
            fontWeight="medium"
            color="text.black"
            sx={{ mb: 2, width: "334px" }}
          >
            Please choose a new password.
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
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              type="password"
              value={newPassword}
              placeholder="Enter your new password"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              fullWidth
              type="password"
              value={newPasswordConfirm}
              placeholder="Confirm your new password"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ textAlign: "center" }}>
                {errorMessage}
              </Typography>
            )}
            <Button
              onClick={handleResetPassword}
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
                Save Password
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
              fontWeight: 400,
              fontSize: 24,
              color: "black",
              textAlign: "center",
            }}
          >
            Your password has been successfully reset!
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 400, color: "text.secondary" }}>
            You can now log in using your new password.
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
