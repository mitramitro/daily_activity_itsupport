import { useEffect, useState } from "react";
import { getBarangLogs, deleteBarangLog } from "../services/barangLogService";

import BarangLogTable from "../components/BarangLogTable";
import BarangLogCard from "../components/BarangLogCard";
import BarangLogModal from "../components/BarangLogModal";
import BarangLogDetailModal from "../components/BarangLogDetailModal";

import BarangPage from "./BarangPage";
import StockPage from "./StockPage";

import { useAuth } from "../../../contexts/AuthContext";

export default function InventoryPage() {
  const { user } = useAuth();

  // ======================
  // TAB
  // ======================
  const [tab, setTab] = useState("transaksi");

  // ======================
  // DATA
  // ======================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  // ======================
  // MODAL
  // ======================
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  // ======================
  // FETCH
  // ======================
  const fetchData = async () => {
    if (tab !== "transaksi") return;

    setLoading(true);
    try {
      const res = await getBarangLogs(params);
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "transaksi") {
      fetchData();
    }
  }, [params, tab]);

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (row) => {
    if (!confirm("Yakin hapus transaksi ini?")) return;

    try {
      await deleteBarangLog(row.id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus");
    }
  };

  return (
    <div className="p-6 w-full space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Inventory</h1>

        {/* {tab === "transaksi" && (
          <button onClick={() => setOpenModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm">
            + Transaksi
          </button>
        )} */}
      </div>

      {/* ================= TAB ================= */}
      <div className="flex gap-2">
        {[
          { key: "transaksi", label: "Transaksi" },
          { key: "barang", label: "Barang" },
          { key: "stok", label: "Stok" },
        ].map((item) => (
          <button key={item.key} onClick={() => setTab(item.key)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === item.key ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 hover:bg-gray-200"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}

      {/* 🔄 TRANSAKSI */}
      {tab === "transaksi" && (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          {/* ================= TOP BAR ================= */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-end">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Cari barang..."
              value={params.search || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              className="w-full md:w-80 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* BUTTON */}
            <button onClick={() => setOpenModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm">
              + Transaksi
            </button>
          </div>
          {/* MOBILE */}
          <div className="grid gap-3 md:hidden">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : data.length ? (
              data.map((row) => <BarangLogCard key={row.id} data={row} onDelete={handleDelete} onClick={() => setSelected(row)} />)
            ) : (
              <p className="text-center text-gray-500">Belum ada transaksi</p>
            )}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <BarangLogTable data={data} loading={loading} onDelete={handleDelete} />
            </div>
          </div>

          {/* MODAL */}
          <BarangLogModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSuccess={() => {
              setOpenModal(false);
              fetchData();
            }}
            user={user}
          />
        </div>
      )}

      {/* 📦 MASTER BARANG */}
      {tab === "barang" && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <BarangPage />
        </div>
      )}

      {/* 📊 STOK */}
      {tab === "stok" && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <StockPage />
        </div>
      )}

      <BarangLogDetailModal open={!!selected} data={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
