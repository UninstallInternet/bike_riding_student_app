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
import { AddressAutocomplete } from "../../components/AdressAutoComplete";
import { addStudent, Student } from "../../lib/api";
import { supabaseTeacher } from "../../lib/supabase";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { classes, SCHOOL_LOCATION, years } from "../../lib/staticConsts";
import { v4 as uuidv4 } from "uuid"; 
import QRCode from "qrcode";

export default function AddStudent() {
  const [isDistanceValid, setIsDistanceValid] = useState(false);
  const [polyline, setPolyline] = useState("");


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

  const handleDistanceChange = (distance: number, isValid: boolean) => {
    setFormData((prev) => ({
      ...prev,
      distance_to_school: distance,
    }));
    setIsDistanceValid(isValid);
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

    const DrawBikingRoute = () => {
      if (!lat || !lng) return;
      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: new window.google.maps.LatLng(lat, lng),
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
          setError("Failed to fetch biking route.");
        }
      });
    };

    DrawBikingRoute();
  };

  const generateStaticMapUrl = (polyline: string) => {
    if (!polyline) return "";
    const encodedPath = encodeURIComponent(polyline);

    const staticMapUrl =
      `https://maps.googleapis.com/maps/api/staticmap?size=600x202&` +
      `markers=color:0x14AE5C%7Clabel:A%7C${formData.lat},${formData.lng}&` +
      `markers=color:0x14AE5C%7Clabel:B%7C${SCHOOL_LOCATION.lat},${SCHOOL_LOCATION.lng}&` +
      `path=color:0x14AE5C%7Cenc:${encodedPath}&` +
      `style=feature:transit|visibility:off&` +
      `style=feature:poi|visibility:off&` +
      `language=en&sensor=false&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
      
    return staticMapUrl;
  };

  

  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    const { email, password } = credentials;
    const { error, data } = await supabaseTeacher.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data.user?.id;
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateEmail(formData.email!)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.address) {
      setError("Address is required to create student");
      return;
    }
    if (!isDistanceValid) {
      setError("Invalid address or distance cannot be calculated.");
      return;
    }

    const userId = uuidv4(); 
    const bikeQrCode = userId;

    setFormData((prev) => ({
      ...prev,
      bike_qr_code: bikeQrCode,
    }));

    try {
      const newUserId = await handleSignUp({
        email: formData.email!,
        password: formData.password!,
      });

      if (!newUserId) {
        throw new Error("User creation failed. No user ID returned.");
      }
      const staticMapUrl = generateStaticMapUrl(polyline);


      const studentData: Student = {
        ...formData,
        id: newUserId,
        bike_qr_code: bikeQrCode,
        distance_img: staticMapUrl,
      } as Student;

      await addStudent(studentData);

      await generateAndDownloadQR(bikeQrCode);

      navigate(`/student/${newUserId}`);
    } catch (error) {
      console.error("Error creating student:", error);
      setError("Error creating student: " + (error as Error).message);
    }
  };

  const generateAndDownloadQR = async (qrData: string) => {
    try {
      const qrUrl = await QRCode.toDataURL(qrData, { scale: 10 });
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = `${formData.name?.replace(/\s+/g, '')}_bike_qr_code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code:", error);
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
          <Link to={"/teacher/dashboard"}>
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
