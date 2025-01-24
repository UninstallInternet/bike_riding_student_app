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
import { LockIcon } from "lucide-react";
import { useState } from "react";

export default function ResetPassword() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendResetLink = () => {
    // Simulate sending the reset link
    // Toggle the dialog visibility
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
            Please choose a new password.{" "}
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
              type="password"
              placeholder="Enter your new password"
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
              placeholder="Confirm your new password"
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
                Save Password
              </Typography>{" "}
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText>
           Your password has been succesfully reset!
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
