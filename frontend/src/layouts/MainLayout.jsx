import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "../components/Topbar";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar (desktop only) */}
      <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Topbar */}
      <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content */}
      <div
        className={`
          pt-16 pb-20
          transition-all duration-300
          ${collapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <main className="px-3 sm:px-4 lg:px-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (mobile only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>
    </div>
  );
}
