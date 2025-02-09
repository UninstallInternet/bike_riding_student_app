import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Student } from "../lib/api";

interface AuthContextType {
  session: Session | null;
  profile: Student | null;
  loading: boolean;
  handleLogin: (credentials: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<{ session: Session | null; profile: Student | null }>({
    session: null,
    profile: null,
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log("Logged in", data);
      setUserInfo((prev) => ({ ...prev, session: data.session }));
     } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
     } finally {
      setLoading(false);
     }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserInfo((prev) => ({ ...prev, session }));
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserInfo({ session, profile: null });
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...userInfo, loading, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
