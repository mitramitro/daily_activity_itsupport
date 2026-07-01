import { Package } from "lucide-react";

export default function StockCard({ data }) {
  return (
    <div className="px-4 py-3 active:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
          <Package size={14} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">{data.barang?.name}</h3>
            <span className="text-sm font-semibold text-gray-900 shrink-0">{data.stock}</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-xs text-gray-400 truncate">{data.office?.name}</p>
            <span className="text-[11px] text-gray-400 shrink-0">{data.barang?.unit || "unit"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
