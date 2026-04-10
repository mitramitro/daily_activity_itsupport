import { useState, useEffect } from "react";
import { createBarang, updateBarang } from "../services/barangService";

export default function BarangForm({ onSuccess, onClose, initialData }) {
  const [form, setForm] = useState({
    name: "",
    type: "consumable",
    unit: "pcs",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (initialData) {
        await updateBarang(initialData.id, form);
      } else {
        await createBarang(form);
      }

      onSuccess();
    } catch (err) {
      alert("Gagal simpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NAME */}
      <div>
        <label>Nama</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" />
      </div>

      {/* TYPE */}
      <div>
        <label>Tipe</label>
        <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded p-2">
          <option value="consumable">Consumable</option>
          <option value="non_consumable">Non Consumable</option>
        </select>
      </div>

      {/* UNIT */}
      <div>
        <label>Unit</label>
        <input name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded p-2" />
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-3 py-1 rounded">
          Batal
        </button>

        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
