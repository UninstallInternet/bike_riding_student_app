import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelector() {
  const navigate = useNavigate();
  const handleRoleSelection = (role : string) => {
    navigate(`/login/${role}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Typography variant="h5" component="h1" align="center">
            Welcome to the Bike Tracker App!
          </Typography>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#EBF5FF",
              borderRadius: "50%",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={24} />
          </Paper>

          <Box
            sx={{
              textAlign: "center",
              gap: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" component="h2">
              Would you like to login as a teacher or a student?
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Select your role to continue. Teachers manage student accounts,
              while students track their biking progress.
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleRoleSelection("teacher")} // Navigate to teacher login page
            >
              I'm a Teacher
            </Button>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => handleRoleSelection("student")} // Navigate to student login page
            >
              I'm a Student
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
