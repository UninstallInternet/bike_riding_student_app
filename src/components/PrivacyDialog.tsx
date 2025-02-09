import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Link } from "@mui/material"
import { Check } from "lucide-react"

interface PrivacyDialogProps {
  open: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
}

export default function PrivacyDialog({ open, onClose, onAccept, onDecline }: PrivacyDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxWidth: "320px",
          m: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#F3F4F6",
            mb: 2,
          }}
        >
          <Check size={24} color="#6B7280" />
        </Box>

        <DialogTitle
          sx={{
            p: 0,
            mb: 1,
            textAlign: "center",
            fontSize: "1.25rem",
            fontWeight: 500,
          }}
        >
          Accept Privacy Policy?
        </DialogTitle>

        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ px: 1 }}>
            Do you accept the{" "}
            <Link href="#" underline="hover" sx={{ color: "inherit" }}>
              Privacy Policy
            </Link>{" "}
            to share data with your school and teachers? Your data will not be used outside of the application.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            p: 0,
            mb: 3,
            width: "100%",
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            onClick={onDecline}
            sx={{
              flex: 1,
              color: "#EF4444",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.04)",
              },
            }}
          >
            Decline
          </Button>
          <Button
            onClick={onAccept}
            sx={{
              flex: 1,
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

