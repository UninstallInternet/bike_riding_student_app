import React from "react";
import { Box, Typography } from "@mui/material";
import { Bike, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Rides } from "../lib/api";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface RideHistoryProps {
  singleRides?: Rides[] | null;
  student?: {
    lat?: number;
    lng?: number;
    distance_img?: string;
  } | null;
}

const RideHistory: React.FC<RideHistoryProps> = ({
  singleRides = [],
  student = null,
}) => {
  if (!student || !student.distance_img) {
    return (
      <Box
        sx={{
          p: 2,
          mt: 2,
          bgcolor: "white",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No student information available
        </Typography>
      </Box>
    );
  }

  if (!singleRides || singleRides.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          mt: 2,
          bgcolor: "white",
          borderRadius: 2,
          textAlign: "start",
          display: "flex",
          alignItems: "center",
          pl: 2,
          gap: 1,
        }}
      >
        <Typography
          fontFamily={"monospace"}
          fontSize={14}
          variant="body1"
          color="black"
        >
          No ride(s) records found
        </Typography>
        <Bike size={14} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {singleRides
        .filter((ride) => ride && ride.id)
        .map((ride) => (
          <Box
            key={ride.id}
            sx={{
              p: 2,
              bgcolor: "white",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Link
              to={`/ride/${ride.id}`}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "1.125rem",
                      textAlign: "left",
                    }}
                  >
                    {ride.distance || "N/A"} km
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 400,
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    {ride.ride_date
                      ? formatDate(ride.ride_date as string)
                      : "Unknown Date"}
                  </Typography>
                </Box>
                <ChevronRight size={20} style={{ color: "#6B7280" }} />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  pt: "29.55%",  
                }}
              >
                <img
                  src={ride.distance_img || "/placeholder.svg"}
                  alt={`Ride route map`}
                  style={{
                    position: "absolute",
                    borderRadius: 12,
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Link>
          </Box>
        ))}
    </Box>
  );
};

export default RideHistory;
