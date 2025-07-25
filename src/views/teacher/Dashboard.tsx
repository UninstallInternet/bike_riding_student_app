import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {
  Filter as FilterList,
  Search,
  ChevronUp,
  Trash2,
  UserMinus,
  X,
  User,
  Bike,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  deactivateStudents,
  deleteStudents,
  exportStudentsCsv,
  fetchTeacher,
  fetchStudents,
  Student,
  Teacher,
} from "../../lib/api";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Chip,
  Collapse,
  TextField,
  useMediaQuery,
} from "@mui/material";
import FilterPanel from "../../components/FilterPanel";
import ManagePanel from "../../components/ManagePanel";
import ExportPanel from "../../components/ExportPanel";
import { TeacherToolbar } from "../../components/TeacherToolbar";

export default function TeacherDashboard() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const studentsRef = useRef<Student[]>([]);
  const isSmallScreen = useMediaQuery("(max-width:440px)");

  const [filters, setFilters] = useState({
    sortByYear: false,
    sortByRides: false,
    sortByClass: false,
    classFilter: "",
  });

  const [sortDirections, setSortDirections] = useState({
    sortByYear: "asc",
    sortByRides: "asc",
    sortByClass: "asc",
  });

  const [rideFilter] = useState<{ minRides: number; maxRides: number }>({
    minRides: 0,
    maxRides: Infinity,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        studentsRef.current = data;
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    fetchTeacher().then((data) => setTeacher(data as Teacher));
  }, []);

  useEffect(() => {
    let result = [...studentsRef.current];

    if (activeFilter !== null) {
      result = result.filter((student) => student.is_active === activeFilter);
    }

    if (filters.classFilter) {
      result = result.filter(
        (student) => student.class === filters.classFilter
      );
    }

    if (searchQuery) {
      result = result.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = result.filter((student) => {
      const totalRides = student.ride_count * student.distance_to_school;
      return (
        totalRides >= rideFilter.minRides && totalRides <= rideFilter.maxRides
      );
    });

    if (filters.sortByClass) {
      result = result.sort((a, b) => {
        const comparison = a.class.localeCompare(b.class);
        return sortDirections.sortByClass === "asc" ? comparison : -comparison;
      });
    }

    if (filters.sortByYear) {
      result = result.sort((a, b) => {
        const comparison = a.starting_year - b.starting_year;
        return sortDirections.sortByYear === "asc" ? comparison : -comparison;
      });
    }

    if (filters.sortByRides) {
      result = result.sort((a, b) => {
        const comparison = b.ride_count - a.ride_count;
        return sortDirections.sortByRides === "asc" ? comparison : -comparison;
      });
    }

    setFilteredStudents(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, searchQuery, filters, rideFilter]);

  const handleToggle = (value: string) => () => {
    const currentIndex = selectedStudents.indexOf(value);
    const newChecked = [...selectedStudents];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedStudents(newChecked);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleAction = async (
    action: string,
    fields?: string[],
    filters?: { classFilter?: string }
  ) => {
    let result;
    try {
      switch (action) {
        case "delete":
          result = await deleteStudents(selectedStudents);
          setIsDeleteDialogOpen(false);
          break;
        case "deactivate":
          result = await deactivateStudents(selectedStudents);
          setIsDeactivateDialogOpen(false);
          break;
        case "export":
          if (
            (!selectedStudents || selectedStudents.length === 0) &&
            !filters?.classFilter
          ) {
            throw new Error("Provide either students or a class filter");
          }
          result = await exportStudentsCsv(
            selectedStudents,
            fields as string[],
            filters?.classFilter
          );
          setError("");

          break;
      }

      if (result) {
        fetchStudents().then((data) => setFilteredStudents(data));
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      handleMenuClose();
    }
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery("");
    }
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleManageClick = () => {
    setShowManage(!showManage);
  };
  const handleExportPanelClick = () => {
    setShowExportPanel(!showExportPanel);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement> & {
      target: {
        name: string;
        checked: boolean;
        sortDirection?: "asc" | "desc";
        value?: string;
      };
    }
  ) => {
    const { name, checked, sortDirection, value } = event.target;

    if (name === "classFilter") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value || "",
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked,
      }));

      if (sortDirection) {
        setSortDirections((prev) => ({
          ...prev,
          [name]: sortDirection,
        }));
      }
    }
  };
  const clearError = () => setError(undefined);

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      const allStudentIds = filteredStudents.map((student) =>
        student.id.toString()
      );
      setSelectedStudents(allStudentIds);
    }
  };

  return (
    <Box
      sx={{
        pb: { xs: 3, sm: 7 },
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        width: "95%",
        margin: "auto",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          p: 0.5,
        }}
      > 
        <TeacherToolbar title="Teacher Dashboard" showBackArrow={false} />
        
      </AppBar>
      <Container>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 1,
            fontWeight: 500,
            textAlign: "left",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          Welcome, Mr. {teacher?.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            component="h2"
            sx={{ fontWeight: 500 }}
          >
            Manage students
          </Typography>
          <Box
            sx={{
              width: 55,
              bgcolor: "#718EBF",
              color: "primary.main",
              px: 0.5,
              py: 0.5,
              borderRadius: 16,
              fontSize: "0.875rem",
            }}
          >
            <Typography
              color="white"
              sx={{ fontSize: isSmallScreen ? "12px" : "14px" }}
            >
              {filteredStudents.length} users
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleFilterClick}
            sx={{
              bgcolor: activeFilter !== null ? "primary.light" : "transparent",
            }}
          >
            <FilterList size={20} />
          </IconButton>
          <FilterPanel
            showFilter={showFilter}
            onClose={handleFilterClick}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {activeFilter !== null && (
            <Chip
              label={activeFilter ? "Active" : "Inactive"}
              onDelete={() => setActiveFilter(null)}
              size="small"
              color="primary"
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="small"
            onClick={handleSearchClick}
            sx={{
              bgcolor: showSearch ? "primary.light" : "transparent",
            }}
          >
            <Search size={20} />
          </IconButton>
        </Box>

        <Collapse in={showSearch} timeout="auto">
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                endAdornment: searchQuery ? (
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <X size={16} />
                  </IconButton>
                ) : null,
              }}
            />
          </Box>
        </Collapse>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid",
            pb: 0.5,
            borderColor: "divider",
          }}
        >
          {" "}
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectAll}
            sx={{
              textTransform: "none",
              borderRadius: "16px",
              width: 90,
              fontSize: 14,
              maxHeight: 12,
              px: 1,
            }}
          >
            {selectedStudents.length === filteredStudents.length
              ? "Deselect"
              : "Select All"}
          </Button>
        </Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress sx={{ color: "#35D187" }} />
          </Box>
        ) : (
          <List sx={{ bgcolor: "background.paper" }}>
            {filteredStudents.map((student) => (
              <ListItem key={student.id} disablePadding>
                <ListItemButton
                  onClick={handleToggle(student.id.toString())}
                  dense
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    m: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                      <Checkbox
                        edge="start"
                        checked={
                          selectedStudents.indexOf(student.id.toString()) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        size="small"
                      />
                    </ListItemIcon>
                    <Link
                      to={`/student/${student.id}`}
                      style={{ textDecoration: "none", flex: 1, minWidth: 0 }}
                    >
                      <ListItemText
                        primary={student.name}
                        slotProps={{
                          primary: {
                            noWrap: true,
                            sx: {
                              fontSize: isSmallScreen ? "0.875rem" : "1rem",
                            },
                          },
                        }}
                      />
                    </Link>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      ml: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isSmallScreen ? "0.75rem" : "0.875rem" }}
                    >
                      Class: {student.class}
                    </Typography>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: student.is_active
                          ? "success.main"
                          : "text.disabled",
                      }}
                    />
                  </Box>
                </ListItemButton>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Bike size={13} />
                  <Typography fontSize={14}>{student.ride_count}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            onClick={handleManageClick}
            endIcon={<ChevronUp size={20} />}
            sx={{
              bgcolor: "#35D187",
              color: "white",
              py: 2,
              width: isSmallScreen ? 180 : 205,
              px: 1,
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "#2bb974",
              },
            }}
          >
            <User size={18} />
            <Typography
              fontSize={isSmallScreen ? 14 : 17}
              sx={{ marginLeft: 1 }}
            >
              Manage students
            </Typography>
          </Button>
        </Box>
        <ManagePanel
          showManagePanel={showManage}
          onClose={handleManageClick}
          onDeactivate={() => setIsDeactivateDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
          onExportCsv={handleExportPanelClick}
          selectedStudentsCount={selectedStudents.length}
        />
        <ExportPanel
          onClose={handleExportPanelClick}
          showExportPanel={showExportPanel}
          onExportCsv={(fields, filters) =>
            handleAction("export", fields, filters)
          }
          selectedStudentsCount={selectedStudents.length}
          error={error}
          clearError={clearError}
        />
      </Container>

      <Dialog
        slotProps={{
          paper: { sx: { borderRadius: "28px" } },
        }}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
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
          <Trash2 size={48} color="#718EBF" />
          <DialogContentText
            sx={{
              fontSize: 18,
              fontWeight: 400,
              color: "black",
              textAlign: "center",
            }}
          >
            Are you sure you want to delete these students student? This action
            cannot be undone.{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} autoFocus>
            <Typography sx={{ color: "#737373" }}>Cancel</Typography>{" "}
          </Button>
          <Button onClick={() => handleAction("delete")} autoFocus>
            <Typography sx={{ color: "black" }}>Yes</Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        slotProps={{
          paper: { sx: { borderRadius: "28px" } },
        }}
        open={isDeactivateDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
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
            Are you sure you want to deactivate these students? This action
            cannot be undone.{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeactivateDialogOpen(false)} autoFocus>
            <Typography sx={{ color: "#737373" }}>Cancel</Typography>{" "}
          </Button>
          <Button onClick={() => handleAction("deactivate")} autoFocus>
            <Typography sx={{ color: "black" }}>Yes</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
