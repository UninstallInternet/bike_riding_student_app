import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { DetailedRide, fetchDetailRide } from "../../lib/api";
import { StudentToolbar } from "../../components/StudentToolbar";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const RideDetails: React.FC = () => {
  const [detailedRide, setDetailedRide] = useState<DetailedRide[]>([]);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchDetailRide(id).then((data) => {
        setDetailedRide(data);
      });
    }
  }, [id]);

  return (
    <Box sx={{ mb: 4, mt: 1 }}>
      <StudentToolbar title="Ride Details" />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <img
          src="/bikeparking.png"
          alt="Bike Park Icon"
          width={80}
          height={80}
        />

        {detailedRide && detailedRide.length > 0 ? (
          <>
            <Typography variant="h4">{detailedRide[0].distance} Km</Typography>
            <Typography variant="body1">
              {formatDate(detailedRide[0].ride_date as string)}
            </Typography>

            {detailedRide[0].students.distance_img ? (
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  maxWidth: "600px",
                  height: "400px", 
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={detailedRide[0].students.distance_img}
                    alt="Distance Image"
                    style={{
                      width: "48%",
                      height: "55%",
                      borderRadius: 10,
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="body1">No image available</Typography>
            )}
          </>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default RideDetails;
