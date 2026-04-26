import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className="min-h-[100dvh] bg-slate-50 overflow-y-auto"
      style={{
        paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))",
        paddingLeft: "calc(1rem + env(safe-area-inset-left, 0px))",
        paddingRight: "calc(1rem + env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ITDesk</h1>
          <p className="text-gray-500 text-sm">Daily IT RJBB</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
