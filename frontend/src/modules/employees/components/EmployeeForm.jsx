import { useState, useEffect } from "react";

export default function EmployeeForm({ onSubmit, onCancel, initialData }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    nomor_pekerja: "",
    no_hp: "",
    email: "",
    jabatan: "",
    status: "Pekerja",
    lokasi: "",
    keterangan: "",
  });

  const lokasiOptions = ["Integrated Terminal Balongan - Fuel", "FT Padalarang", "FT Cikampek"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500";

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

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

      {/* Lokasi */}
      <select name="lokasi" value={form.lokasi} onChange={handleChange} className={inputClass} required>
        <option value="">Pilih Lokasi</option>
        {lokasiOptions.map((lokasi) => (
          <option key={lokasi} value={lokasi}>
            {lokasi}
          </option>
        ))}
      </select>

      {/* Keterangan */}
      <textarea name="keterangan" placeholder="Keterangan" value={form.keterangan} onChange={handleChange} className={inputClass} rows="3" />

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
