import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../modules/auth/pages/LoginPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import TaskListPage from "../modules/task/pages/TaskListPage";
import TaskCreatePage from "../modules/task/pages/TaskCreatePage";
import EmployeesPage from "../modules/employees/pages/EmployeesPage";
import ProfilePage from "../modules/profile/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["admin", "user"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "tasks", element: <TaskListPage /> },
      { path: "tasks/create", element: <TaskCreatePage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
