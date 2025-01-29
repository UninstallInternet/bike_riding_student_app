// router.tsx
import { createBrowserRouter } from "react-router-dom";
import StudentLoginPage from "./components/StudentLoginPage";
import TeacherLoginPage from "./components/TeacherLoginPage";
import App from "./App";
import SendResetLink from "./components/SendResetLink";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddStudent";
import ResetPassword from "./components/ResetPassWord";
import TeacherRegister from "./components/TeacherRegister";
// import Wrapper from "./components/SessionWrapper";
import StudentDetails from "./components/StudentDetail";
import EditStudent from "./components/EditStudent";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login/teacher", element: <TeacherLoginPage /> },
  { path: "/login/student", element: <StudentLoginPage /> },
  { path: "/login/reset", element: <SendResetLink /> },
  { path: "/login/passwordreset", element: <ResetPassword /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  { path: "/adduser", element: <AddUser /> },
  { path: "/register", element: <TeacherRegister /> },
  { path: "/student/:id", element: <StudentDetails /> },
  { path: "/edit/:id", element: <EditStudent /> },
]);
