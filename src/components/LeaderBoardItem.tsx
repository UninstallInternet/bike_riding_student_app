import { Typography, Avatar, Box, styled } from "@mui/material";
import { theme } from "../theme/theme";

interface LeaderboardItemProps {
  user: {
    profile_pic_url: string | null | undefined;
    id: string;
    name: string;
    totalDistance: number;
  };
  index: number;
  isCurrentUser: boolean;
}

const LeaderboardItemContainer = styled(Box, {
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

export const LeaderboardItem = ({ user, index, isCurrentUser }: LeaderboardItemProps) => {
  return (
    <LeaderboardItemContainer
      selected={isCurrentUser}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "2px solid",
        borderColor: isCurrentUser ? theme.palette.green.main : "transparent",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ minWidth: 24, textAlign: "left" }}>
          {index + 1}
        </Typography>
        <Avatar src={user.profile_pic_url ||undefined} sx={{ width: 32, height: 32 }} />
        <Box>
          <Typography variant="body2">
            {isCurrentUser ? "You" : user.name}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ textAlign: "right", minWidth: 50, fontWeight: 500 }}>
      {parseFloat(user.totalDistance.toFixed(2))} km
      </Typography>
    </LeaderboardItemContainer>
  );
};