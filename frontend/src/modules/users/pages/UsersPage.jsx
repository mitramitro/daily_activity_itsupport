import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { getUsers, createUser, updateUser, deleteUser, updateUserPassword, getOffices } from "../services/usersService";

import UserTable from "../components/UserTable";
import UserPagination from "../components/UserPagination";
import UserModal from "../components/UserModal";
import UserActionModal from "../components/UserActionModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

import { useAuth } from "../../../contexts/AuthContext";

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

  const [modal, setModal] = useState({
    type: null, // form | action | password
    data: null,
  });

  const openModal = (type, data = null) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal({ type: null, data: null });
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingTable(true);

      const res = await getUsers({ page, search });

      setUsers(res.data.data || []);
      setTotalPages(res.data.meta?.last_page || 1);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data user");
      setUsers([]);
    } finally {
      setLoadingTable(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmitUser = async (payload) => {
    try {
      if (modal.data?.id) {
        await updateUser(modal.data.id, payload);
        toast.success("User berhasil diupdate");
      } else {
        await createUser(payload);
        toast.success("User berhasil ditambahkan");
      }

      closeModal();
      fetchUsers();
    } catch (error) {
      console.error(error);

      const message = error?.response?.data?.message || "Gagal menyimpan user";

      toast.error(message);

      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin hapus user ini?")) return;

    try {
      await deleteUser(modal.data.id);

      toast.success("User berhasil dihapus");

      closeModal();
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus user");
    }
  };

  const handleChangePassword = async (payload) => {
    try {
      await updateUserPassword(modal.data.id, payload);

      toast.success("Password berhasil diubah");
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah password");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button onClick={() => openModal("form")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm">
          Tambah User
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <UserTable users={users} loading={loadingTable} onRowClick={(row) => openModal("action", row)} />
      </div>

      {/* PAGINATION */}
      <UserPagination page={page} setPage={setPage} totalPages={totalPages} />

      {modal.type === "form" && <UserModal open={true} onClose={closeModal} onSubmit={handleSubmitUser} initialData={modal.data} currentUser={currentUser} getOffices={getOffices} />}

      {modal.type === "action" && <UserActionModal open={true} onClose={closeModal} onEdit={() => openModal("form", modal.data)} onDelete={handleDelete} onChangePassword={() => openModal("password", modal.data)} />}

      {modal.type === "password" && <ChangePasswordModal open={true} onClose={closeModal} user={modal.data} onSubmit={handleChangePassword} />}
    </div>
  );
}
