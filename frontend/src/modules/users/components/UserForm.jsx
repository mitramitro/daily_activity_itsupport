import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function UserForm({ onSubmit, onCancel, initialData, currentUser }) {
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const inputClass = "w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500";

  // 🔒 RULE: admin tidak bisa ubah role sendiri
  const isSelf = currentUser?.id === initialData?.id;
  const isAdmin = currentUser?.role === "admin";
  const disableRole = isEdit && isSelf && isAdmin;

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || "user",
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 cegah perubahan role via devtools (extra guard)
    if (name === "role" && disableRole) {
      toast.error("Role akun sendiri tidak bisa diubah");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 validasi password (create only)
    if (!isEdit && form.password !== confirmPassword) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    // 🔥 guard utama (sync BE)
    if (disableRole && form.role !== initialData.role) {
      toast.error("Tidak bisa menurunkan role diri sendiri");
      return;
    }

    try {
      setLoading(true);

      let payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      };

      if (!isEdit) {
        payload.password = form.password;
        payload.password_confirmation = confirmPassword;
      }

      await onSubmit(payload);

      toast.success(isEdit ? "User berhasil diupdate" : "User berhasil ditambahkan");
    } catch (err) {
      console.error(err);

      const message = err?.response?.data?.message || "Terjadi kesalahan";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">{isEdit ? "Edit User" : "Tambah User"}</h2>

      {/* NAME */}
      <div>
        <label className="text-xs text-gray-500">Nama</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-xs text-gray-500">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required />
      </div>

      {/* PASSWORD (ONLY CREATE) */}
      {!isEdit && (
        <>
          <div>
            <label className="text-xs text-gray-500">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className="text-xs text-gray-500">Konfirmasi Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
          </div>
        </>
      )}

      {/* ROLE */}
      <div>
        <label className="text-xs text-gray-500">Role</label>

        <select name="role" value={form.role} onChange={handleChange} disabled={disableRole} className={`${inputClass} ${disableRole ? "opacity-50 cursor-not-allowed" : ""}`}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        {/* 🔥 Hint */}
        {disableRole && <p className="text-xs text-gray-400 mt-1">Anda tidak dapat mengubah role akun sendiri</p>}
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition">
          Batal
        </button>

        <button type="submit" disabled={loading} className="px-5 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
