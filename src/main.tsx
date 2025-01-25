import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import { RouterProvider } from "react-router-dom";  
import { router } from './router';
import { AuthContextProvider } from './context/AuthContext';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
script.async = true;
script.onload = () => {
  console.log("Google Maps API loaded successfully.");
};

document.head.appendChild(script);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <AuthContextProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
    </AuthContextProvider> 
  </React.StrictMode>
)