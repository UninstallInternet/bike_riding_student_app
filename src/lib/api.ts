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

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
  if (error) {
    console.error(error);
    return [];
  } else {
    return data;
  }
};

export const addStudent = async (student: Student) => {

  const { data, error } = await supabase
    .from('students')
    .insert([student])
    .select();

  if (error) {
    console.error('Student Insert Error:', error);
    return null;
  }

  return data;
  
};
export const fetchTeacher = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
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



export const exportStudentsCsv = async (studentIds?: string[]) => {
  if (!studentIds || studentIds.length === 0) {
    console.error("No students selected for export.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("students")
      .select("id, name, class, is_active")
      .in("id", studentIds);

    if (error) {
      console.error("Error fetching students for CSV export:", error);
      return;
    }

    if (data && data.length > 0) {
      const csvRows = [
        ["ID", "Name", "Class", "Is Active"],
        ...data.map(student => [
          student.id,
          student.name,
          student.class,
          student.is_active ? "Active" : "Inactive",
        ]),
      ];

      const csvContent = csvRows.map(row => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("CSV export successful.");
    } else {
      console.log("No student data found for the selected IDs.");
    }
  } catch (error) {
    console.error("Error exporting students to CSV:", error);
  }
};


//types, coming from supabase.

export type Student = Database["public"]["Tables"]["students"]["Row"];
export type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
