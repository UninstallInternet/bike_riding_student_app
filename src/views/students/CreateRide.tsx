import { Box, Typography } from "@mui/material";
import { Check } from "lucide-react";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { UserAuth } from "../../context/AuthContext";

import { useEffect, useRef, useState } from "react";
import { fetchStudentbyId, StudentWithRides } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import { theme } from "../../theme/theme";
import { StudentToolbar } from "../../components/StudentToolbar";

const schoolQr = "SchoolBrussels123";

export const CreateRide = () => {
  const { session } = UserAuth();
  const [student, setStudent] = useState<StudentWithRides[] | null>(null);
  const [error, setError] = useState("");
  const [succes, setSucess] = useState("");
  const bikeScanned = useRef("");
  const schoolScanned = useRef("");

  useEffect(() => {
    if (session?.user.id) {
      fetchStudentbyId(session.user.id).then((data) => setStudent(data as StudentWithRides[]));
    }
  }, [session]);

  const handleError = (error : unknown) => {
    console.error("Error scanning QR code:", error);
    setError("There was a error mounting the camera, please make sure you allow camera access")
  };
  console.log(student)

  const handleScan = async (data: IDetectedBarcode[]) => {
    const scannedString = data[0].rawValue;

    if (data) {
      if (student && !bikeScanned.current && scannedString === student[0].bike_qr_code) {
        bikeScanned.current = scannedString; // Store the bike QR code in ref
        console.log("Bike QR code validated");
        setSucess("Bike QR code validated");

        setError("");
      }
      //  School QR code
      else if (
        bikeScanned.current &&
        !schoolScanned.current &&
        scannedString === schoolQr
      ) {
        schoolScanned.current = scannedString; 
        console.log("School QR code validated");
        setSucess("School QR code validated");
        setError("");
        await createRideRecord(); // Wait for ride creation
      }
      // Handle invalid QR scans
      else {
        if (!bikeScanned.current) {
          console.error("Invalid Bike QR code");
          setError("Invalid QR Code, First scan bike code");
        } else if (!schoolScanned.current) {
          console.error("Invalid School QR code");
          setError(
            "Invalid School code, make sure you scan school code after bike"
          );
        }
      }
    }
  };

  const createRideRecord = async () => {
    console.log("Checking QR codes before ride creation:");
    console.log("Bike QR: ", bikeScanned.current);
    console.log("School QR: ", schoolScanned.current);

    if (student && student[0] && bikeScanned.current && schoolScanned.current) {
      const rideData = {
        student_id: student[0].id,
        ride_date: new Date().toISOString(),
        bike_qr_scanned: bikeScanned.current,
        distance: student[0].distance_to_school,
        distance_img: student[0].distance_img
      };

      try {
        const { error } = await supabase.from("rides").insert(rideData);
        if (error) {
          alert("error");
        } 

        console.log("Ride created successfully:", rideData);
        setSucess("Ride created successfully")
        alert("Ride created successfully!");
      } catch (error) {
        console.error("Error creating ride:", error);
      }
    } else {
      console.log(
        "Unable to create ride. Make sure both QR codes are scanned."
      );
      alert("Unable to create ride. Make sure both QR codes are scanned.");
    }
  };

  return (
    <Box sx={{ mb: 4, mt: 4 }}>
      <StudentToolbar title="Scan QR Code" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "85vh",
          bgcolor: "gray",
          borderRadius: 10,
          opacity: 0.9,
          py: 4,
          px: 2, 
        }}
      >
        <Typography
          sx={{
            color: "white",
            mt: 4,
            mb: 4,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: 500 }}> Point the camera</span> steadily at
          the QR code to scan. Ensure the code is well-lit and{" "}
          <span style={{ fontWeight: 500 }}> fully visible within</span> the
          frame.
        </Typography>

        <Box sx={{ width: { xs: "90%", sm: "60%" } }}>
          {error && (
            <Typography
              color="red"
              border={"1px dotted red"}
              bgcolor={"brown"}
              py={1}
              fontWeight={600}
              variant="h6"
              sx={{ textAlign: "center", maxWidth: "90%", mx: "auto" }}
            >
              {error}
            </Typography>
          )}

          {succes && (
            <Box
              bgcolor={theme.palette.green.main}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                width: { xs: "98%", sm: "60%" }, 
                border: "1px dotted green",
                mx: "auto", 
                py: 1,
              }}
            >
              <Typography color={"white"} fontWeight={600} variant="h6">
                {succes}
              </Typography>
              <Check size={24} color="white" />
            </Box>
          )}

          <Box
            sx={{
              position: "relative",
              mt: 8,
              maxWidth: 450,
              m: "auto",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              maxHeight: 450,
              fontSize: 30,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: theme.palette.green.main,
                "--b": "5px",
                "--w": "20px",
                "--_g": "#0000 90deg,#000 0",
                "--_p": "var(--w) var(--w) no-repeat",
                "--mask":
                  "conic-gradient(from 90deg  at top    var(--b) left  var(--b),var(--_g)) 0    0    / var(--_p), " +
                  "conic-gradient(from 180deg at top    var(--b) right var(--b),var(--_g)) 100% 0    / var(--_p), " +
                  "conic-gradient(from 0deg   at bottom var(--b) left  var(--b),var(--_g)) 0    100% / var(--_p), " +
                  "conic-gradient(from -90deg at bottom var(--b) right var(--b),var(--_g)) 100% 100% / var(--_p)",
                WebkitMask: "var(--mask)",
                mask: "var(--mask)",
              },
            }}
          >
            <Scanner onScan={handleScan} onError={handleError} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
