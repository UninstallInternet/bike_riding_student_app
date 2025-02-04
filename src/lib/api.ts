// import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { Database } from "../db_types";
import { supabase } from "./supabase";

// export const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
//   if (!("email" in credentials)) return;
//   const { email, password } = credentials;
//   const { error, data } = await supabase.auth.signUp({
//     email,
//     password,
//   });
//   if (error) console.error(error.message);
//   console.log(data);
// };

export const handleLogout = async (navigate: (path: string) => void) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out", error.message);
  } else {
    console.log("Logged out successfully");
    navigate("/");
  }
};

export const fetchUsers = async () => {
  const { data, error } = await supabase.from("students").select(
    `*,
      rides (id, distance)`
  );

  if (error) {
    console.error(error);
    return [];
  } else {
    
    const studentsWithRidesAndDistance = data.map((student) => {
      const ride_count = student.rides.length;
      const totalDistance = student.rides.reduce(
        (sum: number, ride: Rides) => sum + (ride.distance ?? 0),
        0
      );
      return {
        ...student,
        ride_count, 
        totalDistance, 
      };
    });

    const sortedStudents = studentsWithRidesAndDistance.sort(
      (a, b) => b.totalDistance - a.totalDistance
    );

    return sortedStudents;
  }
};
export const addStudent = async (student: Student) => {
  const { data, error } = await supabase
    .from("students")
    .insert([student])
    .select();

  if (error) {
    console.error("Student Insert Error:", error);
    return null;
  }

  return data;
};
export const fetchTeacher = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("teachers")
      .select("name")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching teacher data:", error);
    } else {
      return data;
    }
  }
};

export const deleteStudents = async (studentIds: string[]) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .in("id", studentIds);

  if (error) {
    console.error("Error deleting students:", error);
    return false;
  }
  return true;
};

export const deactivateStudents = async (studentIds: string[]) => {
  const { error } = await supabase
    .from("students")
    .update({ is_active: false })
    .in("id", studentIds);

  if (error) {
    console.error("Error deactivating students:", error);
    return false;
  }
  return true;
};

export const exportStudentsCsv = async (
  studentIds: string[],
  fields: string[],
  classFilter?: string
) => {
  if ((!studentIds || studentIds.length === 0) && !classFilter) {
    return;
  }
  try {
    let query = supabase.from("students").select(
      `
        name,
        class,
        address,
        distance_to_school,
        bike_qr_code,
        rides(count)`
    );

    if (classFilter) {
      query = query.eq("class", classFilter);
    } else {
      query = query.in("id", studentIds);
    }
    const { data, error } = await query.csv();

    if (error) {
      console.error("Error fetching students for CSV export:", error);
      return;
    }

    if (!data) {
      console.error("No CSV data received.");
      return;
    }

    const lines = data.split("\n");
    const headers = lines[0].split(",");

    const nameIndex = headers.indexOf("name");
    const classIndex = headers.indexOf("class");

    if (!fields.includes("name") && nameIndex !== -1) {
      headers.splice(nameIndex, 1);
    }
    if (!fields.includes("class") && classIndex !== -1) {
      const adjustedClassIndex = fields.includes("name")
        ? classIndex
        : classIndex - 1;
      headers.splice(adjustedClassIndex, 1);
    }

    headers.push("total Km");

    const processedLines = lines.map((line, index) => {
      const columns = line.split(",");

      if (!fields.includes("name") && nameIndex !== -1) {
        columns.splice(nameIndex, 1);
      }

      if (!fields.includes("class") && classIndex !== -1) {
        const adjustedClassIndex = fields.includes("name")
          ? classIndex
          : classIndex - 1;
        columns.splice(adjustedClassIndex, 1);
      }

      if (index !== 0) {
        const countColumn = columns[columns.length - 1];
        const distanceColumn = columns[columns.length - 3];

        const countValue = parseInt(countColumn.match(/\d+/)?.[0] || "0", 10);
        const distanceValue = parseFloat(distanceColumn) || 0;

        const totalBikedAmount = distanceValue * countValue;
        columns.push(totalBikedAmount.toString());

        columns[columns.length - 2] = countValue.toString();
      }

      return columns.join(",");
    });

    processedLines[0] = headers.join(",");

    const processedData = processedLines.join("\n");

    const blob = new Blob([processedData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting students to CSV:", error);
  }
};

export const studentWithRidesQuery = async (id: string) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `id, name, class, address, distance_to_school, bike_qr_code, starting_year,is_active, rides(id,ride_date)`
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching student details:", error);
    return null;
  }

  return data;
};
export const fetchRides = async (studentId: string): Promise<Rides[]> => {
  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("student_id", studentId);

  if (error) {
    throw new Error(error.message);
  }
  return data as Rides[];
};

//types coming from supabase
export type StudentWithRides = Awaited<
  ReturnType<typeof studentWithRidesQuery>
>;

export type Student = Database["public"]["Tables"]["students"]["Row"];
export type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
export type Rides = Database["public"]["Tables"]["rides"]["Row"];
