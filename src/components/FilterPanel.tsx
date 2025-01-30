import { Box, FormGroup, FormControlLabel, Checkbox, Slide, Typography, IconButton } from "@mui/material";
import { X } from "lucide-react";

interface FilterPanelProps {
  showFilter: boolean;
  onClose: () => void;
  filters: { sortByYear: boolean; sortByRides: boolean; sortByClass: boolean };
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ showFilter, onClose, filters, onFilterChange }) => {
  return (
    <Slide direction="up" in={showFilter} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#F5F7FA",
          borderTop: "1px solid",
          borderColor: "divider",
          boxShadow: 3,
          p: 3,
          borderRadius:10,
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <X size={20} />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Sort by
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.sortByYear}
                onChange={onFilterChange}
                name="sortByYear"
              />
            }
            label="Year"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.sortByRides}
                onChange={onFilterChange}
                name="sortByRides"
              />
            }
            label="Number of Rides"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.sortByClass}
                onChange={onFilterChange}
                name="sortByClass"
              />
            }
            label="Class"
          />
        </FormGroup>
      </Box>
    </Slide>
  );
};

export default FilterPanel;
