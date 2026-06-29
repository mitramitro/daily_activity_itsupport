import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import {
  getOffices,
  createOffice,
  updateOffice,
  deleteOffice,
} from "../services/officeService";

import OfficeTable from "../components/OfficeTable";
import OfficePagination from "../components/OfficePagination";
import OfficeModal from "../components/OfficeModal";
import OfficeActionModal from "../components/OfficeActionModal";

export default function OfficesPage() {
  const [offices, setOffices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

  const [modal, setModal] = useState({
    type: null,
    data: null,
  });

  const openModal = (type, data = null) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal({ type: null, data: null });
  };

  const fetchOffices = useCallback(async () => {
    try {
      setLoadingTable(true);

      const res = await getOffices({ page, search });

      setOffices(res.data.data || []);
      setTotalPages(res.data.meta?.last_page || res.data.last_page || 1);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data office");
      setOffices([]);
    } finally {
      setLoadingTable(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const handleSubmitOffice = async (payload) => {
    try {
      if (modal.data?.id) {
        await updateOffice(modal.data.id, payload);
        toast.success("Office berhasil diupdate");
      } else {
        await createOffice(payload);
        toast.success("Office berhasil ditambahkan");
      }

      closeModal();
      fetchOffices();
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Gagal menyimpan office";

      toast.error(message);

      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin hapus office ini?")) return;

    try {
      await deleteOffice(modal.data.id);

      toast.success("Office berhasil dihapus");

      closeModal();
      fetchOffices();
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Gagal menghapus office";

      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari office..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={() => openModal("form")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm"
        >
          Tambah Office
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <OfficeTable
          offices={offices}
          loading={loadingTable}
          onRowClick={(row) => openModal("action", row)}
        />
      </div>

      <OfficePagination page={page} setPage={setPage} totalPages={totalPages} />

      {modal.type === "form" && (
        <OfficeModal
          open={true}
          onClose={closeModal}
          onSubmit={handleSubmitOffice}
          initialData={modal.data}
        />
      )}

      {modal.type === "action" && (
        <OfficeActionModal
          open={true}
          onClose={closeModal}
          onEdit={() => openModal("form", modal.data)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
