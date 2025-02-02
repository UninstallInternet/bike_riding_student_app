import { Dialog, DialogContent, DialogContentText, DialogActions, Button, Typography } from "@mui/material";
import { UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DeactivateDialogProps {
  isDeactivateDialogOpen: boolean;
  setIsDeactivateDialogOpen: (value: boolean) => void;
  deactivateStudents: (studentIds: string[]) => Promise<boolean>; // Match the actual return type
  studentId?: string;
}

function DeactivateDialog({
  isDeactivateDialogOpen,
  setIsDeactivateDialogOpen,
  deactivateStudents,
  studentId,
}: DeactivateDialogProps) {
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    if (studentId) {
      await deactivateStudents([studentId]);
      setIsDeactivateDialogOpen(false);
      navigate("/dashboard");
    }
  };

  return (
    <Dialog
      slotProps={{
        paper: { sx: { borderRadius: "28px" } },
      }}
      open={isDeactivateDialogOpen}
      onClose={() => setIsDeactivateDialogOpen(false)}
      sx={{ borderRadius: "28px" }}
    >
      <DialogContent
        sx={{
          width: 300,
          height: 185,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <UserMinus size={48} color="#718EBF" />
        <DialogContentText
          sx={{
            fontSize: 18,
            fontWeight: 400,
            color: "black",
            textAlign: "center",
          }}
        >
          Are you sure you want to deactivate this student? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDeactivateDialogOpen(false)} autoFocus>
          <Typography sx={{ color: "#737373" }}>Cancel</Typography>
        </Button>
        <Button onClick={handleDeactivate} autoFocus>
          <Typography sx={{ color: "black" }}>Yes</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeactivateDialog;
