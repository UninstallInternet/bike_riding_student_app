"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import {
  Filter as FilterList,
  Search,
  FlipVerticalIcon as MoreVert,
  ChevronUp,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUsers, Student } from "../lib/api";
import { supabase } from "../lib/supabase";
import { UserAuth } from "../context/AuthContext";

// const students = Array(8)
//   .fill(null)
//   .map((_, index) => ({
//     id: `student-${index + 1}`,
//     name: "Olivia Rhye",
//     studentId: "1234-5678-9012",
//     class: "6-A",
//     isActive: true,
//   }));

export default function TeacherDashboard() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  const { session } = UserAuth();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out", error.message);
    } else {
      console.log("Logged out successfully");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUsers().then((data) => setStudents(data));
  }, []);

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deleteStudents = async (studentIds: string[]) => {
    const { error } = await supabase
      .from("students")
      .delete()
      .in("id", studentIds);

    if (error) {
      console.error("Error deleting students:", error);
      return false;
    }
    return true;
  };

  const deactivateStudents = async (studentIds: string[]) => {
    const { error } = await supabase
      .from("students")
      .update({ is_active: false })
      .in("id", studentIds);

    if (error) {
      console.error("Error deactivating students:", error);
      return false;
    }
    return true;
  };

  const exportStudentsCsv = async (studentIds?: string[]) => {
    console.log(studentIds);
  };

  const handleAction = async (action: string) => {
    let result;
    switch (action) {
      case "delete":
        result = await deleteStudents(selectedStudents);
        break;
      case "deactivate":
        result = await deactivateStudents(selectedStudents);
        break;
      case "export":
        result = await exportStudentsCsv(selectedStudents);
        break;
    }

    if (result) {
      fetchUsers().then((data) => setStudents(data));
    }

    handleMenuClose();
  };

  return (
    <Box sx={{ pb: 7, bgcolor: "#FFFFFF", minHeight: "100vh" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          {/* Left side with Avatar and Typography */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 32, height: 32 }} />
            <Typography variant="subtitle1" component="h1" fontWeight={500}>
              Teacher Dashboard
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton>
            <Link to="/adduser">
              <UserPlus />
            </Link>
          </IconButton>

          {session && (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                bgcolor: "primary",
                color: "white",
                borderRadius: "20px",
                marginLeft: 3,
                paddingX: 3,
                paddingY: 1,
                "&:hover": {
                  bgcolor: "error.dark",
                },
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 500 }}>
          Welcome, Mr. Johnson!
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
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
              bgcolor: (theme) => theme.palette.primary.main + "1A",
              color: "primary.main",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.875rem",
            }}
          >
            50 users
          </Box>
          <IconButton size="small">
            <FilterList size={20} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small">
            <Search size={20} />
          </IconButton>
        </Box>

        <List sx={{ bgcolor: "background.paper" }}>
          {students.map((student) => (
            <ListItem
              key={student.id}
              disablePadding
              secondaryAction={
                <IconButton edge="end">
                  <MoreVert size={20} />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={handleToggle(student.id.toString())}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={
                      selectedStudents.indexOf(student.id.toString()) !== -1
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={student.name}
                  secondary={student.id}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    sx: { color: "text.secondary" },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mr: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {student.class}
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
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            p: 2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={handleMenuClick}
            disabled={selectedStudents.length === 0}
            endIcon={<ChevronUp size={20} />}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Manage students
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={() => handleAction("deactivate")}>
              Deactivate selected students
            </MenuItem>
            <MenuItem onClick={() => handleAction("delete")}>
              Delete selected students
            </MenuItem>
            <MenuItem onClick={() => handleAction("export")}>
              Export students CSV file
            </MenuItem>
          </Menu>
        </Box>
      </Container>
    </Box>
  );
}
