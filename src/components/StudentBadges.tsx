import { useEffect, useState } from "react";
import { fetchStudentBadges } from "../lib/api";
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

type StudentAwards = {
  awarded_at: string | null;
  badge_id: number;
  created_at: string | null;
  id: number;
  student_id: string | null;
  awards: {
    description: string | null;
    icon_url: string | null;
    id: number;
    name: string;
  };
}[];

const StudentBadges = ({ studentId }: { studentId: string }) => {
  const [badges, setBadges] = useState<StudentAwards>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<StudentAwards[number] | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const getBadges = async () => {
      try {
        const data = await fetchStudentBadges(studentId);
        const formattedData = data?.map((badge) => ({
          ...badge,
          awards: Array.isArray(badge.awards) ? badge.awards[0] : badge.awards, 
        })) as StudentAwards;
        
        setBadges(formattedData);
        
        const lastSeenTimestamp = localStorage.getItem(`lastSeenBadge_${studentId}`);

        const newAwards: StudentAwards = data?.filter(
          (badge) =>
            badge.awarded_at &&
            (!lastSeenTimestamp || new Date(badge.awarded_at) > new Date(lastSeenTimestamp))
        ) as unknown as StudentAwards;

        if (newAwards && newAwards.length > 0) {
          setSelectedBadge(newAwards[0]);
          setOpen(true);
        }
      } catch (err) {
        setError("Error fetching badges.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getBadges();
  }, [studentId]);

  const handleClickOpen = (badge: StudentAwards[number]) => {
    setSelectedBadge(badge);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (selectedBadge?.awarded_at) {
      localStorage.setItem(`lastSeenBadge_${studentId}`, selectedBadge.awarded_at);
    }
    setSelectedBadge(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
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
      <Box sx={{ display: "flex", gap: "25px", mb: 2, flexWrap: "wrap", justifyContent: "start" }}>
        {badges?.map((badge) => (
          <Box
            key={badge.id}
            sx={{ textAlign: "center", mx: 1, cursor: "pointer" }}
            onClick={() => handleClickOpen(badge)} 
          >
            {badge.awards ? (
              <img
                src={badge.awards.icon_url || "/default-icon.png"}
                alt={badge.awards.name || "Badge"}
                style={{ width: "80px", height: "80px" }}
              />
            ) : (
              <Typography variant="body1">No awards recorded</Typography>
            )}
          </Box>
        ))}
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
            <img
              src={selectedBadge.awards.icon_url || "/default-icon.png"}
              alt={selectedBadge.awards.name}
              style={{ width: "100px", height: "100px", marginBottom: "10px", paddingTop: "15px" }}
            />
            <DialogTitle>🎉 {selectedBadge.awards.name}</DialogTitle>
            <Typography textAlign="center" variant="body1">
              {selectedBadge.awards.description}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "black" }}>
              <Typography color="black">Close</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default StudentBadges;
