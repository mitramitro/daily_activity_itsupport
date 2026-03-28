import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / App Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ITApp</h1>
          <p className="text-gray-500 text-sm">IT Support Management System</p>
        </div>

        {/* Page Content (Login / Register) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
