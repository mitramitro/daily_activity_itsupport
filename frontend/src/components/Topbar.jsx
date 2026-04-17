import { Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();

    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`
        fixed
        top-0
        right-0
        h-16
        bg-white
        shadow-sm
        flex
        items-center
        justify-between
        px-4
        z-50
        transition-all
        duration-300
        ${collapsed ? "lg:left-20" : "lg:left-64"}
        left-0
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>

        <h1 className="font-semibold">ITDesk</h1>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setOpen(!open)} className="hover:bg-gray-100 p-1 rounded-full transition">
          <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">{user?.name?.charAt(0) || "U"}</div>
        </button>

        {/* Dropdown */}
        <div
          className={`
            absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50
            transform transition-all duration-150 origin-top-right
            ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
          `}
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium">{user?.name}</p>

            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Profile
          </button>

          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Settings</button>

          <div className="border-t"></div>

          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
