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
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AddressAutocomplete } from "./AdressAutoComplete";
import { addStudent, Student } from "../lib/api";
import { supabase } from "../lib/supabase";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { classes, years } from "../lib/staticConsts";

export default function AddStudent() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    email: "",
    password: "",
    address: "",
    starting_year: 2025,
    class: "",
    bike_qr_code: "",
    distance_to_school: 0,
    is_active: true,
  });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistanceChange = (distance: number) => {
    setFormData((prev) => ({
      ...prev,
      distance_to_school: distance,
    }));
  };

  const handleAddressChange = (address: string | undefined) => {
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
    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return data.user?.id;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.address) {
      setError("Adress is required to create student");
      return;
    }

    const bikeQrCode = `${formData.name}${
      Math.floor(Math.random() * 900) + 100
    }${formData.address?.replace(/[, ].*/, "")}${
      Math.floor(Math.random() * 900) + 100
    }`;

    setFormData((prev) => ({
      ...prev,
      bike_qr_code: bikeQrCode,
    }));

    try {
      const userId = await handleSignUp({
        email: formData.email!,
        password: formData.password!,
      });

      if (!userId) {
        throw new Error("User creation failed. No user ID returned.");
      }

      const studentData: Student = {
        ...formData,
        id: userId, //
        bike_qr_code: bikeQrCode,
      } as Student;

      await addStudent(studentData);

      navigate(`/student/${userId}`);
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Error creating student: " + (error as Error).message);
    }
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
        <Typography sx={{ color: "red", fontWeight: "400" }}>
          {error}
        </Typography>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: "2" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
              STUDENT QR CODE:
            </Typography>
            {formData.bike_qr_code || "Not generated yet"}
          </Box>
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
