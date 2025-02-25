import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  fetchStudentsQrs,
  fetchTeacher,
  Teacher,
  updateTeacherPicture,
} from "../../lib/api";
import { useEffect, useState } from "react";
import { Camera, Download } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import { theme } from "../../theme/theme";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { TeacherToolbar } from "../../components/TeacherToolbar";

type QrCode = {
  name: string;
  bike_qr_code: string;
};

export const TeacherEditSelf = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pdfs, setPdfs] = useState<QrCode[]>([]);
  const [sucess, setSucess] = useState("");

  const { session } = UserAuth();
  useEffect(() => {
    setLoading(true);
    fetchTeacher().then((data) => setTeacher(data as Teacher));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudentsQrs().then((data) => setPdfs(data as QrCode[]));
  }, []);

  const handleSavePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const columns = 3;
    const cellWidth = (pageWidth - margin * 2) / columns;
    const cellHeight = 80;
    const qrSize = 50;

    let currentY = margin + 10;

    doc.text("Student QR Codes", margin, margin);

    if (Array.isArray(pdfs)) {
      const rows = [];
      for (let i = 0; i < pdfs.length; i += columns) {
        rows.push(pdfs.slice(i, i + columns));
      }

      for (const row of rows) {
        if (currentY + cellHeight > pageHeight) {
          doc.addPage();
          currentY = margin;
        }

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const pdf = row[colIndex];
          const currentX = margin + colIndex * cellWidth;

          doc.text(`${pdf.name}`, currentX, currentY);

          const qrDataURL = await QRCode.toDataURL(pdf.bike_qr_code, {
            scale: 10,
          });

          const imageX = currentX;
          const imageY = currentY + 5;

          doc.setLineWidth(1);
          doc.rect(imageX, imageY, qrSize, qrSize);

          doc.addImage(qrDataURL, "PNG", imageX, imageY, qrSize, qrSize);
        }

        currentY += cellHeight;
      }
    } else {
      doc.text("No QR codes found.", margin, currentY);
    }

    doc.save("students_qr_codes.pdf");
  };

  const handlePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && teacher) {
      setUploading(true);
      try {
        const updatedTeacher = await updateTeacherPicture(
          session?.user.id as string,
          file
        );
        setSucess("Picture updated successfully");

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
      <TeacherToolbar title="Edit Profile" showBackArrow={true} />
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
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
          <Typography
            color={theme.palette.green.main}
            sx={{ mt: 2, fontWeight: 500 }}
          >
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

        <Button
          sx={{
            p: 2,
            gap: 1,
            color: "white",
            borderRadius: 6,
            width: "70%",
            mt: 6,
            bgcolor: theme.palette.blue.main

          }}
          onClick={handleSavePDF}
          variant="contained"
        >
          Save QRs PDF
          <Download size={20} />
        </Button>
      </Box>
    </Box>
  );
};
