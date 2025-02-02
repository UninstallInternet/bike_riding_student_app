import {
  Box,
  Slide,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { X, Trash, Download, UserMinus } from "lucide-react";

interface ManagePanelProps {
  showManagePanel: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onExportCsv: () => void;
  selectedStudentsCount: number;
}

const ManagePanel: React.FC<ManagePanelProps> = ({
  showManagePanel,
  onClose,
  onDeactivate,
  onDelete,
  onExportCsv,
  selectedStudentsCount,
}) => {
  return (
    <Slide direction="up" in={showManagePanel} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: -10,
          left: 0,
          right: 0,
          bgcolor: "#F5F7FA",
          borderTop: "1px solid",
          borderColor: "divider",
          boxShadow: 3,
          p: 3,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor:"pointer"
          }}
        >
          <X size={20} />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Manage Students
        </Typography>

        <Stack
          direction="column"
          spacing={2}
          sx={{ mt: 3, justifyContent: "left" }}
        >
          <IconButton
            onClick={onExportCsv}
            sx={{
              display: "flex",
              
              alignItems: "center",
              gap: 1,
              justifyContent: "flex-start",
              p: 0,
              "&:hover": {
                backgroundColor: "transparent", 
              },

            }}
          >
            <Download size={20} />
            <Typography color="#121212">Export Students</Typography>
          </IconButton>

          <IconButton
            onClick={onDeactivate}
            disabled={selectedStudentsCount === 0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "flex-start",
              p: 0,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <UserMinus size={20} />
            <Typography color="#121212">Deactivate</Typography>
          </IconButton>

          <IconButton
            onClick={onDelete}
            disabled={selectedStudentsCount === 0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "flex-start",
              p: 0,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Trash size={20} />
            <Typography color="#121212">Delete</Typography>
          </IconButton>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          {selectedStudentsCount} student(s) selected
        </Typography>
      </Box>
    </Slide>
  );
};

export default ManagePanel;