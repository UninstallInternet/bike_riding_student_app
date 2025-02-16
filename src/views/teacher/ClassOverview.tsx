import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { Bike, Users, TrendingUp, Award, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { fetchStudentsOverview, Student } from "../../lib/api";
interface ClassStatistics {
    totalDistance: number;
    averageDistance: number;
    topStudent: {
      name: string;
      distance: number;
    };
  }
const ClassOverview: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]); 
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());


  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("class")
        .neq("class", null);

      if (error) {
        console.error(error);
      } else {
        const uniqueClasses = Array.from(new Set(data.map((student) => student.class)));
        setClasses(uniqueClasses);
      }
    };
    fetchClasses();
  }, []);
  useEffect(() => {
    fetchStudentsOverview(selectedClass, selectedMonth).then((data) => setStudentsData(data));
  }, [selectedClass, selectedMonth]);

  const handleClassChange = async (event: SelectChangeEvent<string>) => {
    const className = event.target.value as string;
    setSelectedClass(className);
  };

const calculateClassStatistics = (students: Student[]): ClassStatistics => {
  if (students.length === 0) {
    return {
      totalDistance: 0,
      averageDistance: 0,
      topStudent: { name: '', distance: 0 },
    };
  }

  const totalDistance = students.reduce((sum, student) => {
    const distance = Number(student.totalDistance); 
    return sum + (isNaN(distance) ? 0 : distance); 
  }, 0);

  const topStudent = students.reduce((top, student) => {
    const distance = Number(student.totalDistance); 
    return distance > top.distance ? { name: student.name, distance } : top;
  }, { name: '', distance: 0 });

  const averageDistance = totalDistance / students.length;

  return {
    totalDistance,
    averageDistance,
    topStudent,
  };
};

  const stats = calculateClassStatistics(studentsData);


  return (
    <Box
      sx={{
        pb: { xs: 3, sm: 7 },
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        width: "95%",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Link to={"/teacher/dashboard"}>
          <IconButton edge="start" sx={{ mr: 4, mt: 1 }}>
            <ArrowLeft />
          </IconButton>
        </Link>
        <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
          General Overview
        </Typography>
      </Box>

      <Typography variant="h4" sx={{ mb: 3, color: "#111827", fontWeight: 700 }}>
      {selectedClass}  Class  Summary
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel id="class-select-label">Choose Class</InputLabel>
  <Select
    value={selectedClass}
    onChange={handleClassChange}
    labelId="class-select-label"
    label="Choose Class"
  >  <MenuItem value="All">All</MenuItem> 

    {classes.map((className) => (
      <MenuItem key={className} value={className}>
        {className}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel id="month-select-label">Choose Month</InputLabel>
  <Select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(Number(e.target.value))}
    labelId="month-select-label"
    label="Choose Month"
  >
    {Array.from({ length: 12 }, (_, i) => (
      <MenuItem key={i} value={i}>
        {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
      </MenuItem>
    ))}
  </Select>
</FormControl>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Bike size={24} color="#34D399" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Total Distance
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#34D399" }}>
              {stats.totalDistance.toFixed(1)} km
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Users size={24} color="#3B82F6" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Total Students
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#3B82F6" }}>
              {studentsData.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingUp size={24} color="#F59E0B" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Avg. Distance
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#F59E0B" }}>
              {stats.averageDistance.toFixed(1)} km
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Award size={24} color="#EF4444" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Top Student
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {stats.topStudent.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              {stats.topStudent.distance.toFixed(1)} km
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Monthly Progress */}
      <Paper elevation={2} sx={{ mt: 6, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Monthly Progress
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {stats.totalDistance.toFixed(1)} km / {500} km
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
          {Math.round((parseFloat(stats.totalDistance.toFixed(1)) / 500) * 100)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(parseFloat(stats.totalDistance.toFixed(1)) / 500) * 100}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#E5E7EB",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#34D399",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ClassOverview;
