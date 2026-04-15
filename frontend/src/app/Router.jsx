import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { Loadable } from "../utils/loadable";

import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../modules/auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

// 🔥 LAZY + LOADABLE (PER PAGE)
const LoginPage = Loadable(lazy(() => import("../modules/auth/pages/LoginPage")));

const DashboardPage = Loadable(lazy(() => import("../modules/dashboard/pages/DashboardPage")));

const TaskListPage = Loadable(lazy(() => import("../modules/task/pages/TaskListPage")));

const TaskCreatePage = Loadable(lazy(() => import("../modules/task/pages/TaskCreatePage")));

const EmployeesPage = Loadable(lazy(() => import("../modules/employees/pages/EmployeesPage")));

const ProfilePage = Loadable(lazy(() => import("../modules/profile/pages/ProfilePage")));

const ReportsPage = Loadable(lazy(() => import("../modules/reports/pages/ReportsPage")));

const ReportTaskPage = Loadable(lazy(() => import("../modules/reports/pages/ReportTaskPage")));

const UsersPage = Loadable(lazy(() => import("../modules/users/pages/UsersPage")));

const InventoryPage = Loadable(lazy(() => import("../modules/inventory/pages/InventoryPage")));

const BarangPage = Loadable(lazy(() => import("../modules/inventory/pages/BarangPage")));

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
      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: "tasks",
        element: <TaskListPage />,
      },
      {
        path: "tasks/create",
        element: <TaskCreatePage />,
      },

      {
        path: "employees",
        element: <EmployeesPage />,
      },

      {
        path: "users",
        element: <UsersPage />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "reports/tasks",
        element: <ReportTaskPage />,
      },

      {
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "barang",
        element: <BarangPage />,
      },
    ],
  },
]);
