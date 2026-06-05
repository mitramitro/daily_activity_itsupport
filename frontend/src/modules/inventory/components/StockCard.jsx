import { Package } from "lucide-react";

export default function StockCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Package size={20} className="text-blue-600" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">{data.barang?.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{data.office?.name}</p>
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900">{data.stock}</span>
        <span className="text-xs text-gray-400">{data.barang?.unit || "unit"}</span>
      </div>
    </div>
  );
}
