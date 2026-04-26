import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "../components/Topbar";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Topbar dengan Safe Area (paling stabil) */}
      <div className="fixed-top-safe bg-white shadow-sm z-50">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Content Area dengan Safe Area Spacing */}
      <div
        className={`
          content-with-safe-area
          ${collapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <main className="px-3 sm:px-4 lg:px-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation dengan Safe Area */}
      <div className="lg:hidden fixed-bottom-safe bg-white border-t bottom-nav z-50">
        <BottomNav />
      </div>
    </div>
  );
}
