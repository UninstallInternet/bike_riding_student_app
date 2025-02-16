import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Wrapper({ children }: { children: ReactNode }) {
  const { session, loading } = UserAuth();
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!session) {
      setCheckingRole(false);
      return;
    }
  
    const fetchUserRole = async () => {
      setCheckingRole(true);
      const { data: teacher, error } = await supabase
        .from("teachers")
        .select("id")
        .eq("id", session.user.id)
        .single();
  
      const newRole = error || !teacher ? "student" : "teacher";
      setRole(newRole);
      localStorage.setItem("role", newRole); 
      setCheckingRole(false);
    };
  
    fetchUserRole();
  }, [session]); 
  
  
  

  if (loading || checkingRole) {
    return <div>Loading...</div>;
  }

  if (!session || role !== "teacher") {
    return <Navigate to="/login/teacher" />;
  }

  return <>{children}</>;
}

export default Wrapper;
