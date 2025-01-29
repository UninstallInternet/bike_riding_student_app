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
  ChevronUp,
  UserPlus,
  Trash2,
  UserMinus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  deactivateStudents,
  deleteStudents,
  exportStudentsCsv,
  fetchUserData,
  fetchUsers,
  Student,
  Teacher,
} from "../lib/api";
import { supabase } from "../lib/supabase";
import { UserAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";

export default function TeacherDashboard() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
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
    fetchUsers()
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
    fetchUserData().then((data) => setTeacher(data as Teacher));
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

  const handleAction = async (action: string) => {
    let result;
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
                paddingX: 1,
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
          Welcome, Mr. {teacher?.name}
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
              width: 55,
              bgcolor: "#718EBF",
              color: "primary.main",
              px: 0.5,
              py: 0.5,
              borderRadius: 16,
              fontSize: "0.875rem",
            }}
          >
            <Typography color="white" sx={{ fontSize: "14px" }}>
              {students.length} users
            </Typography>{" "}
          </Box>
          <IconButton size="small">
            <FilterList size={20} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small">
            <Search size={20} />
          </IconButton>
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
            {students.map((student) => (
              <ListItem key={student.id} disablePadding>
                <ListItemButton
                  onClick={handleToggle(student.id.toString())}
                  dense
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    <Link
                      to={`/student/${student.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItemText
                        primary={student.name}
                        slotProps={{
                          primary: {
                            sx: { fontWeight: 500 },
                          },
                          secondary: {
                            sx: { color: "text.secondary" },
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
                      mr: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
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
        )}

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
            <MenuItem onClick={() => setIsDeactivateDialogOpen(true)}>
              Deactivate selected students
            </MenuItem>
            <MenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              Delete selected students
            </MenuItem>
            <MenuItem onClick={() => handleAction("export")}>
              Export students CSV file
            </MenuItem>
          </Menu>
        </Box>
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
            Are you sure you want to deactivate these students student? This
            action cannot be undone.{" "}
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
