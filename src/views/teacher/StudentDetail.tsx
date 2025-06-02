import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { ArrowLeft, Trash2, Bike, PencilLine } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import {
  deactivateStudents,
  fetchRides,
  Rides,
  StudentWithRides,
  studentWithRidesQuery,
} from "../../lib/api";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DeactivateButton from "../../components/DeactivateButton";
import DeactivateDialog from "../../components/DeactivateDialog";
import BikingStatsCard from "../../components/BikingStatsCard";
import TeacherRidesDisplay from "../../components/TeacherRidesDisplay";
import { calculateCO2Saved, calculateTreesEquivalent } from "../../lib/constants";

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
      navigate("/teacher/dashboard");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalBikedAmount = student?.rides?.reduce(
    (acc, ride) => acc + (ride.distance || 0),
    0
  ) || 0;

  if (!student) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
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
        <Link to={"/teacher/dashboard"}>
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
            src={student.profile_pic_url || undefined}
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
        <BikingStatsCard
          rideCount={rideCount}
          totalBikedAmount={totalBikedAmount}
        />

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
                {calculateCO2Saved(totalBikedAmount).toFixed(1)} kg CO2 Saved
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
                {calculateTreesEquivalent(totalBikedAmount).toFixed(0)} Trees planted
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 3, bgcolor: "#F5F7FA", borderRadius: 2 }}>
          <TeacherRidesDisplay student={student} singleRides={singleRides} />{" "}
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
