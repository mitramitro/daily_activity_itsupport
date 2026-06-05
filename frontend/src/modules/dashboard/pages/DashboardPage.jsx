import ModuleCard from "../../../components/ModulCard";
import { ClipboardList, Users, Box, BarChart, UserCog, Settings, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getDashboardSummary, getRecentTasks } from "../services/DashboardService";
import { useAuth } from "../../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { SkeletonStatCards, SkeletonRecentList } from "../../../components/Skeleton";

const statusConfig = {
  progress: { icon: Clock, label: "In Progress", bg: "bg-blue-500/20", iconBg: "bg-blue-500", text: "text-blue-100" },
  pending: { icon: AlertCircle, label: "Pending", bg: "bg-yellow-500/20", iconBg: "bg-yellow-500", text: "text-yellow-100" },
  resolved: { icon: CheckCircle2, label: "Resolved", bg: "bg-green-500/20", iconBg: "bg-green-500", text: "text-green-100" },
};

function StatCard({ type, value, loading }) {
  const config = statusConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} backdrop-blur-sm p-3 rounded-xl ${loading ? "animate-pulse" : ""}`}>
      {loading ? (
        <>
          <div className="h-3 bg-white/30 rounded w-2/3 mb-2" />
          <div className="h-7 bg-white/30 rounded w-1/2" />
        </>
      ) : (
        <>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className={`${config.iconBg} rounded-full p-1`}>
              <Icon size={12} className="text-white" />
            </div>
            <span className={`text-[11px] font-medium ${config.text}`}>{config.label}</span>
          </div>
          <p className="text-2xl font-bold text-white">{value}</p>
        </>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

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

  const firstName = currentUser?.name?.split(" ")[0] || "IT Support";

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

  const fetchRecent = useCallback(async () => {
    try {
      const data = await getRecentTasks();
      setRecentTasks(data || []);
    } catch (err) {
      console.error("Error fetching recent:", err);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchRecent()]);
    setLoading(false);
  }, [fetchSummary, fetchRecent]);

  useEffect(() => {
    loadDashboard();
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSummary();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchSummary]);

  const statusBadge = (status) => {
    const map = {
      resolved: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      progress: "bg-blue-100 text-blue-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER + STATS */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-500 text-white p-5 rounded-2xl shadow-sm">
        <div className="animate-slide-up">
          <p className="text-sm opacity-90">{getGreeting()},</p>
          <h1 className="text-xl font-bold">{firstName}</h1>
          <p className="text-[13px] opacity-75 mt-0.5">Daily IT RJBB</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-5">
          <StatCard type="progress" value={summary.progress} loading={loading} />
          <StatCard type="pending" value={summary.pending} loading={loading} />
          <StatCard type="resolved" value={summary.resolved} loading={loading} />
        </div>
      </div>

      {/* MODUL SISTEM */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Modul Sistem</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ModuleCard title="Task" desc="Kelola pekerjaan IT" link="/tasks" icon={<ClipboardList size={24} />} />
          <ModuleCard title="Employees" desc="Data pekerja" link="/employees" icon={<Users size={24} />} />
          <ModuleCard title="Report" desc="Export & laporan" link="/reports" icon={<BarChart size={24} />} />
          <ModuleCard title="Inventory" desc="Barang masuk / keluar" link="/inventory" icon={<Box size={24} />} />

          {currentUser?.role === "admin" && (
            <ModuleCard title="User Management" desc="Kelola user & akses" link="/users" icon={<UserCog size={24} />} />
          )}

          <ModuleCard title="Pengaturan" desc="Keamanan & konfigurasi" link="/settings" icon={<Settings size={24} />} />
        </div>
      </div>

      {/* AKTIVITAS TERBARU */}
      <div className="animate-slide-up">
        <h2 className="font-semibold text-gray-800 mb-3">Aktivitas Terbaru</h2>

        {loading ? (
          <SkeletonRecentList />
        ) : recentTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClipboardList size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">Belum ada aktivitas</p>
            <p className="text-xs text-gray-400 mt-1">Aktivitas tugas akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentTasks.slice(0, 5).map((task, idx) => (
              <div
                key={task.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3 active:scale-[0.98] transition-transform duration-150"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                  {task.user?.name?.charAt(0) || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{task.kendala}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {task.user?.name || "User"} &middot; {task.tanggal ? new Date(task.tanggal).toLocaleDateString("id-ID") : ""}
                  </p>
                </div>

                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${statusBadge(task.status)}`}>
                  {task.status === "progress" ? "Proses" : task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
