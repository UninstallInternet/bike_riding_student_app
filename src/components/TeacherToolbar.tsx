import {
  Drawer,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  AppBar,
} from "@mui/material";
import {
  ArrowLeft,
  Menu,
  X,
  UserPlus,
  Home,
  BarChart,
  ChevronRight,
  Download,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";
import { useEffect, useState } from "react";
import { fetchStudentsQrs, handleLogout } from "../lib/api";
import { UserAuth } from "../context/AuthContext";
import { theme } from "../theme/theme";
import jsPDF from "jspdf";
import QRCode from "qrcode";
interface TeacherToolbarProps {
  title: string;
  showBackArrow?: boolean;
}

type QrCode = {
  name: string;
  bike_qr_code: string;
};

export const TeacherToolbar = ({
  title,
  showBackArrow = true,
}: TeacherToolbarProps) => {
  const [open, setDrawerOpen] = useState(false);
  const { session } = UserAuth();
  const [pdfs, setPdfs] = useState<QrCode[]>([]);
  const navigate = useNavigate();

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

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      link: "/teacher/dashboard",
    },
    {
      title: "Add a new user",
      icon: <UserPlus size={20} />,
      link: "/teacher/adduser",
    },
    {
      title: "General Overview",
      icon: <BarChart size={20} />,
      link: "/teacher/overview",
    },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        {showBackArrow && (
          <IconButton
            edge="start"
            component={Link}
            to="/teacher/dashboard"
            sx={{
              mr: 2,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <ArrowLeft />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="h1"
          sx={{ fontWeight: 500, flexGrow: 1 }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>


          <IconButton
            edge="end"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            sx={{
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <Menu />
          </IconButton>
        </Box>

        <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: { width: { xs: "100%", sm: 300 } },
          }}
        >
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <IconButton onClick={toggleDrawer(false)}>
                <X size={20} />
              </IconButton>
            </Box>
            <Box
              component={Link}
              to="/teacher/editself"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <UserAvatar />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1">Your Profile</Typography>
                <Typography variant="body2" color="text.secondary">
                  View and edit your profile
                </Typography>
              </Box>
            </Box>
            {menuItems.map((item) => (
              <Button
                key={item.title}
                component={Link}
                to={item.link}
                startIcon={item.icon}
                endIcon={<ChevronRight size={16} />}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  px: 2,
                  py: 1.5,
                  mb: 1,
                  color: "#121212",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {item.title}
              </Button>
            ))}
            <Box sx={{ flexGrow: 1 }} />
            {session && (
              <Button
                variant="contained"
                onClick={() => handleLogout(navigate)}
                sx={{
                  mt: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: "15px",
                  p: 1,
                  px: 3,
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Log Out
              </Button>
            )}

            <Button
              sx={{
                mt: 2,
                bgcolor: theme.palette.blue.main,
                color: "white",
                borderRadius: "15px",
                p: 1,
                px: 3,
                gap:1,
                fontWeight: 500,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "blue",
                },
              }}
              onClick={handleSavePDF}
              variant="contained"
            >
              Save QRs PDF
              <Download size={20} />
            </Button>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
