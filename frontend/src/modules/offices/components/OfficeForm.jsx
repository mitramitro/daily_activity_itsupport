import { useEffect, useState } from "react";

export default function OfficeForm({ onSubmit, onCancel, initialData }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
    } else {
      setName("");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);
      await onSubmit({ name: name.trim() });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Office</label>
        <input
          type="text"
          placeholder="Masukkan nama office..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
          minLength={2}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-gray-100 text-sm"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
