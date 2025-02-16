import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { QrCode, ChevronUp } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import {
  fetchStudents,
  handleLogout,
  Rides,
  StudentWithRides,
  studentWithRidesQuery,
} from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";
import BikingStatsCard from "../../components/BikingStatsCard";
import { LeaderboardPreview } from "../../components/LeaderboardPreview";
import { LeaderboardUser } from "../../lib/specificTypes";
import RideHistory from "../../components/RideHistory";
import StudentBadges from "../../components/StudentBadges";
import { CircularProgress, useMediaQuery } from "@mui/material";
import PrivacyDialog from "../../components/PrivacyDialog";
import RidesDrawer from "../../components/RidesDrawer";
import { CalendarComponent } from "../../components/CalendarComponent";
import { UserAvatar } from "../../components/UserAvatar";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [rideDays, setRideDays] = useState<{ day: number; id: string }[]>([]);
  const [singleRides, setSingleRides] = useState<Rides[]>([]);
  const [allRides, setAllRides] = useState<Rides[]>([]);
  const { session } = UserAuth();
  const [student, setStudent] = useState<StudentWithRides | null>(null);
  const [rideCount, setRideCount] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:435px)");
  useEffect(() => {
    if (student?.id) {
      const hasSeenPrivacyDialog = sessionStorage.getItem(
        `hasSeenPrivacyDialog-${student.id}`
      );

      if (!hasSeenPrivacyDialog) {
        setShowPrivacyDialog(true);
      }
    }
  }, [student]);

  const handlePrivacyDialogClose = () => {
    if (student?.id) {
      sessionStorage.setItem(`hasSeenPrivacyDialog-${student.id}`, "true");
    }
    setShowPrivacyDialog(false);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!session?.user?.id) return;

      try {
        const studentData = await studentWithRidesQuery(session.user.id);

        if (studentData) {
          setStudent(studentData as StudentWithRides);
          setRideCount(studentData.rides ? studentData.rides.length : 0);
          setAllRides(studentData.rides as Rides[]);

          if (studentData.rides?.length > 0) {
            const sortedRides = studentData.rides.sort(
              (a, b) =>
                new Date(b.ride_date as string).getTime() -
                new Date(a.ride_date as string).getTime()
            );
            setSingleRides([sortedRides[0]]);
          } else {
            setSingleRides([]);
          }
        } else {
          setStudent(null);
          setRideCount(0);
          setSingleRides([]);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setRideCount(0);
        setSingleRides([]);
      }
    };

    fetchStudentData();
  }, []);

  const fetchRideDays = async (month: number, year: number) => {
    if (!session?.user?.id) return;

    const studentData = await studentWithRidesQuery(session.user.id);
    if (studentData?.rides) {
      const filteredRides = studentData.rides.filter((ride) => {
        const rideDate = new Date(ride.ride_date);
        return rideDate.getMonth() === month && rideDate.getFullYear() === year;
      });

      const rideDays = filteredRides.map((ride) => ({
        day: new Date(ride.ride_date).getDate(),
        id: ride.id,
      }));

      setRideDays(rideDays);
    }
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction);

    setCurrentDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());

    fetchRideDays(newDate.getMonth(), newDate.getFullYear());
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  useEffect(() => {
    fetchRideDays(currentMonth, currentYear);
  }, [currentMonth, currentYear]);
  const totalBikedAmount = student?.distance_to_school
    ? student.distance_to_school * rideCount
    : 0;

  useEffect(() => {
    const loadData = async () => {
      const data: LeaderboardUser[] = await fetchStudents();
      setLeaderboard(data);
    };

    loadData();
  }, []);
  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };
  if (!student) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ pb: 4 }}>
      {showPrivacyDialog && (
        <PrivacyDialog
          onDecline={handlePrivacyDialogClose}
          onAccept={handlePrivacyDialogClose}
          open={showPrivacyDialog}
          onClose={handlePrivacyDialogClose}
        />
      )}

      {/* Header */}
      <Box sx={{ pt: 2, pb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "100%",
            mb: 2,
          }}
        >
          <Link to={"/student/edit"}>
            <UserAvatar />
          </Link>

          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Student Dashboard
          </Typography>
          {session && (
            <Button
              variant="contained"
              onClick={() => handleLogout(navigate)}
              sx={{
                bgcolor: "primary",
                color: "white",
                borderRadius: "15px",
                p: 1,

                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
            >
              Log Out
            </Button>
          )}
        </Box>
        <Box
          sx={{
            m: "auto",
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Typography
            textAlign={"center"}
            fontSize={isSmallScreen ? 16 : 24}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            👋 Welcome,
            <Typography
              component="span"
              fontWeight={600}
              fontSize={isSmallScreen ? 16 : 24}
            >
              {student?.name.split(" ")[0]}!
            </Typography>
            <Typography fontSize={isSmallScreen ? 16 : 24} component="span">
              You're in class
              <Typography
                component="span"
                fontWeight={600}
                ml={1}
                fontSize={isSmallScreen ? 16 : 24}
              >
                {student?.class}.
              </Typography>
            </Typography>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{ bgcolor: "#F5F7FA", width: "100%", m: "auto", borderRadius: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 4,
            width: { xs: "93%", sm: "80%" },
            m: "auto",
          }}
        >
          <BikingStatsCard
            rideCount={rideCount}
            totalBikedAmount={totalBikedAmount}
          />
        </Box>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#F5F7FA",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Last Ride
          </Typography>{" "}
          <Box sx={{ width: { xs: "98%", md: "80%" }, mb: 2 }}>
            <RideHistory student={student} singleRides={singleRides} />
          </Box>
          <CalendarComponent
            monthName={monthName}
            year={year}
            currentMonth={currentMonth}
            currentYear={currentYear}
            firstDayOfMonth={firstDayOfMonth}
            daysInMonth={daysInMonth}
            rideDays={rideDays}
            handleMonthChange={handleMonthChange}
          />
          <Box
            sx={{
              bgcolor: "white",
              pt: 3,
              pb: 4,
              px: 2,
              border: "1px solid ",
              width: { xs: "89%", sm: "79%" },

              borderColor: "divider",
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
              Your Environmental Impact
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                pb: 5,
                pt: 5,
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  height: 100,
                  maxWidth: "50%",
                }}
              >
                <Typography variant="body2" color="black" fontSize={16}>
                  <Typography fontWeight={500}  component={"span"}>
                    {totalBikedAmount > 0
                      ? ((totalBikedAmount * 95) / 1000).toFixed(0)
                      : 0}{" "}
                    kg
                  </Typography >{" "}
                  CO2 Saved
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <img
                    src="/bike.png"
                    alt="Trees"
                    style={{ height: 40, marginTop: 2 }}
                  />
                </Box>
              </Box>

              <Typography variant="h6">=</Typography>

              <Box
                sx={{
                  textAlign: "center",
                  maxWidth: "50%",
                  ml:1,
                  height: 100,
                }}
              >
                <Typography variant="body2" color="black" fontSize={16}>
                  <Typography color="black" component={"span"} fontWeight={500}>
                    {totalBikedAmount > 0
                      ? Math.floor(totalBikedAmount / 100)
                      : 0}
                  </Typography>{" "}
                  Trees planted
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <img src="/tree.png" alt="Trees" style={{ height: 64 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 3 }}>
        <LeaderboardPreview leaderboard={leaderboard} />
<Link to={"/student/awards"}>
        <Typography
          variant="h6"
          sx={{ mb: 2, ml: 1, mt: 6, textAlign: "left" }}
          >
          Earned awards
        </Typography>
          </Link>
        <StudentBadges studentId={session?.user.id as string} />
      </Box>

      <Button
        variant="contained"
        sx={{
          bgcolor: "primary",
          color: "white",
          borderRadius: "15px",
          p: 1,
          mt: 4,
          width: "99%",
          fontWeight: 500,
          transition: "all 0.3s ease",
        }}
        onClick={handleDrawerToggle}
      >
        <Typography color="white" variant="h6">
          Ride History
        </Typography>
        <ChevronUp size={18} color="white" />
      </Button>
      <RidesDrawer
        open={openDrawer}
        handleDrawerToggle={handleDrawerToggle}
        student={student}
        allRides={allRides}
      />
      <Link to={"/student/createride"}>
        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#35D187",
              color: "white",
              py: { xs: 1.5, sm: 2 },
              width: { xs: "38%", sm: "20%" },
              px: { xs: 0.5, sm: 1 },
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "#2bb974",
              },
            }}
          >
            <QrCode size={18} />
            <Typography fontSize={17} sx={{ marginLeft: 1 }}>
              Log Ride
            </Typography>
          </Button>
        </Box>
      </Link>
    </Box>
  );
}
