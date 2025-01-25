import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AddressAutocomplete } from "./AdressAutoComplete";
import { addStudent, Student } from "../lib/api";
import { supabase } from "../lib/supabase";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const years = ["2024", "2025", "2026", "2027"];
const classes = ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B"];

export default function AddStudent() {
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    email: "",
    password: "",
    address: "",
    starting_year: 2024,
    class: "",
    bike_qr_code: "0",
    distance_to_school: 0,
    is_active: null,
  });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        qrCode: event.target.files![0],
      }));
    }
  };

  const handleDistanceChange = (distance: number) => {
    setFormData((prev) => ({
      ...prev,
      distance_to_school: distance,
    }));
  };

  const handleAddressChange = (address: string | undefined) => {
    console.log("Updated address in parent:", address);
    setFormData((prev) => ({
      ...prev,
      address: address ?? "",
    }));
  };
  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error(error.message);
    console.log(data);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addStudent(formData as Student);
    handleSignUp(formData as Student)
    navigate("/dashboard");
  };

  return (
    <Box sx={{ pb: 10, minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Link to={"/dashboard"}>
            <IconButton edge="start" sx={{ mr: 2 }}>
              <ArrowLeft />
            </IconButton>
          </Link>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
            Add new student
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <AddressAutocomplete
            onAddressChange={handleAddressChange}
            onDistanceChange={handleDistanceChange}
          />

          <TextField
            select
            fullWidth
            label="Starting Year"
            name="starting_year"
            value={formData.starting_year}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          >
            {classes.map((classOption) => (
              <MenuItem key={classOption} value={classOption}>
                {classOption}
              </MenuItem>
            ))}
          </TextField>

          <Button
            component="label"
            variant="outlined"
            startIcon={<Upload />}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              borderStyle: "dashed",
              textTransform: "none",
            }}
          >
            Upload QR Code
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {formData.bike_qr_code && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {formData.bike_qr_code}
            </Typography>
          )}

          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                py: 1.5,
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
