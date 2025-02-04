import { Typography, Button, Avatar, Box, styled } from "@mui/material";
import { Bike } from "lucide-react";
import { UserAuth } from "../context/AuthContext";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  totalDistance: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardUser[];
}

const LeaderboardItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected", 
})<{ selected?: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  width: "95%",
  justifyContent: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  ...(selected && {
    border: `1px solid #35D187`,
    backgroundColor: "#F8F9FB",
  }),
}));

export const Leaderboard = ({ leaderboard }: LeaderboardProps) => {
  const { session } = UserAuth(); // Get logged-in user session

  return (
    <Box sx={{ mb: 4, mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "end",
          justifyContent: "center",
        }}
      >
        {leaderboard.slice(0, 3).map((user, index: number) => {
          const positionOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
          const isCurrentUser = session?.user.id === user.id;

          return (
            <Box
              key={user.id}
              sx={{
                minWidth: 80,
                textAlign: "center",
                order: positionOrder, // Reorders N1 to the center
                transform: index === 0 ? "translateY(-10px)" : "none", // Elevate N1 slightly
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: index === 0 ? 80 : 64,
                    height: index === 0 ? 80 : 64,
                    mb: 1,
                    border: isCurrentUser
                      ? "1.5px solid green"
                      : "1px solid blue",
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
                {isCurrentUser ? "YOU" : user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <Bike
                  size={12}
                  color="#35D187"
                  style={{ verticalAlign: "middle" }}
                />{" "}
                {user.totalDistance} km
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Full Leaderboard List (Show only 5 users) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          width: "100%",
        }}
      >
        {leaderboard.slice(0, 5).map((user, index) => {
          const isCurrentUser = session?.user.id === user.id;

          return (
            <LeaderboardItem
              key={user.id}
              selected={isCurrentUser}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: isCurrentUser ? "#F0FFF4" : "transparent", // Light highlight for "YOU"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ minWidth: 24, textAlign: "left" }}>
                  {index + 1}
                </Typography>
                <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                <Box>
                  <Typography variant="body2">
                    {isCurrentUser ? "YOU" : user.name}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ textAlign: "right", minWidth: 50 }}>
                {user.totalDistance} km
              </Typography>
            </LeaderboardItem>
          );
        })}
      </Box>

      <Button
        variant="contained"
        sx={{
          bgcolor: "primary",
          color: "white",
          borderRadius: "15px",
          p: 1,

          marginLeft: 3,
          fontWeight: 500,
          transition: "all 0.3s ease",
        }}
      >
        See More Results
      </Button>
    </Box>
  );
};
