import { NavLink } from "react-router-dom";
import { Home, Users, PlusCircle, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
      <NavLink to="/" className="flex flex-col items-center text-xs">
        <Home size={20} />
        Home
      </NavLink>

      <NavLink to="/employees" className="flex flex-col items-center text-xs">
        <Users size={20} />
        Employee
      </NavLink>

      <NavLink to="/tasks/create" className="flex flex-col items-center text-blue-600">
        <PlusCircle size={28} />
      </NavLink>

      <NavLink to="/tasks" className="flex flex-col items-center text-xs">
        <ClipboardList size={20} />
        Task
      </NavLink>

      <NavLink to="/profile" className="flex flex-col items-center text-xs">
        <User size={20} />
        Profile
      </NavLink>
    </div>
  );
}
