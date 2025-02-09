import { Toolbar, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";


export const StudentToolbar = ({ title }: { title: string;}) => {


  return (
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 4,
      }}
    >
      <Link to={"/student/dashboard"}>
        <IconButton edge="start" sx={{ mr: 2 }}>
          <ArrowLeft />
        </IconButton>
      </Link>
      <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      <UserAvatar></UserAvatar>
    </Toolbar>
  );
};
