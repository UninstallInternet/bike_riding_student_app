import { Paper, Typography, Box } from "@mui/material";

interface BikingStatsCardProps {
  totalBikedAmount : number;
  rideCount : number;
}

const BikingStatsCard = ({ totalBikedAmount, rideCount }: BikingStatsCardProps) => {
  return (
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
          <img src="/cup.png" alt="Cup" style={{ width: 42, height: 42 }} />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" align="left">
            Total Biked Amount
          </Typography>
          <Typography variant="h6" align="left">{totalBikedAmount} km</Typography>
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
          <img src="/bikeup.png" alt="Bike" style={{ width: 42, height: 42 }} />
        </Box>
        <Box>
          <Typography variant="body2" align="left" color="text.secondary">
            Total Number of Rides
          </Typography>
          <Typography variant="h6" align="left">{rideCount} rides</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BikingStatsCard;
