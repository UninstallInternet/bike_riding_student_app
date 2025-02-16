import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { fetchTeacher, handleLogout, Teacher, updateTeacherPicture } from "../../lib/api";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera,} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { theme } from "../../theme/theme";

export const TeacherEditSelf = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
    const [sucess, setSucess] = useState("")
    const navigate = useNavigate();

  const {session} = UserAuth()
  useEffect(() => {
    setLoading(true);
    fetchTeacher().then((data) => setTeacher(data as Teacher));
    setLoading(false);
  }, []);

  const handlePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && teacher) {
      setUploading(true);
      try {
        const updatedTeacher = await updateTeacherPicture(session?.user.id as string, file);
        setSucess("Picture updated successfully")

        setTeacher(updatedTeacher);
      } catch (error) {
        console.error("Failed to update picture:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }



  return (
    <Box>
 <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link to={"/teacher/dashboard"}>
            <ArrowLeft size={20} />
            </Link>
            <Typography
              fontSize={"18px"}
              component="h1"
              fontWeight={"500"}
            >
              Teacher Dashboard
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />
          {session && (
            <Button
              variant="contained"
              onClick={() => handleLogout(navigate)}
              sx={{
                bgcolor: "primary",
                color: "white",
                borderRadius: "15px",
                p: 0.2,

                marginLeft: 1,
                "&:hover": {
                  bgcolor: "error.dark",
                },
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
            >
              Logout
            </Button>
          )}

        </Toolbar>
    <Box
      sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: 400,
          margin: "auto",
          mt: 4,
        }}
        >
      <Typography
        variant="h5"
        sx={{ mb: 3, color: "text.primary", fontWeight: 500 }}
        >
        Profile
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
        <Avatar
          src={teacher?.profile_pic_url || "/placeholder.svg"}
          alt={teacher?.name as string}
          sx={{ width: 120, height: 120, mb: 2 }}
          />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={handlePictureChange}
          />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<Camera size={20} />}
            sx={{
                bgcolor: "primary.main",
                color: "white",
                width: "100%",
                p: 2,
                "&:hover": {
                    bgcolor: "primary.dark",
                },
            }}
            disabled={uploading}
            >
            {uploading ? "Uploading..." : "Change Picture"}
          </Button>
        </label>
                <Typography color={theme.palette.green.main} sx={{mt:2, fontWeight:500}}>
        
                {sucess}
                </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 1, p: 2 }}
          >
          Name: {teacher?.name}
        </Typography>
      </Box>
    </Box>
            </Box>
  );
};
