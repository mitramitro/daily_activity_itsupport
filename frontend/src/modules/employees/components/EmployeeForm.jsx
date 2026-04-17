import { useState, useEffect } from "react";
import Select from "react-select";
import { getOffices } from "../services/employeeService";

export default function EmployeeForm({ onSubmit, onCancel, initialData }) {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);

  const [form, setForm] = useState({
    nama: "",
    nomor_pekerja: "",
    no_hp: "",
    email: "",
    jabatan: "",
    status: "Pekerja",
    fungsi: "",
    office_id: "",
    keterangan: "",
  });

  // 🔥 Fetch offices
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await getOffices();
        setOffices(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOffices();
  }, []);

  // 🔥 Handle edit mode
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        office_id: initialData.office?.id || initialData.office_id || "",
      }));
    }
  }, [initialData]);

  // 🔹 input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 options
  const officeOptions = offices.map((o) => ({
    value: o.id,
    label: o.name,
  }));

  // 🔹 style select (biar konsisten)
  const customSelectStyle = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f9fafb",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      borderRadius: "12px",
      minHeight: "42px",
    }),
  };

  const inputClass = "w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nama & Nomor */}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className={inputClass} required />

        <input type="text" name="nomor_pekerja" placeholder="Nomor Pekerja" value={form.nomor_pekerja} onChange={handleChange} className={inputClass} required />
      </div>

      {/* HP & Email */}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" name="no_hp" placeholder="No HP" value={form.no_hp} onChange={handleChange} className={inputClass} />

        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} />
      </div>

      {/* Jabatan & Status */}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" name="jabatan" placeholder="Jabatan" value={form.jabatan} onChange={handleChange} className={inputClass} required />

        <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
          <option>Pekerja</option>
          <option>Mitra Kerja</option>
        </select>
      </div>

      {/* Fungsi */}
      <input type="text" name="fungsi" placeholder="Fungsi" value={form.fungsi} onChange={handleChange} className={inputClass} required />

      {/* 🔥 Office pakai react-select */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Office</label>

        <Select
          options={officeOptions}
          value={officeOptions.find((opt) => opt.value === form.office_id) || null}
          onChange={(selected) =>
            setForm((prev) => ({
              ...prev,
              office_id: selected?.value || "",
            }))
          }
          styles={customSelectStyle}
          placeholder="Pilih Office..."
        />
      </div>

      {/* Button */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition">
          Batal
        </button>

        <button type="submit" disabled={loading} className="px-5 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
