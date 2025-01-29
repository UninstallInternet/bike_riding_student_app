import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthContextProvider } from "./context/AuthContext";
import { Libraries, LoadScript } from "@react-google-maps/api";
const libraries: Libraries = ["places"];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
      libraries={libraries}
    >
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthContextProvider>
    </LoadScript>
  </React.StrictMode>
);
