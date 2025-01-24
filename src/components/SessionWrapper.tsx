import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ReactNode } from "react";


//session wrapper to prevent from entering if unauth
function Wrapper({ children }: { children: ReactNode }) {
  const { session, loading } = UserAuth(); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return session ? <>{children}</> : <Navigate to="/login/teacher" />;
}

export default Wrapper;
