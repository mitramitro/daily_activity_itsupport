import { NavLink } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Users, Box, Network, Wifi, Radio } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // sesuaikan path

export default function Sidebar({ collapsed }) {
  const { user } = useAuth();
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/" },
    { name: "Tasks", icon: <ClipboardList size={20} />, link: "/tasks" },
    { name: "Employees", icon: <Users size={20} />, link: "/employees" },
    { name: "Inventory", icon: <Box size={20} />, link: "/inventory" },
    ...(user?.role === "admin"
      ? [
          {
            name: "Users",
            icon: <Users size={20} />,
            link: "/users",
          },
        ]
      : []),
  ];

  return (
    <div className={`h-screen bg-white shadow-sm p-4 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      {!collapsed && <h1 className="text-lg font-bold mb-6">ITApp</h1>}

      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink key={item.name} to={item.link} className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}>
            {item.icon}
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
