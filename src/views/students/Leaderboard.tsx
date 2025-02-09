import {
  Typography,
  Button,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { Bike } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchStudents } from "../../lib/api";
import { LeaderboardUser } from "../../lib/specificTypes";
import { LeaderboardItem } from "../../components/LeaderBoardItem";
import { theme } from "../../theme/theme";
import { StudentToolbar } from "../../components/StudentToolbar";

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = UserAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data: LeaderboardUser[] = await fetchStudents();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); 

  return (
    <Box sx={{ mb: 4, }}>
      <StudentToolbar title="Leaderboard" />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
  {/* TOP3 */}
          <Box
            sx={{
              display: "flex",
              gap: 5,
              mb: 3,
              alignItems: "end",
              justifyContent: "center",
            }}
          >
            {leaderboard.slice(0, 3).map((user, index) => {
              const positionOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
              const isCurrentUser = session?.user.id === user.id;

              return (
                <Box
                  key={user.id}
                  sx={{
                    minWidth: 80,
                    textAlign: "center",
                    order: positionOrder,
                    transform: index === 0 ? "translateY(-10px)" : "none",
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    
                    <Avatar
                  src={user.profile_pic_url || undefined}
                  sx={{
                        width: index === 0 ? 80 : 64,
                        height: index === 0 ? 80 : 64,
                        mb: 1,
                        border: isCurrentUser
                          ? `2.4px solid ${theme.palette.green.main}`
                          : `2.4px solid ${theme.palette.blue.main}`,
                          
                      }}
                    />
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: -4,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#35D187",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {isCurrentUser ? "You" : user.name}
                  </Typography>
                  <Typography variant="caption" color="black" fontWeight={500}>
                <Bike
                  size={18}
                  color="#35D187"
                  style={{ verticalAlign: "middle" }}
                />{" "}
                {user.totalDistance} km
              </Typography>
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
              width: "100%",
            }}
          >
            {leaderboard.map((user, index) => {
              const isCurrentUser = session?.user.id === user.id;

              return (
                <LeaderboardItem
                  key={user.id}
                  user={user}
                  index={index}
                  isCurrentUser={isCurrentUser}
                />
              );
            })}
          </Box>

          <Link to={"/student/dashboard"}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary",
                color: "white",
                borderRadius: "15px",
                p: 1,
                marginLeft: 3,
                mt: 4,
                width: "60%",
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
            >
              Go back to Dashboard
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
};
