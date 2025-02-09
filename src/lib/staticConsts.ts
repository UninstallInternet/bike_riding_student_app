import { Button, styled } from "@mui/material";

export const years = [ "2025", "2026", "2027","2028","2029","2030"];
export const classes = ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B"];

export const SCHOOL_LOCATION = {
    lat: 50.85045, // School's latitude
    lng: 4.34878   // School's longitude
  };
  
  export const CalendarDay = styled(Button)(({ theme }) => ({
    minWidth: 36,
    height: 36,
    borderRadius: "50%",
    padding: 0,
    margin: "2px",
    color: theme.palette.text.primary,
    "&.active": {
      backgroundColor: "#35D187",
      color: "white",
      "&:hover": {
        backgroundColor: "#2bb974",
      },
    },
  }));