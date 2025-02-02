import {
  Box,
  Slide,
  Typography,
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Alert,
} from "@mui/material";
import { X, Download } from "lucide-react";
import { useState } from "react";
import { classes } from "../lib/staticConsts";

interface ExportPanelProps {
  showExportPanel: boolean;
  onClose: () => void;
  onExportCsv: (fields: string[], filters: { classFilter?: string }) => void;
  selectedStudentsCount: number;
  error?: string;
  clearError: () => void; 
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  showExportPanel,
  onClose,
  onExportCsv,
  selectedStudentsCount,
  error,
  clearError,
}) => {
  const [includeName, setIncludeName] = useState(true);
  const [includeClass, setIncludeClass] = useState(true);
  const [classFilter, setClassFilter] = useState("");
  const [fileType, setFileType] = useState("csv");
  const [fileError, setFileError] = useState<string | null>(null);

  const handleExport = () => {
    if (fileType === "csv") {
      const fields = [];
      if (includeName) fields.push("name");
      if (includeClass) fields.push("class");
      setFileError("");
      onExportCsv(fields, { classFilter: classFilter.trim() || undefined });
    } else {
      setFileError("Selected file type is not supported yet");
    }
  };

  return (
    <Slide direction="up" in={showExportPanel} mountOnEnter unmountOnExit>
      <Box
        sx={{
          maxHeight: 430,
          position: "fixed",
          bottom: -5,
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
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Export Students ({selectedStudentsCount})
        </Typography>
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              mb:1,
              alignItems: "center",
            }}
          >
            {error}
            <IconButton size="small" onClick={clearError}>
              <X size={16} color="black" />
            </IconButton>
          </Alert>
        )}
        {fileError && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              display: "flex",
              flexDirection: "row",
            }}
          >
            {fileError}
            <IconButton
              sx={{ alignSelf: "end" }}
              size="small"
              onClick={() => setFileError(null)}
            >
              <X size={16} color="black" />
            </IconButton>
          </Alert>
        )}

        <Stack
          direction="column"
          spacing={1}
          sx={{ mt: 0.5, justifyContent: "left" }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={includeName}
                onChange={(e) => setIncludeName(e.target.checked)}
              />
            }
            label="Include Name"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={includeClass}
                onChange={(e) => setIncludeClass(e.target.checked)}
              />
            }
            label="Include Class"
          />

          <FormControl fullWidth>
            <InputLabel>Class</InputLabel>
            <Select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              label="Class"
            >
              <MenuItem value="">All Classes</MenuItem>
              {classes.map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Choose File Type</InputLabel>
            <Select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              label="Choose File Type"
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>

          <Button
            onClick={handleExport}
            variant="contained"
            sx={{ mb: 0.5 }}
            startIcon={<Download size={20} />}
          >
            Export Students
          </Button>
        </Stack>
      </Box>
    </Slide>
  );
};

export default ExportPanel;
