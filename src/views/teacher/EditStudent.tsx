import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
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
import { AddressAutocomplete } from "../../components/AdressAutoComplete";
import { deactivateStudents, Student } from "../../lib/api";
import { classes, SCHOOL_LOCATION, years } from "../../lib/staticConsts";
import { ArrowLeft } from "lucide-react";
import DeactivateButton from "../../components/DeactivateButton";
import DeactivateDialog from "../../components/DeactivateDialog";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>();
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [polyline, setPolyline] = useState("");
  const [distanceImg, setDistanceImg] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    class: "",
    is_active: true,
    starting_year: "",
    address: "",
    distance_to_school: 0,
    lat: null as number | null,
    lng: null as number | null,
    distance_img: "" 
  });

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
          lat: data.lat ?? null,
          lng: data.lng ?? null,
          distance_img: data.distance_img || "" 
        });
      }
    }
    fetchStudent();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "is_active" ? value === "Active" : value,
    }));
  };

  const handleAddressChange = (
    address: string | undefined,
    lat: number | undefined,
    lng: number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: address ?? "",
      lat: lat ?? null,
      lng: lng ?? null,
    }));
  };

  useEffect(() => {
    if (!formData.lat || !formData.lng) return;

    const DrawBikingRoute = () => {
      if (!formData.lat || !formData.lng) return; 

      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: new window.google.maps.LatLng(formData.lat, formData.lng),
        destination: new window.google.maps.LatLng(
          SCHOOL_LOCATION.lat,
          SCHOOL_LOCATION.lng
        ),
        travelMode: window.google.maps.TravelMode.BICYCLING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          const encodedPolyline = result.routes[0].overview_polyline;
          setPolyline(encodedPolyline); // Set the polyline
        } else {
          console.error("Error fetching directions:", status);
          alert("Failed to fetch biking route.");
        }
      });
    };

    DrawBikingRoute();
  }, [formData.lat, formData.lng]);

  useEffect(() => {
    if (!polyline) return;

    const generateStaticMapUrl = (polyline: string) => {
      if (!formData.lat || !formData.lng) return "";
      const encodedPath = encodeURIComponent(polyline);

      const staticMapUrl =
        `https://maps.googleapis.com/maps/api/staticmap?size=600x202` +
        `&markers=color:0x14AE5C%7Clabel:A%7C${formData.lat},${formData.lng}` +
        `&markers=color:0x14AE5C%7Clabel:B%7C${SCHOOL_LOCATION.lat},${SCHOOL_LOCATION.lng}` +
        `&path=color:0x14AE5C%7Cenc:${encodedPath}` +
        `&style=feature:transit|visibility:off` +
        `&style=feature:poi|visibility:off` +
        `&language=en` +
        `&sensor=false` +
        `&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
      return staticMapUrl;
    };

    const distanceImage = generateStaticMapUrl(polyline);
    setDistanceImg(distanceImage);
  }, [polyline, formData.lat, formData.lng]); // Trigger when polyline changes

  const handleDistanceChange = (distance: number) => {
    setFormData((prevData) => ({
      ...prevData,
      distance_to_school: distance,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      distance_img: distanceImg 
    };

    const {  error } = await supabase
      .from("students")
      .update(updatedFormData)
      .eq("id", id);

    if (error) {
      console.error("Error updating student:", error);
    } else {
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
            py: 0.5,
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
                mt: 1,
              }}
            >
              <ArrowLeft />
            </IconButton>
          </Link>
          <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
            Edit Student
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 3, mt: 1 }}>
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
        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <DeactivateButton
            setIsDeactivateDialogOpen={setIsDeactivateDialogOpen}
          />
        </Box>
        <DeactivateDialog
          isDeactivateDialogOpen={isDeactivateDialogOpen}
          setIsDeactivateDialogOpen={setIsDeactivateDialogOpen}
          deactivateStudents={deactivateStudents}
          studentId={student?.id}
        />
      </Box>
    </Container>
  );
}