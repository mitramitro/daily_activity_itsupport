import ModuleCard from "../../../components/ModulCard";
import { ClipboardList, Users, Box, Network, Wifi, Radio } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-semibold">Halo IT Support 👋</h1>
        <p className="text-sm opacity-90">Selamat datang di ITApp Control Center</p>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <p className="text-xs opacity-90">Task Hari Ini</p>
            <p className="text-xl font-bold">12</p>
          </div>

          <div className="bg-white/20 p-3 rounded-xl">
            <p className="text-xs opacity-90">Pending</p>
            <p className="text-xl font-bold">5</p>
          </div>
        </div>
      </div>

      {/* MODUL SISTEM */}
      <div>
        <h2 className="font-semibold mb-4">Modul Sistem</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ModuleCard title="Task" desc="Kelola pekerjaan IT" link="/tasks" icon={<ClipboardList size={28} />} />

          <ModuleCard title="Employees" desc="Data pekerja" link="/employees" icon={<Users size={28} />} />

          <ModuleCard title="Inventory" desc="Barang masuk / keluar" link="/inventory" icon={<Box size={28} />} />

          <ModuleCard title="IP Address" desc="Catatan IP cabang" link="/ip" icon={<Network size={28} />} />

          <ModuleCard title="Toner" desc="Monitoring toner" link="/toner" icon={<Wifi size={28} />} />

          <ModuleCard title="Handy Talky" desc="Data perangkat HT" link="/ht" icon={<Radio size={28} />} />
        </div>
      </div>

      {/* AKTIVITAS TERBARU */}
      <div>
        <h2 className="font-semibold mb-4">Aktivitas Terbaru</h2>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="font-medium">Perbaiki Printer</p>
            <p className="text-sm text-gray-500">Budi • Selesai</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="font-medium">Install Ulang PC</p>
            <p className="text-sm text-gray-500">Andi • Proses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
