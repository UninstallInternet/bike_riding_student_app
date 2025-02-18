import { useEffect, useState } from "react";
import {
  Badge,
  fetchAllBadges,
  fetchStudentBadges,
  StudentAward,
} from "../lib/api";
import {
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const StudentBadges = ({ studentId }: { studentId: string }) => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [studentBadges, setStudentBadges] = useState<StudentAward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [allBadgesDataRaw, studentBadgesDataRaw] = await Promise.all([
          fetchAllBadges(),
          fetchStudentBadges(studentId),
        ]);

        const allBadgesData = allBadgesDataRaw || [];
        const studentBadgesData = studentBadgesDataRaw || [];

        setAllBadges(allBadgesData as Badge[]);
        setStudentBadges(studentBadgesData as StudentAward[]);

        const hasShownFirstBadgeModal = localStorage.getItem(
          `hasShownFirstBadgeModal-${studentId}`
        );

        if (studentBadgesData.length > 0 && !hasShownFirstBadgeModal) {
          const firstEarnedBadge = allBadgesData.find((badge) =>
            studentBadgesData.some(
              (b) => b.badge_id === badge.id && b.awarded_at
            )
          );

          if (firstEarnedBadge) {
            setSelectedBadge(firstEarnedBadge);
            setOpen(true);
            localStorage.setItem(
              `hasShownFirstBadgeModal-${studentId}`,
              "true"
            );
          }
        }
      } catch (err) {
        setError("Error fetching badges.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [studentId]);

  const handleClickOpen = (badge: Badge) => {
    setSelectedBadge(badge);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBadge(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "start",
        }}
      >
        {allBadges
          .filter((badge) =>
            studentBadges.some((b) => b.badge_id === badge.id && b.awarded_at)
          )
          .map((badge) => {
            const isObtained = studentBadges.some(
              (b) => b.badge_id === badge.id && b.awarded_at
            );

            return (
              <Box
                key={badge.id}
                sx={{
                  textAlign: "center",
                  mx: 1,
                  cursor: "pointer",
                  position: "relative",
                  opacity: isObtained ? 1 : 0.5,
                  filter: isObtained ? "none" : "grayscale(100%)",
                }}
                onClick={() => handleClickOpen(badge)}
              >
                <img
                  src={badge.icon_url || "/default-icon.png"}
                  alt={badge.name}
                  style={{ width: "80px", height: "80px" }}
                />
              </Box>
            );
          })}
      </Box>

      {selectedBadge && (
        <Dialog
          slotProps={{
            paper: { sx: { borderRadius: "28px" } },
          }}
          open={open}
          onClose={handleClose}
        >
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                opacity: studentBadges.some(
                  (b) => b.badge_id === selectedBadge.id && b.awarded_at
                )
                  ? 1
                  : 0.5,
                filter: studentBadges.some(
                  (b) => b.badge_id === selectedBadge.id && b.awarded_at
                )
                  ? "none"
                  : "grayscale(100%)",
              }}
            >
              <img
                src={selectedBadge.icon_url || "/default-icon.png"}
                alt={selectedBadge.name}
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "10px",
                  paddingTop: "15px",
                }}
              />
            </Box>

            <DialogTitle>
              {" "}
              {studentBadges.some(
                (b) => b.badge_id === selectedBadge.id && b.awarded_at
              )
                ? "🎉"
                : ""}{" "}
              {selectedBadge.name}
            </DialogTitle>
            <Typography textAlign="center" variant="body1">
              {selectedBadge.description}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "black" }}>
              <Typography color="black">Close</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Link to={"/student/awards"}>
      <Button
        variant="contained"
        sx={{
          bgcolor: "primary",
          color: "white",
          borderRadius: "15px",
          p: 1,
          mt: 4,
          width: "97%",
          fontWeight: 500,
          transition: "all 0.3s ease",
          mb:3,
        }}
        >
        View All Awards
      </Button>
        </Link>
    </Box>
  );
};

export default StudentBadges;
