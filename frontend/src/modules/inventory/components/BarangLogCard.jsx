import { ArrowDown, ArrowUp } from "lucide-react";

export default function BarangLogCard({ data, onClick }) {
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month}, ${hours}:${mins}`;
  };

  const isIn = data.type === "IN";

  return (
    <div onClick={() => onClick?.(data)} className="px-4 py-3 active:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isIn ? "bg-green-50" : "bg-red-50"}`}>
          {isIn ? <ArrowDown size={14} className="text-green-600" /> : <ArrowUp size={14} className="text-red-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">{data.barang?.name}</h3>
            <span className="text-[11px] text-gray-400 shrink-0 whitespace-nowrap">{formatDate(data.tanggal)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-gray-500 truncate">{data.from_employee?.nama || data.from_office?.name || "-"}</span>
              <span className="text-gray-300 shrink-0">→</span>
              <span className="text-xs text-gray-500 truncate">{data.to_employee?.nama || data.to_office?.name || "-"}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 shrink-0">{data.qty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
