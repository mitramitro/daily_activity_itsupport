import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Reports</h1>

      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate("/reports/tasks")} className="bg-white p-4 rounded-xl shadow cursor-pointer">
          <div className="font-semibold">Task Report</div>
          <div className="text-xs text-gray-500">Laporan pekerjaan IT</div>
        </div>

        <div onClick={() => navigate("/reports/inventory")} className="bg-white p-4 rounded-xl shadow cursor-pointer">
          <div className="font-semibold">Inventory Report</div>
          <div className="text-xs text-gray-500">Barang masuk / keluar</div>
        </div>
      </div>
    </div>
  );
}
