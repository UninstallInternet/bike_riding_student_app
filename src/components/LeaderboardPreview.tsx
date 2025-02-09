import { Typography, Button, Avatar, Box } from "@mui/material";
import { Bike } from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { LeaderboardUser } from "../lib/specificTypes";
import { theme } from "../theme/theme";
import { LeaderboardItem } from "./LeaderBoardItem";


interface LeaderboardProps {
  leaderboard: LeaderboardUser[];
}



export const LeaderboardPreview = ({ leaderboard }: LeaderboardProps) => {
  const { session } = UserAuth();

  return (
    <Box sx={{ mb: 4, mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 5,
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
                      : `2.4px solid ${theme.palette.blue.main}` ,
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
                    backgroundColor: isCurrentUser? theme.palette.green.main : theme.palette.blue.main,
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
    {parseFloat(user.totalDistance.toFixed(2))}
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
        {leaderboard.slice(0, 5).map((user, index) => {
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
      <Link to={"/student/leaderboard"}>

      <Button
        variant="contained"
        sx={{
          bgcolor: "primary",
          color: "white",
          borderRadius: "15px",
          p: 1,
          mt:4,
          width:"70%",
          fontWeight: 500,
          transition: "all 0.3s ease",
        }}
        >
        View More Results
      </Button>
        </Link>
    </Box>
  );
};
