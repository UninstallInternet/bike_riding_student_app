import type React from "react"
import { Box, Typography } from "@mui/material"
import { ChevronRight } from "lucide-react"
import type { Rides } from "../lib/api"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

interface RideHistoryProps {
  singleRides: Rides[]
  student: {
    lat: number
    lng: number
    distance_img: string
  }
}

const TeacherRidesDisplay: React.FC<RideHistoryProps> = ({ singleRides, student }) => {
  if (!student) {
    return <Typography variant="body1">Loading...</Typography>
  }

  if (singleRides.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          mt: 2,
          bgcolor: "white",
          borderRadius: 2,
          textAlign: "start",
        }}
      >
        <Typography variant="body1" color="text.primary">
          Student has no ride records.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {singleRides.map((ride) => (
        <Box
          key={ride.id}
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >

          
            <Box
              sx={{
                p: 2,
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
                  }}
                >
                  {ride.distance} km
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  {formatDate(ride.ride_date as string)}
                </Typography>
              </Box>
              <ChevronRight size={20} style={{ color: "#6B7280" }} />
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                pt: "22.25%",
              }}
            >
              <img
                src={ride.distance_img || "/placeholder.svg"}
                alt={`Ride route map for ${formatDate(ride.ride_date as string)}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          
        </Box>
      ))}
    </Box>
  )
}

export default TeacherRidesDisplay
