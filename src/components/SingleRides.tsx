import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { Rides } from '../lib/api';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface RideHistoryProps {
  singleRides: Rides[];
}

const RideHistory: React.FC<RideHistoryProps> = ({ singleRides }) => {
  if (singleRides.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          mt: 2,
          bgcolor: "white",
          borderRadius: 5,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.primary">
          Student has no ride records.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {singleRides.map((ride) => (
        <Box
          key={ride.id}
          sx={{
            p: 2,
            mt: 1,
            bgcolor: "white",  
            display: 'flex',
            border: "1px solid white",
            borderRadius: 5,
            flexDirection: "column",
            justifyContent: "space-between",
            textTransform: 'none',
            color: 'text.primary',
          }}
        >
          <Box
            sx={{
              p: 2,
              mt: 2,
              bgcolor: "white",  
              display: 'flex',
              flexDirection: "row",
              justifyContent: "space-between",
              textTransform: 'none',
              color: 'text.primary',
            }}
          >
            <Box sx={{ bgcolor: "white", display: "flex", flexDirection: "column", gap: 2, width: "50%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'left' }}>
                {ride.distance} Km
              </Typography>
              <Typography variant="body2" color="black" sx={{ textAlign: 'left' }}>
                {formatDate(ride.ride_date as string)}
              </Typography>
            </Box>
            <ChevronRight size={20} />
          </Box>
          Map here
        </Box>
      ))}
    </Box>
  );
};

export default RideHistory;