import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import { RouterProvider } from "react-router-dom";  
import { router } from './router';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <AuthContextProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
    </AuthContextProvider> 
  </React.StrictMode>
)