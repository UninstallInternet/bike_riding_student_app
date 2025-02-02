import { useState } from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Slide, Typography, IconButton } from "@mui/material";
import { X, ChevronUp, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  showFilter: boolean;
  onClose: () => void;
  filters: { 
    sortByYear: boolean; 
    sortByRides: boolean; 
    sortByClass: boolean; 
  };
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement> & { target: { sortDirection?: 'asc' | 'desc' }}) => void;
}

type SortKey = 'sortByYear' | 'sortByRides' | 'sortByClass';
type SortDirections = Record<SortKey, 'asc' | 'desc'>;

const FilterPanel: React.FC<FilterPanelProps> = ({ showFilter, onClose, filters, onFilterChange }) => {
  const [sortDirections, setSortDirections] = useState<SortDirections>({
    sortByYear: 'asc',
    sortByRides: 'asc',
    sortByClass: 'asc'
  });

  const handleSortDirectionToggle = (filterName: SortKey) => {
    const newDirection = sortDirections[filterName] === 'asc' ? 'desc' : 'asc';
    setSortDirections(prev => ({
      ...prev,
      [filterName]: newDirection
    }));

    const syntheticEvent = {
      target: {
        name: filterName,
        checked: filters[filterName],
        sortDirection: newDirection
      }
    } as React.ChangeEvent<HTMLInputElement> & { target: { sortDirection: 'asc' | 'desc' }};
    
    onFilterChange(syntheticEvent);
  };

  const renderSortItems = () => {
    const sortItems: { key: SortKey; label: string }[] = [
      { key: 'sortByYear', label: 'Year' },
      { key: 'sortByRides', label: 'Number of Rides' },
      { key: 'sortByClass', label: 'Class' }
    ];

    return sortItems.map(({ key, label }) => (
      <Box
        key={key}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '75%',
          mb: 1
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={filters[key]}
              onChange={(e) => onFilterChange({
                ...e,
                target: {
                  ...e.target,
                  name: key,
                  checked: e.target.checked,
                  sortDirection: sortDirections[key]
                }
              })}
              name={key}
            />
          }
          label={label}
        />
        {filters[key] && (
          <IconButton
            onClick={() => handleSortDirectionToggle(key)}
            size="small"
            sx={{
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {sortDirections[key] === 'asc' ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </IconButton>
        )}
      </Box>
    ));
  };

  return (
    <Slide direction="up" in={showFilter} mountOnEnter unmountOnExit>
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
            width:30,
            right: 8,
          }}
        >
          <X size={20} />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Sort by
        </Typography>

        <FormGroup sx={{ width: '100%' }}>
          {renderSortItems()}
        </FormGroup>
      </Box>
    </Slide>
  );
};

export default FilterPanel;