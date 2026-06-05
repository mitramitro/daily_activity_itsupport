import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

export default function BarangLogCard({ data, onDelete, onClick }) {
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isIn = data.type === "IN";

  return (
    <div onClick={() => onClick?.(data)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIn ? "bg-green-100" : "bg-red-100"}`}>
            {isIn ? <ArrowDown size={16} className="text-green-600" /> : <ArrowUp size={16} className="text-red-600" />}
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isIn ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{data.type}</span>
        </div>
        <p className="text-xs text-gray-400">{formatDate(data.tanggal)}</p>
      </div>

      <h3 className="font-semibold text-sm text-gray-900 mb-3">{data.barang?.name}</h3>

      <div className="space-y-1.5 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 w-8 shrink-0">Qty</span>
          <span className="font-semibold text-gray-800">{data.qty}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 w-8 shrink-0">Dari</span>
          <span className="font-medium truncate">{data.from_employee?.nama || data.from_office?.name || "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 w-8 shrink-0">Ke</span>
          <span className="font-medium truncate">{data.to_employee?.nama || data.to_office?.name || "-"}</span>
        </div>
      </div>

      {onDelete && (
        <div className="flex justify-end mt-3 pt-2 border-t border-gray-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data);
            }}
            className="flex items-center gap-1 text-red-500 text-xs font-medium"
          >
            <Trash2 size={14} />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}
