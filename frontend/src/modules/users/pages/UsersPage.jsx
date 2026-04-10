import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser, updateUserPassword, getOffices } from "../services/usersService";

import UserTable from "../components/UserTable";
import UserPagination from "../components/UserPagination";
import UserModal from "../components/UserModal";
import UserActionModal from "../components/UserActionModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useAuth } from "../../../contexts/AuthContext";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { user: currentUser } = useAuth(); //digunakan untuk disable opsi role di form edit user agar admin tidak bisa menurunkan role dirinya sendiri menjadi user

  // 🔥 SINGLE MODAL STATE
  const [modal, setModal] = useState({
    type: null, // 'form' | 'action' | 'password'
    data: null,
  });

  // 🔧 MODAL HANDLER
  const openModal = (type, data = null) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal({ type: null, data: null });
  };

  // 📥 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await getUsers({ page, search });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.last_page);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // 🧠 ACTION HANDLERS
  const handleRowClick = (user) => {
    openModal("action", user);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin mau hapus user?")) return;

    try {
      await deleteUser(modal.data.id);
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus data");
    }
  };

  const handleSubmitUser = async (data) => {
    try {
      if (modal.data) {
        await updateUser(modal.data.id, data);
      } else {
        await createUser(data);
      }

      fetchUsers();
      closeModal();
      return true;
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
      throw err;
    }
  };

  const handleChangePassword = async (data) => {
    try {
      await updateUserPassword(modal.data.id, data);
      closeModal();
      //   alert("Password berhasil diubah");
    } catch (err) {
      console.error(err);
      //   alert("Gagal ubah password");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* 🔍 HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
        />

        <button onClick={() => openModal("form")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm">
          Tambah User
        </button>
      </div>

      {/* 📊 TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <UserTable users={users} onRowClick={handleRowClick} />
      </div>

      {/* 📄 PAGINATION */}
      <UserPagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* 🧾 USER FORM MODAL */}
      <UserModal open={modal.type === "form"} onClose={closeModal} initialData={modal.data} currentUser={currentUser} getOffices={getOffices} onSuccess={handleSubmitUser} />

      {/* ⚙️ ACTION MODAL */}
      <UserActionModal open={modal.type === "action"} onClose={closeModal} onEdit={() => openModal("form", modal.data)} onDelete={handleDelete} onChangePassword={() => openModal("password", modal.data)} />

      {/* 🔐 CHANGE PASSWORD MODAL */}
      <ChangePasswordModal open={modal.type === "password"} onClose={closeModal} user={modal.data} onSubmit={handleChangePassword} />
    </div>
  );
}
