"use client"

import type React from "react"

import { Drawer, Toolbar, Typography, Box, Button, IconButton, AppBar } from "@mui/material"
import { ArrowLeft, Menu, X, Home, Bike, Award, ChevronRight, Medal, QrCode } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { UserAvatar } from "./UserAvatar"
import { useState } from "react"
import { handleLogout } from "../lib/api"
import { UserAuth } from "../context/AuthContext"

interface StudentToolbarProps {
  title: string
  showBackArrow?: boolean
}

export const StudentToolbar = ({ title, showBackArrow = true }: StudentToolbarProps) => {
  const [open, setDrawerOpen] = useState(false)
  const { session } = UserAuth()
  const navigate = useNavigate()

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
  }

  const menuItems = [
    { title: "Dashboard", icon: <Home size={20} />, link: "/student/dashboard" },
    { title: "All rides", icon: <Bike size={20} />, link: "/student/allrides" },
    { title: "Create a ride", icon: <QrCode size={20} />, link: "/student/createride" },
    { title: "Leaderboard", icon: <Medal size={20} />, link: "/student/leaderboard" },
    { title: "Awards", icon: <Award size={20} />, link: "/student/awards" },
  ]

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        {showBackArrow && (
          <IconButton
            edge="start"
            component={Link}
            to="/student/dashboard"
            sx={{
              mr: 2,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <ArrowLeft />
          </IconButton>
        )}

        <Typography variant="h6" component="h1" sx={{ fontWeight: 500, flexGrow: 1 }}>
          {title}
        </Typography>

        <IconButton
          edge="end"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          sx={{
            display: { xs: "block", sm: "block" },
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <Menu />
        </IconButton>

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
              to="/student/edit"
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
                  color:"#121212",
                  px: 2,
                  py: 1.5,
                  mb: 1,
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
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

