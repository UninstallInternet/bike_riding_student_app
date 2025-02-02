import { Button, Typography } from "@mui/material";
import { UserMinus } from "lucide-react";

interface DeactivateButtonProps {
  setIsDeactivateDialogOpen: (value: boolean) => void;
}

function DeactivateButton({ setIsDeactivateDialogOpen }: DeactivateButtonProps) {
  return (
    <Button
      type="submit"
      variant="contained"
      onClick={() => setIsDeactivateDialogOpen(true)}
      sx={{
        bgcolor: "#35D187",
        color: "white",
        position: "sticky",
        py: 2,
        mt: 2,
        px: 1,
        borderRadius: 3,
        right: -320,
        textTransform: "none",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          bgcolor: "#2bb974",
        },
      }}
    >
      <UserMinus size={18} />
      <Typography sx={{ marginLeft: 1 }}>Deactivate Student</Typography>
    </Button>
  );
}

export default DeactivateButton;
