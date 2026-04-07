import ModuleCard from "../../../components/ModulCard";
import { ClipboardList, Users, Box, Network, Wifi, Radio, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardSummary, getRecentTasks } from "../services/DashboardService";

export default function DashboardPage() {
  const [recentTasks, setRecentTasks] = useState([]);
  const [summary, setSummary] = useState({
    resolved: 0,
    pending: 0,
    progress: 0,
  });

  useEffect(() => {
    fetchSummary();
    fetchRecent();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary({
        pending: data.pending || 0,
        progress: data.progress || 0,
        resolved: data.resolved || 0,
      });

      // console.log("DATA:", data);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };

  const fetchRecent = async () => {
    try {
      const data = await getRecentTasks();
      setRecentTasks(data);
      // console.log("DATA:", data);
    } catch (err) {
      console.error("Error fetching recent tasks:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-semibold">Halo IT Support 👋</h1>
        <p className="text-sm opacity-90">Selamat datang di Daily IT RJBB</p>

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {/* Progress */}
          <div className="bg-blue-400/20 p-3 rounded-xl">
            <p className="text-xs opacity-90">In Progress</p>
            <p className="text-xl font-bold">{summary.progress}</p>
          </div>

          {/* Pending */}
          <div className="bg-yellow-400/20 p-3 rounded-xl">
            <p className="text-xs opacity-90">Pending</p>
            <p className="text-xl font-bold">{summary.pending}</p>
          </div>

          {/* Resolved */}
          <div className="bg-green-400/20 p-3 rounded-xl">
            <p className="text-xs opacity-90">Resolved</p>
            <p className="text-xl font-bold">{summary.resolved}</p>
          </div>
        </div>
      </div>

      {/* MODUL SISTEM */}
      <div>
        <h2 className="font-semibold mb-4">Modul Sistem</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ModuleCard title="Task" desc="Kelola pekerjaan IT" link="/tasks" icon={<ClipboardList size={28} />} />

          <ModuleCard title="Employees" desc="Data pekerja" link="/employees" icon={<Users size={28} />} />

          <ModuleCard title="Report" desc="Export & Lihat semua laporan" link="/reports" icon={<BarChart size={28} />} />

          <ModuleCard title="Inventory" desc="Barang masuk / keluar" link="/inventory" icon={<Box size={28} />} />

          {/* <ModuleCard title="IP Address" desc="Catatan IP cabang" link="/ip" icon={<Network size={28} />} />

          <ModuleCard title="Toner" desc="Monitoring toner" link="/toner" icon={<Wifi size={28} />} />

          <ModuleCard title="Handy Talky" desc="Data perangkat HT" link="/ht" icon={<Radio size={28} />} /> */}
        </div>
      </div>

      {/* AKTIVITAS TERBARU */}
      <div className="space-y-3">
        <h2 className="font-semibold mb-4">Aktivitas Terbaru</h2>
        {recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada aktivitas</p>
        ) : (
          recentTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm">
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
