import { Box } from "@mui/material";
import { StudentToolbar } from "../../components/StudentToolbar";
import RideHistory from "../../components/RideHistory";
import { useState, useEffect } from "react";
import { Rides, StudentWithRides, studentWithRidesQuery } from "../../lib/api";
import { UserAuth } from "../../context/AuthContext";

export const AllRides = () => {
  const [student, setStudent] = useState<StudentWithRides | null>(null);
  const [allRides, setAllRides] = useState<Rides[]>([]);
const {session} = UserAuth();
  useEffect(() => {
    const fetchStudentData = async () => {

      const data = await studentWithRidesQuery(session?.user.id as string);

      if (data) {
        setStudent(data)
        setAllRides(data.rides)
      }
    };

    fetchStudentData();
  }, []);

  return (
    <Box>
      <StudentToolbar title="All Rides" />
      <RideHistory student={student} singleRides={allRides} />
    </Box>
  );
};
