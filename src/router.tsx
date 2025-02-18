import { createBrowserRouter } from "react-router-dom";
import StudentLoginPage from "./views/students/StudentLoginPage";
import TeacherLoginPage from "./views/teacher/TeacherLoginPage";
import App from "./App";
import SendResetLink from "./views/SendResetLink";
import Dashboard from "./views/teacher/Dashboard";
import AddUser from "./views/teacher/AddStudent";
import ResetPassword from "./views/ResetPassWord";
import TeacherRegister from "./components/TeacherRegister";
import Wrapper from "./components/SessionWrapper";
import StudentDetails from "./views/teacher/StudentDetail";
import EditStudent from "./views/teacher/EditStudent";
import StudentDashboard from "./views/students/StudentDashboard";
import { Leaderboard } from "./views/students/Leaderboard";
import RideDetails from "./views/students/RideDetails";
import { CreateRide } from "./views/students/CreateRide";
import { AllRides } from "./views/students/AllRides";
import StudentWrapper from "./components/StudentWrapper";
import { StudentEditSelf } from "./views/students/StudentEditSelf";
import { TeacherEditSelf } from "./views/teacher/EditSelf";
import NotFoundPage from "./views/NotFound";
import ClassOverview from "./views/teacher/ClassOverview";
import { AllAwards } from "./views/students/AllAwards";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login/teacher", element: <TeacherLoginPage /> },
  {path:"*", element: <NotFoundPage/>},
  {
    path: "/student/dashboard",
    element: (
      <StudentWrapper>
        <StudentDashboard />
      </StudentWrapper>
    ),
  },

  { path: "/student/leaderboard", element: (<StudentWrapper> <Leaderboard /></StudentWrapper>) },
  { path: "/login/student", element: <StudentLoginPage /> },
  { path: "/login/reset", element: <SendResetLink /> },
  { path: "/login/passwordreset", element: <ResetPassword /> },
  { path: "/ride/:id", element: <RideDetails /> },
  { path: "/student/createride", element: <CreateRide /> },
  { path: "/student/allrides", element:(<StudentWrapper><AllRides /></StudentWrapper> ) },
  { path: "/student/awards", element:(<StudentWrapper><AllAwards /></StudentWrapper> ) },
  {path:"/student/edit", element:<StudentWrapper><StudentEditSelf/></StudentWrapper>},
  {path:"/teacher/editself", element: <Wrapper><TeacherEditSelf/></Wrapper>}, 
  {
    path: "/teacher/dashboard",
    element: (
      <Wrapper>
        <Dashboard />,
      </Wrapper>
    ),
  },
  {
    path: "/teacher/adduser",
    element: (
      <Wrapper>
        <AddUser />
      </Wrapper>
    ),
  },
  { path: "/register", element: <TeacherRegister /> },
  { path: "/student/:id", element: <StudentDetails /> },
  {path:"/teacher/overview", element:<ClassOverview/>},
  {
    path: "/edit/:id",
    element: (
      <Wrapper>
        <EditStudent />
      </Wrapper>
    ),
  },
]);
