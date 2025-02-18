import React from 'react';
import { Box, IconButton, ListItemText, Drawer, Button } from '@mui/material';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import RideHistory from './RideHistory';
import { Rides } from '../lib/api';

interface RidesDrawerProps {
  open: boolean;
  handleDrawerToggle: () => void;
  student?: {
    lat?: number
    lng?: number
    distance_img?: string
  } | null;
    allRides: Rides[] | null
}

const RidesDrawer: React.FC<RidesDrawerProps> = ({ open, handleDrawerToggle, student, allRides }) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: 'transparent',
          borderTopRightRadius: 28,
          borderTopLeftRadius: 28,
          boxShadow: 'none',
          height: 'auto',  
          maxHeight: '70%', 
          width: '100%', 
          maxWidth: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: '#F5F7FA',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          borderTopRightRadius: 28,
          borderTopLeftRadius: 28,
          pb: 6,
          maxWidth: '100%',
        }}
      >
        <Box
          sx={{
            color: 'black',
            display: 'flex',
            pb: 2,
            pt: 2,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <Link to="/student/allrides">
            <ListItemText
              primary="Ride History"
              sx={{
                textAlign: 'center',
              }}
            />
          </Link>

          <Box
            sx={{
              position: 'absolute',
              right: 16,
            }}
          >
            <IconButton onClick={handleDrawerToggle}>
              <X size={16} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: {
              xs: '85%',
              sm: '60%',
              md: '50%',
            },
            maxWidth: '100%',
          }}
        >
          <RideHistory student={student} singleRides={allRides} />
        </Box>
        <Link to={"/student/allrides"}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "primary",
            color: "white",
            borderRadius: "15px",
            mt:2,
            px:42,
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
        >
          View All Rides
        </Button>
      </Link>
      </Box>
    </Drawer>
  );
};

export default RidesDrawer;
