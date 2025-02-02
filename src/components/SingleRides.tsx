import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Car, CalendarDays } from 'lucide-react';
import { Rides } from '../lib/api';

const formatDate = (dateString : string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface RideHistoryProps {
  singleRides: Rides[];
}

const RideHistory: React.FC<RideHistoryProps> = ({ singleRides }) => {
  return (
    <Box sx={{ bgcolor: "#F8F9FB", pt: 3, pb: 4, px: 2, borderRadius: 4 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
        Ride History
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        {singleRides.length === 0 ? (
          <Box sx={{ 
            py: 4, 
            px: 2, 
            display: 'flex', 
            justifyContent: 'center',
            border:"1px solid red",
            alignItems: 'center'
          }}>
            <Typography color="text.secondary">
              Student has no ride records
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
            {singleRides.map((ride, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    border:"1px solid red",
                    mt:2,
                    py: 2,
                    ':hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Car size={20} color="text.secondary" />
                        <Typography>{ride.distance}Km</Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CalendarDays size={18} color="text.secondary" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(ride.ride_date as string)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default RideHistory;