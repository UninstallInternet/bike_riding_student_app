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
    navigate("/");
  }
};

export const fetchStudents = async () => {
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
    return;
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
      .select("name, id, profile_pic_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching teacher data:", error);
    } else {
      return data;
    }
  }
};

export const fetchStudentbyId = async (id: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id);
  if (error) {
    console.error("Error fetching current student data:", error);
  } else {
    return data;
  }
};

export const fetchStudentImage = async (id: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("profile_pic_url")
    .eq("id", id);
  if (error) {
    console.error("Error fetching current student data:", error);
  } else {
    return data;
  }
};

export const updateStudentPicture = async (id: string, file: File) => {
  const fileExt = file.name.split(".").pop()
  const fileName = `${id}-${Math.random()}.${fileExt}`

  const {  error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file)
  
  if (uploadError) {
    console.error("Upload error:", uploadError)
    throw uploadError
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)

  if (!data || !data.publicUrl) {
    console.error("Error retrieving public URL for file:", fileName)
    throw new Error("Failed to retrieve the public URL.")
  }

  const publicUrl = data.publicUrl

  const { data: studentData, error: updateError } = await supabase
    .from("students")
    .update({ profile_pic_url: publicUrl })
    .eq("id", id)
    .select()
    .single()

  if (updateError) {
    console.error("Update error:", updateError)
    throw updateError
  }

  return studentData
}

export const updateTeacherPicture = async (id: string, file: File) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${id}-${Math.random()}.${fileExt}`;

  if(!id){
    console.error("Mus be authenticated to update image")
    return;
  }
  const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
  
  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }


  const { data } = await supabase.storage.from("avatars").getPublicUrl(fileName);
  
  if (!data || !data.publicUrl) {
    console.error("Error retrieving public URL for file:", fileName);
    throw new Error("Failed to retrieve the public URL.");
  }

  const publicUrl = data.publicUrl;

  const { data: teachersData, error: updateError } = await supabase
    .from("teachers")
    .update({ profile_pic_url: publicUrl })
    .eq("id", id)
    .select()
    .single()
  if (updateError) {
    console.error("Update error:", updateError);
    throw updateError;
  }

  return teachersData;
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

export const fetchGeolocation = async(id: string) => {
  const {data, error} = await supabase.from("students").select("id,lat,lng").eq("id", id)
  if(error){
    console.log("error trying to fetch lat and lng", error)
  }
  return data;
}

export const studentWithRidesQuery = async (id: string) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `id, name, class, address, distance_to_school, bike_qr_code, lat,lng,starting_year,is_active, distance_img, profile_pic_url, rides(*)`
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

export const fetchDetailRide = async (id: string) => {
  const { data, error } = await supabase
    .from("rides")
    .select("*, students(lat, lng, distance_img)") 
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export async function fetchStudentBadges(studentId: string) {
  const { data, error } = await supabase
    .from("student_awards")
    .select(
      `
      id,
      awarded_at,
      badge_id,
      created_at,
      student_id,
      awards(id,name, description, icon_url)
    `
    )
    .eq("student_id", studentId);

  if (error) {
    console.error("Error fetching badges:", error);
  }

  return data;
}

export type StudentWithRides = {
  id: string;
  name: string;
  class: string;
  address: string;
  distance_to_school: number;
  bike_qr_code: string;
  lat: number;
  lng: number;
  starting_year: string;
  is_active: boolean;
  distance_img: string;
  profile_pic_url: string | undefined;
  rides: { id: string; ride_date: string }[];
};



export type DetailedRide = {
  bike_qr_scanned: string;
  distance: number | null;
  id: string;
  ride_date: string | null;
  student_id: string | null;
  students: {
    lat: number;
    lng: number;
    distance_img: string;
  };
};

export type StudentAwards = Awaited<ReturnType<typeof fetchStudentBadges>>;

export type Student = Database["public"]["Tables"]["students"]["Row"];
export type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
export type Rides = Database["public"]["Tables"]["rides"]["Row"];
export type StudentAward =
  Database["public"]["Tables"]["student_awards"]["Row"];
export type Award = Database["public"]["Tables"]["awards"]["Row"];
