import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { ArrowLeft, Trash2, Bike, PencilLine } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import {
  deactivateStudents,
  fetchRides,
  Rides,
  StudentWithRides,
  studentWithRidesQuery,
} from "../lib/api";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import RideHistory from "./SingleRides";
import DeactivateButton from "./DeactivateButton";
import DeactivateDialog from "./DeactivateDialog";

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentWithRides | null>(null);
  const [rideCount, setRideCount] = useState<number>(0);
  const [singleRides, setSingleRides] = useState<Rides[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  async function deleteStudent(id: string) {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      alert("Server error deleting student");
    } else {
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    if (id) {
      studentWithRidesQuery(id).then((data) => {
        if (data) {
          setStudent(data as StudentWithRides);
          setRideCount(data.rides.length);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    fetchRides(id as string).then((data) => setSingleRides(data));
  }, []);

  console.log(singleRides);

  const totalBikedAmount = student?.distance_to_school
    ? student.distance_to_school * rideCount
    : 0;

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh" }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Link to={"/dashboard"}>
          <IconButton edge="start" sx={{ mr: 2 }}>
            <ArrowLeft />
          </IconButton>
        </Link>
        <Typography
          variant="subtitle1"
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Student Details
        </Typography>
        <IconButton
          edge="end"
          color="error"
          onClick={() => setIsDialogOpen(true)}
          sx={{ "&:hover": { backgroundColor: "error.light" } }}
        >
          <Trash2 size={24} />
        </IconButton>
      </Box>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",
            pt: 2,
            pb: 2,
            alignItems: "center",
          }}
        >
          <Avatar
            src="https://static.vecteezy.com/system/resources/thumbnails/043/210/048/small/portrait-of-a-young-smiling-woman-for-lifestyle-and-apparel-advertising-free-photo.jpeg"
            sx={{
              width: 120,
              height: 120,
              mb: 2,
            }}
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
            {student?.name}
          </Typography>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" color="black">
                Bike QR Code:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  pl: 2,
                  fontWeight: 500,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                }}
              >
                {student?.bike_qr_code}
              </Typography>
            </Box>
            <Typography variant="body2" color="black">
              Class:{" "}
              <Box component="span" sx={{ fontWeight: 500, ml: 1 }}>
                {student?.class}
              </Box>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="black">
                Status:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: student?.is_active ? "#35D187" : "error.main",
                  }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {student?.is_active ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="black">
              Starting Year:{" "}
              <Box component="span" sx={{ fontWeight: 500, ml: 1 }}>
                {student?.starting_year}
              </Box>
            </Typography>
          </Box>
          <Link to={`/edit/${student?.id}`}>
            <Button
              variant="contained"
              startIcon={<PencilLine size={20} />}
              fullWidth
              sx={{
                width: 364,
                borderRadius: "100px",
                textTransform: "none",
                py: 1.5,
                color: "white",
              }}
            >
              Edit
            </Button>
          </Link>
        </Box>
        <Box
          sx={{
            bgcolor: "#F8F9FB",
            pt: 3,
            pb: 4,
            px: 2,
            borderRadius: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid ",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                color: "warning.dark",
              }}
            >
              <img src="/cup.png" alt="Cup" style={{ width: 42, height: 42 }} />{" "}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Biked Amount
              </Typography>
              <Typography variant="h6">{totalBikedAmount} km</Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                color: "error.dark",
              }}
            >
              <img
                src="/bikeup.png"
                alt="Cup"
                style={{ width: 42, height: 42 }}
              />{" "}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Number of Rides
              </Typography>
              <Typography variant="h6">{rideCount} rides</Typography>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
            Your Environmental Impact
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              my: 2,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Bike size={32} color="#2E9B6B" />
              <Typography variant="body2" color="text.secondary">
                35 kg CO2 Saved
              </Typography>
            </Box>
            <Typography variant="h6">=</Typography>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <img
                  src="/tree.png"
                  alt="Cup"
                  style={{ width: 118, height: 64 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                1,400 Trees planted
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 3, bgcolor: "#F5F7FA", borderRadius: 2 }}>
          <RideHistory singleRides={singleRides} />{" "}
        </Box>
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
          <DeactivateButton
            setIsDeactivateDialogOpen={setIsDeactivateDialogOpen}
          />
        </Box>
      </Container>
      <Dialog
        slotProps={{
          paper: { sx: { borderRadius: "28px" } },
        }}
        open={isDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)} // Fix this line
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
            Are you sure you want to delete this student? This action cannot be
            undone.{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            <Typography sx={{ color: "#737373" }}>Cancel</Typography>{" "}
          </Button>
          <Button
            onClick={() => deleteStudent(student?.id as string)}
            autoFocus
          >
            <Typography sx={{ color: "black" }}>Yes</Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <DeactivateDialog
        isDeactivateDialogOpen={isDeactivateDialogOpen}
        setIsDeactivateDialogOpen={setIsDeactivateDialogOpen}
        deactivateStudents={deactivateStudents}
        studentId={student?.id}
      />{" "}
    </Box>
  );
}
