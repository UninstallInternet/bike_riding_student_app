import React from "react";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme/theme";
import { CalendarDay } from "../lib/staticConsts";

interface Ride {
  day: number;
  id: string;
}

interface CalendarComponentProps {
  monthName: string;
  year: number;
  currentMonth: number;
  currentYear: number;
  firstDayOfMonth: number;
  daysInMonth: number;
  rideDays: Ride[];
  handleMonthChange: (delta: number) => void;
}


export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  monthName,
  year,
  currentMonth,
  currentYear,
  firstDayOfMonth,
  daysInMonth,
  rideDays,
  handleMonthChange,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
    sx={{
      py: 1,
      px: 1.2,
      borderRadius: 2,
      mb: 2,
      pb:4,
      mt: 2,
      bgcolor: "white",
      width: { xs: "93%", sm: "79%" },
      height: { xs: 260, sm: "90%" },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <IconButton onClick={() => handleMonthChange(-1)}>
        <ChevronLeft size={20} />
      </IconButton>
      <Typography>{`${monthName} ${year}`}</Typography>
      <IconButton onClick={() => handleMonthChange(1)}>
        <ChevronRight size={20} />
      </IconButton>
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",

        mb: 0.5,
      }}
    >
      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
        <Typography
          key={day}
          variant="caption"
          align="center"
          color={theme.palette.blue.main}
          fontWeight={500}
          mt={3}
        >
          {day}
        </Typography>
      ))}
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)", 
        gap: { xs: "4px", sm: "8px" },
        width: "100%", 
        overflow: "hidden",
      }}
    >
      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
        <Box key={`empty-${i}`} />
      ))}
{Array.from({ length: daysInMonth }).map((_, i) => {
const currentDay = i + 1;

const ride = rideDays.find((ride) => ride.day === currentDay);
const isRideDay = !!ride;
const rideId = ride?.id;

const today = new Date();
const isToday =
today.getDate() === currentDay &&
today.getMonth() === currentMonth &&
today.getFullYear() === currentYear;

return (
<CalendarDay
  key={currentDay}
  onClick={() => {
    if (isRideDay) navigate(`/ride/${rideId}`);
  }}
  sx={{
    bgcolor: isToday
      ? theme.palette.blue.main
      : isRideDay
      ? theme.palette.green.main
      : "transparent",
    height: { xs: "32px", sm: "36px" },
    width: "90%",
    borderRadius: 10,
    color: isRideDay || isToday ? "white" : "inherit",
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 0,
    minWidth: 0,
    cursor: isRideDay ? "pointer" : "default",
  }}
  className={`${isRideDay ? "ride-day" : ""} ${isToday ? "today" : ""}`}
  disableRipple
>
  {currentDay}
</CalendarDay>
);
})}
    </Box>
  </Paper>
  );
};