import ModuleCard from "../../../components/ModulCard";
import { ClipboardList, Users, Box, BarChart, UserCog } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getDashboardSummary, getRecentTasks } from "../services/DashboardService";
import { useAuth } from "../../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function DashboardPage() {
  const [recentTasks, setRecentTasks] = useState([]);
  const [summary, setSummary] = useState({
    resolved: 0,
    pending: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(false);

  const { user: currentUser } = useAuth();
  const location = useLocation();

  // 🔥 fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const data = await getDashboardSummary();
      setSummary({
        pending: data.pending || 0,
        progress: data.progress || 0,
        resolved: data.resolved || 0,
      });
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, []);

  // 🔥 fetch recent
  const fetchRecent = useCallback(async () => {
    try {
      const data = await getRecentTasks();
      setRecentTasks(data || []);
    } catch (err) {
      console.error("Error fetching recent:", err);
    }
  }, []);

  // 🔥 load semua
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchRecent()]);
    setLoading(false);
  }, [fetchSummary, fetchRecent]);

  // 🔥 initial load + reload saat balik ke halaman
  useEffect(() => {
    loadDashboard();
  }, [location.pathname]); // penting!

  // 🔥 optional: auto refresh tiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSummary();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchSummary]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-semibold">Halo IT Support 👋</h1>
        <p className="text-sm opacity-90">Selamat datang di Daily IT RJBB</p>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-blue-400/20 p-3 rounded-xl">
            <p className="text-xs">In Progress</p>
            <p className="text-xl font-bold">{loading ? "..." : summary.progress}</p>
          </div>

          <div className="bg-yellow-400/20 p-3 rounded-xl">
            <p className="text-xs">Pending</p>
            <p className="text-xl font-bold">{loading ? "..." : summary.pending}</p>
          </div>

          <div className="bg-green-400/20 p-3 rounded-xl">
            <p className="text-xs">Resolved</p>
            <p className="text-xl font-bold">{loading ? "..." : summary.resolved}</p>
          </div>
        </div>
      </div>

      {/* MODUL */}
      <div>
        <h2 className="font-semibold mb-4">Modul Sistem</h2>

        <div className="grid grid-cols-2 gap-4">
          <ModuleCard title="Task" desc="Kelola pekerjaan IT" link="/tasks" icon={<ClipboardList size={28} />} />
          <ModuleCard title="Employees" desc="Data pekerja" link="/employees" icon={<Users size={28} />} />
          <ModuleCard title="Report" desc="Export & Lihat semua laporan" link="/reports" icon={<BarChart size={28} />} />
          <ModuleCard title="Inventory" desc="Barang masuk / keluar" link="/inventory" icon={<Box size={28} />} />

          {currentUser?.role === "admin" && <ModuleCard title="User Management" desc="Kelola user & akses" link="/users" icon={<UserCog size={28} />} />}
        </div>
      </div>

      {/* RECENT */}
      <div>
        <h2 className="font-semibold mb-4">Aktivitas Terbaru</h2>

        {recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada aktivitas</p>
        ) : (
          recentTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm mb-2">
              <p className="font-medium">{task.kendala}</p>
              <p className="text-sm text-gray-500">
                {task.user?.name || "User"} • {task.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
