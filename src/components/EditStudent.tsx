import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { AddressAutocomplete } from "./AdressAutoComplete";
import { Student } from "../lib/api";
import { classes, years } from "../lib/staticConsts";
import { ArrowLeft } from "lucide-react";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    is_active: true,
    starting_year: "",
    address: "",
    distance_to_school: 0,
  });

  // get student data based on ID
  useEffect(() => {
    async function fetchStudent() {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
      } else {
        setStudent(data);
        setFormData({
          name: data.name,
          class: data.class,
          is_active: data.is_active,
          starting_year: data.starting_year,
          address: data.address,
          distance_to_school: data.distance_to_school || 0,
        });
      }
    }
    console.log(formData);
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "is_active" ? value === "Active" : value, // ✅ Correct handling
    }));
  };

  const handleAddressChange = (address: string | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      address: address || "",
    }));
  };

  const handleDistanceChange = (distance: number) => {
    setFormData((prevData) => ({
      ...prevData,
      distance_to_school: distance,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("students")
      .update(formData)
      .eq("id", id);

    if (error) {
      console.error("Error updating student:", error);
    } else {
      console.log("Student updated successfully:", data);
      navigate(`/student/${id}`);
    }
  };

  if (!student) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#35D187" }} />
      </div>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh" }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Link to={`/student/${id}`}>
            <IconButton
              edge="start"
              sx={{
                mr: 4,
                mt: 2,
              }}
            >
              <ArrowLeft />
            </IconButton>
          </Link>
          <Typography variant="h4" gutterBottom sx={{ mt: 3, fontWeight: 500 }}>
            Edit Student
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              select
              fullWidth
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  mb: 1,
                },
              }}
            >
              {classes.map((classOption) => (
                <MenuItem key={classOption} value={classOption}>
                  {classOption}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Active"
              name="is_active"
              value={formData.is_active ? "Active" : "Inactive"}
              onChange={handleInputChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  mt: 2,
                },
              }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Starting Year"
              name="starting_year"
              value={formData.starting_year}
              onChange={handleInputChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                mt: 2,
                mb: 2,
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>

            <AddressAutocomplete
              onAddressChange={handleAddressChange}
              onDistanceChange={handleDistanceChange}
              initialAddress={formData.address}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
              Distance to School: {formData.distance_to_school} km
            </Typography>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
