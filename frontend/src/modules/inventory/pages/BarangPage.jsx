import { useEffect, useState } from "react";
import { getBarang, deleteBarang } from "../services/barangService";

import BarangTable from "../components/BarangTable";
import BarangCard from "../components/BarangCard"; // 🔥 NEW
import BarangModal from "../components/BarangModal";

export default function BarangPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  // ======================
  // FETCH
  // ======================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBarang({
        ...params,
        search: params.search?.trim() || undefined,
      });

      setData(res.data.data);
      setMeta(res.data.meta || {});
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data barang");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  // ======================
  // HANDLERS
  // ======================
  const handleSuccess = () => {
    setOpenModal(false);
    setSelected(null);
    fetchData();
  };

  const handleDelete = async (row) => {
    if (!confirm(`Yakin hapus "${row.name}"?`)) return;

    try {
      await deleteBarang(row.id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus");
    }
  };

  const handleEdit = (row) => {
    setSelected(row);
    setOpenModal(true);
  };

  const handleSearch = (e) => {
    setParams((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  return (
    <div className="space-y-4">
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-end">
        {/* SEARCH */}
        <input type="text" placeholder="Cari barang..." value={params.search} onChange={handleSearch} className="w-full md:w-64 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {/* BUTTON */}
        <button
          onClick={() => {
            setSelected(null);
            setOpenModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm"
        >
          + Barang
        </button>
      </div>

      {/* ================= CONTENT ================= */}

      {/* MOBILE */}
      <div className="grid gap-3 md:hidden">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length ? (
          data.map((row) => <BarangCard key={row.id} data={row} onDelete={handleDelete} onEdit={handleEdit} />)
        ) : (
          <p className="text-center text-gray-500">Belum ada barang</p>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <BarangTable data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      {meta?.last_page > 1 && (
        <div className="flex justify-end gap-2 text-sm">
          <button
            disabled={params.page === 1}
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                page: prev.page - 1,
              }))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-2 py-1">
            {meta.current_page} / {meta.last_page}
          </span>

          <button
            disabled={params.page === meta.last_page}
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
      <BarangModal open={openModal} onClose={() => setOpenModal(false)} onSuccess={handleSuccess} initialData={selected} />
    </div>
  );
}
