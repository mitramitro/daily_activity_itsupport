import TaskStatusBadge from "./TaskStatusBadge";
import toast from "react-hot-toast";
import { User, MapPin, Calendar, Briefcase } from "lucide-react";

export default function TaskCard({ task, onDetail }) {
  // 🔥 reusable copy function
  const copyText = async (text, label = "") => {
    try {
      await navigator.clipboard.writeText(text || "-");

      toast.success(`Copied ${label}`, {
        duration: 1200,
        style: {
          fontSize: "12px",
        },
      });
    } catch (err) {
      console.error("copy gagal", err);
      toast.error("Gagal copy");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          {task.kategori} - {task.jenis_task}
        </h2>

        <TaskStatusBadge status={task.status} />
      </div>

      {/* KENDALA */}
      <p onClick={() => copyText(task.kendala, "kendala")} className="text-xs text-gray-600 mb-3 cursor-pointer hover:text-blue-600 leading-relaxed">
        {task.kendala}
      </p>

      {/* INFO */}
      <div className="space-y-1 text-[12px] text-gray-600">
        {/* NAMA + NOPEK + FUNGSI */}
        <p className="flex flex-wrap items-center gap-x-1">
          <User size={14} className="text-blue-500" />

          <span onClick={() => copyText(task.employee?.nama, "nama")} className="cursor-pointer hover:text-blue-600 font-medium">
            {task.employee?.nama}
          </span>

          <span className="text-gray-400">-</span>

          <span onClick={() => copyText(task.employee?.nomor_pekerja, "nomor pekerja")} className="cursor-pointer hover:text-blue-600">
            {task.employee?.nomor_pekerja}
          </span>

          <span className="text-gray-400">-</span>

          <span onClick={() => copyText(task.employee?.fungsi, "fungsi")} className="cursor-pointer hover:text-blue-600">
            {task.employee?.fungsi}
          </span>
        </p>

        {/* JABATAN */}
        <p onClick={() => copyText(task.employee?.jabatan, "jabatan")} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <Briefcase size={14} className="text-purple-500" />
          {task.employee?.jabatan}
        </p>

        {/* LOKASI */}
        <p onClick={() => copyText(task.office?.name, "lokasi")} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <MapPin size={14} className="text-red-500" />
          {task.office?.name}
        </p>

        {/* TANGGAL */}
        <p onClick={() => copyText(task.tanggal, "tanggal")} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <Calendar size={14} className="text-green-500" />
          {task.tanggal}
        </p>
      </div>

      {/* ACTION */}
      <div className="flex justify-end mt-3">
        <button onClick={() => onDetail(task)} className="text-blue-600 text-sm font-medium hover:underline">
          Detail
        </button>
      </div>
    </div>
  );
}
