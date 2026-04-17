import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

export default function UserForm({ onSubmit, onCancel, initialData, currentUser, getOffices }) {
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    office_id: "",
  });

  const isSelf = currentUser?.id === initialData?.id;
  const isAdmin = currentUser?.role === "admin";
  const disableRole = isEdit && isSelf && isAdmin;

  useEffect(() => {
    loadOffices();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || "user",
        office_id: initialData.office_id || "",
      });
    }
  }, [initialData]);

  const loadOffices = async () => {
    try {
      const res = await getOffices();
      setOffices(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const officeOptions = offices.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const inputClass = "w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    if (!isEdit && form.password !== confirmPassword) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        office_id: form.office_id || null,
      };

      if (!isEdit) {
        payload.password = form.password;
        payload.password_confirmation = confirmPassword;
      }

      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Nama" value={form.name} onChange={handleChange} className={inputClass} required />

      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} required />

      {!isEdit && (
        <>
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} required />

          <input type="password" placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
        </>
      )}

      <Select
        options={officeOptions}
        value={officeOptions.find((item) => item.value === form.office_id)}
        onChange={(val) =>
          setForm((prev) => ({
            ...prev,
            office_id: val?.value || "",
          }))
        }
        placeholder="Pilih Office..."
        isClearable
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />

      <select name="role" value={form.role} onChange={handleChange} disabled={disableRole} className={inputClass}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-100">
          Batal
        </button>

        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
