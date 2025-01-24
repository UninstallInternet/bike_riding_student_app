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
import { LogInIcon } from "lucide-react";
import { useState } from "react";

export default function SendResetLink() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendResetLink = () => {
    setIsDialogOpen(true);
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
            you a link to reset your password.{" "}
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
              {" "}
              <Typography variant="body2" sx={{ color: "white" }}>
                Send Reset Link
              </Typography>{" "}
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText>
            A request link has been sent to your email. Please check your inbox
            to reset your password.
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
