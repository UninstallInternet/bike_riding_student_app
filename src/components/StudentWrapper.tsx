import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function StudentWrapper({ children }: { children: ReactNode }) {
  const { session, loading } = UserAuth();
  const [role, setRole] = useState<string | null>(localStorage.getItem("role") || null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (session && role === null) {
      const fetchUserRole = async () => {
        setCheckingRole(true);
        const { data: student, error } = await supabase
          .from("students")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (error || !student) {
          setRole("teacher");
          localStorage.setItem("role", "teacher");
        } else {
          setRole("student");
          localStorage.setItem("role", "student"); 
        }
        setCheckingRole(false);
      };

      fetchUserRole();
    } else {
      setCheckingRole(false);
    }
  }, [session, role]);  

  if (loading || checkingRole) {
    return <div>Loading..</div>;
  }

  if (!session || role !== "student") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default StudentWrapper;
