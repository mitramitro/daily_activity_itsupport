import { Package, Wrench } from "lucide-react";

export default function BarangCard({ data }) {
  const isConsumable = data.type === "consumable";

  return (
    <div className="px-4 py-3 active:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isConsumable ? "bg-green-50" : "bg-blue-50"}`}>
          {isConsumable ? <Package size={14} className="text-green-600" /> : <Wrench size={14} className="text-blue-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">{data.name}</h3>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${isConsumable ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{data.type}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Unit: {data.unit}</p>
        </div>
      </div>
    </div>
  );
}
