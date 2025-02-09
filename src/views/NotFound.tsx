import type React from "react"
import { Box, Typography, Button, Container } from "@mui/material"
import { FrownIcon, Home } from "lucide-react"
import { useNavigate } from "react-router-dom" 

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate() 

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <FrownIcon size={80} color="#34D399" style={{ marginBottom: "2rem" }} />
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: "#111827", fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#4B5563", mb: 4 }}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: "#6B7280", mb: 4, maxWidth: "80%" }}>
          We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/")} 
          sx={{
            bgcolor: "#34D399",
            color: "white",
            "&:hover": {
              bgcolor: "#10B981",
            },
            borderRadius: "8px",
            px: 4,
            py: 1.5,
            fontSize: "1rem",
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  )
}

export default NotFoundPage
