import { NavLink } from "react-router-dom";
import { Home, Users, PlusCircle, ClipboardList, User } from "lucide-react";

function NavItem({ to, icon, label, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `
        relative flex flex-col items-center justify-center gap-0.5
        ${isActive ? "text-blue-600" : "text-gray-400"}
        active:scale-90 transition-all duration-150
        px-2 py-1 min-w-0
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          <div
            className={`
              absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full
              transition-all duration-200
              ${isActive ? "bg-blue-600 opacity-100" : "bg-transparent opacity-0"}
            `}
          />
          <div className={isActive ? "text-blue-600" : "text-gray-400"}>
            {icon}
          </div>
          <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-lg flex justify-around items-start pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] z-50">
      <NavItem to="/" exact icon={<Home size={22} />} label="Home" />
      <NavItem to="/employees" icon={<Users size={22} />} label="Employee" />

      <NavLink
        to="/tasks/create"
        className="relative -mt-3 flex flex-col items-center active:scale-90 transition-all duration-150"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
          <PlusCircle size={26} />
        </div>
        <span className="text-[10px] font-medium text-gray-400 mt-0.5">Buat</span>
      </NavLink>

      <NavItem to="/tasks" icon={<ClipboardList size={22} />} label="Task" />
      <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
    </nav>
  );
}
