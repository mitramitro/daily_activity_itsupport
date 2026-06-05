import { useEffect, useState } from "react";
import { getBarangLogs } from "../../inventory/services/barangLogService";
import { getOffices } from "../../task/services/TaskService";
import { exportInventory } from "../services/ReportServices";
import BarangLogCard from "../../inventory/components/BarangLogCard";
import toast from "react-hot-toast";

export default function ReportInventoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [tanggalDari, setTanggalDari] = useState("");
  const [tanggalSampai, setTanggalSampai] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getBarangLogs({ search, limit: 50 });
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOffices = async () => {
    try {
      const res = await getOffices();
      setOffices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOffices();
  }, []);

  const handleFilter = () => {
    if (tanggalDari && tanggalSampai && tanggalDari > tanggalSampai) {
      toast.error("Tanggal tidak valid");
      return;
    }
    fetchData();
  };

  const handleExport = async () => {
    try {
      await exportInventory({ search, type, office_id: officeId, tanggal_dari: tanggalDari, tanggal_sampai: tanggalSampai });
      toast.success("Export berhasil");
    } catch (err) {
      console.error(err);
      toast.error("Gagal export");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Report Inventory</h1>
          <button onClick={handleExport} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded text-sm hover:bg-green-100">
            Export Excel
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <input type="text" placeholder="Cari barang, nama..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-72 border px-3 py-2 rounded text-sm" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <select value={type} onChange={(e) => setType(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="">Semua Tipe</option>
              <option value="IN">Masuk</option>
              <option value="OUT">Keluar</option>
            </select>
            <select value={officeId} onChange={(e) => setOfficeId(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="">Semua Lokasi</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <input type="date" value={tanggalDari} onChange={(e) => setTanggalDari(e.target.value)} className="border px-3 py-2 rounded text-sm" />
            <input type="date" value={tanggalSampai} onChange={(e) => setTanggalSampai(e.target.value)} className="border px-3 py-2 rounded text-sm" />
            <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Filter</button>
          </div>
        </div>

        {loading && <div className="text-sm text-gray-500 mb-3">Loading...</div>}
        {!loading && logs.length === 0 && <div className="text-sm text-gray-400 text-center py-6">Tidak ada data</div>}

        <div className="grid gap-3">
          {logs.map((log) => (
            <BarangLogCard key={log.id} data={log} />
          ))}
        </div>
      </div>
    </div>
  );
}
