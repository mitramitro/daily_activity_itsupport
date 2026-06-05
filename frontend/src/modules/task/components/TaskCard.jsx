import TaskStatusBadge from "./TaskStatusBadge";
import toast from "react-hot-toast";
import { User, MapPin, Calendar, Briefcase, ChevronRight } from "lucide-react";

export default function TaskCard({ task, onDetail }) {
  const copyText = async (text, label = "") => {
    try {
      await navigator.clipboard.writeText(text || "-");
      toast.success(`Copied ${label}`, {
        duration: 1200,
        style: { fontSize: "12px" },
      });
    } catch (err) {
      console.error("copy gagal", err);
      toast.error("Gagal copy");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">
            {task.kategori} - {task.jenis_task}
          </h2>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>

      <p onClick={() => copyText(task.kendala, "kendala")} className="text-xs text-gray-600 mb-4 cursor-pointer hover:text-blue-600 leading-relaxed bg-gray-50 rounded-xl p-3">
        {task.kendala}
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User size={14} className="text-blue-600" />
          </div>
          <div className="text-xs text-gray-700 min-w-0 leading-snug">
            <span onClick={() => copyText(task.employee?.nama, "nama")} className="font-medium cursor-pointer hover:text-blue-600">{task.employee?.nama}</span>
            <span className="text-gray-300 mx-1">·</span>
            <span onClick={() => copyText(task.employee?.nomor_pekerja, "nomor pekerja")} className="cursor-pointer hover:text-blue-600">{task.employee?.nomor_pekerja}</span>
            <span className="text-gray-300 mx-1">·</span>
            <span onClick={() => copyText(task.employee?.fungsi, "fungsi")} className="cursor-pointer hover:text-blue-600">{task.employee?.fungsi}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <Briefcase size={14} className="text-purple-600" />
          </div>
          <span onClick={() => copyText(task.employee?.jabatan, "jabatan")} className="text-xs text-gray-700 cursor-pointer hover:text-blue-600">{task.employee?.jabatan}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <MapPin size={14} className="text-red-600" />
          </div>
          <span onClick={() => copyText(task.office?.name, "lokasi")} className="text-xs text-gray-700 cursor-pointer hover:text-blue-600">{task.office?.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Calendar size={14} className="text-green-600" />
          </div>
          <span onClick={() => copyText(task.tanggal, "tanggal")} className="text-xs text-gray-700 cursor-pointer hover:text-blue-600">{task.tanggal}</span>
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-gray-50">
        <button onClick={() => onDetail(task)} className="flex items-center gap-1 text-blue-600 text-xs font-medium active:opacity-70">
          Detail <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
