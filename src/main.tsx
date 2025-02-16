import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthContextProvider } from "./context/AuthContext";
import { Libraries, LoadScript } from "@react-google-maps/api";
import ErrorBoundary from "./components/ErrorBoundary";
const libraries: Libraries = ["places"];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
    <ErrorBoundary>

    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
      libraries={libraries}
      language="en"
      >
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
    </LoadScript>
      </ErrorBoundary>
      </AuthContextProvider>
  </React.StrictMode>
);
