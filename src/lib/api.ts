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

export const addStudent = async (studentData: Student) => {

  const { data, error } = await supabase
    .from('students')
    .insert({
      name: studentData.name,
      email: studentData.email,
      password: studentData.password, // Note: In production, hash this!
      address: studentData.address,
      starting_year: studentData.starting_year,
      class: studentData.class,
      distance_to_school: studentData.distance_to_school, 
      // bike_qr_code: bikeQrCode,
      is_active: true, 
    })
    .select();

  if (error) {
    console.error('Student Insert Error:', error);
    return null;
  }

  return data;
  
};

export const fetchUserData = async () => {
  const user = await supabase.auth.getUser();
  if (user?.data) {
    const { data, error } = await supabase
      .from("teachers")
      .select("name")
      .single(); // Since there should be one teacher with the email

    if (error) {
      console.error("Error fetching teacher data:", error);
    } else {
     return data
    }
  }
};



//types, coming from supabase.

export type Student = Database["public"]["Tables"]["students"]["Row"];
