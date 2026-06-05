import { Package, Wrench, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BarangCard({ data, onDelete }) {
  const isConsumable = data.type === "consumable";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isConsumable ? "bg-green-100" : "bg-blue-100"}`}>
            {isConsumable ? <Package size={20} className="text-green-600" /> : <Wrench size={20} className="text-blue-600" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">{data.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Unit: {data.unit}</p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${isConsumable ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{data.type}</span>
      </div>

      <div className="flex justify-end mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={() => {
            if (confirm("Hapus barang?")) {
              onDelete(data);
              toast.success("Barang dihapus");
            }
          }}
          className="flex items-center gap-1 text-red-500 text-xs font-medium"
        >
          <Trash2 size={14} />
          Hapus
        </button>
      </div>
    </div>
  );
}
