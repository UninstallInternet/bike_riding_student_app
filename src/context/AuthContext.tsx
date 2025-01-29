import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { Session, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { Student } from "../lib/api";

interface AuthContextType {
  session: Session | null | undefined;
  loading: boolean;
  handleLogin: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
}
export interface UserInfo {
  session: Session | null;
  profile: Student | null;
  loading?: boolean;
  saveProfile?: (updatedProfile: Student, avatarUpdated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    session: null,
    profile: null,
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: SignUpWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      setLoading(false)
      return;
    }

    console.log("Logged in", data);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserInfo({ ...userInfo, session });
      console.log(userInfo);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserInfo({ session, profile: null });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
