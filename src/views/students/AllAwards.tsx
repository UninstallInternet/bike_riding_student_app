import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid } from "@mui/material"
import { StudentToolbar } from "../../components/StudentToolbar"
import { type Badge, fetchAllBadges, fetchStudentBadges, type StudentAward } from "../../lib/api"
import { UserAuth } from "../../context/AuthContext"
import { useState, useEffect } from "react"

export const AllAwards = () => {
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [studentBadges, setStudentBadges] = useState<StudentAward[]>([])
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const { session } = UserAuth()

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [allBadgesDataRaw, studentBadgesDataRaw] = await Promise.all([
          fetchAllBadges(),
          fetchStudentBadges(session?.user.id as string),
        ])

        const allBadgesData = allBadgesDataRaw || []
        const studentBadgesData = studentBadgesDataRaw || []

        setAllBadges(allBadgesData as Badge[])
        setStudentBadges(studentBadgesData as StudentAward[])
      } catch (error) {
        console.error("Error fetching badges:", error)
      }
    }

    fetchBadges()
  }, [session?.user.id])

  const handleClickOpen = (badge: Badge) => {
    setSelectedBadge(badge)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedBadge(null)
  }

  return (
    <Box sx={{ mb: 4, mt: 1 }}>
      <StudentToolbar title="All Awards" />
      <Box
        sx={{
          width: "100%",
          margin: "auto",
        }}
      >
        <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
          {allBadges.map((badge) => {
            const isObtained = studentBadges.some((b) => b.badge_id === badge.id && b.awarded_at)

            return (
              <Grid item xs={4} sm={3} md={1.2} key={badge.id}>
                <Box
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    opacity: isObtained ? 1 : 0.5,
                    filter: isObtained ? "none" : "grayscale(100%)",
                  }}
                  onClick={() => handleClickOpen(badge)}
                >
                  <img
                    src={badge.icon_url || "/default-icon.png"}
                    alt={badge.name}
                    style={{ width: "80px", height: "80px", maxWidth: "100%" }}
                  />
                </Box>
              </Grid>
            )
          })}
        </Grid>

        {selectedBadge && (
          <Dialog
            slotProps={{
              paper: { sx: { borderRadius: "28px" } },
            }}
            open={open}
            onClose={handleClose}
          >
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  opacity: studentBadges.some((b) => b.badge_id === selectedBadge.id && b.awarded_at) ? 1 : 0.5,
                  filter: studentBadges.some((b) => b.badge_id === selectedBadge.id && b.awarded_at)
                    ? "none"
                    : "grayscale(100%)",
                }}
              >
                <img
                  src={selectedBadge.icon_url || "/default-icon.png"}
                  alt={selectedBadge.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginBottom: "10px",
                    paddingTop: "15px",
                  }}
                />
              </Box>

              <DialogTitle>
                {" "}
                {studentBadges.some((b) => b.badge_id === selectedBadge.id && b.awarded_at) ? "🎉" : ""}{" "}
                {selectedBadge.name}
              </DialogTitle>
              <Typography textAlign="center" variant="body1">
                {selectedBadge.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: "black" }}>
                <Typography color="black">Close</Typography>
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  )
}

