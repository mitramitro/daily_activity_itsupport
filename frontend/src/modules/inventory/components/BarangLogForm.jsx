import { useEffect, useState } from "react";
import { createBarangLog } from "../services/barangLogService";
import { getBarang } from "../services/barangService";
import { getEmployees } from "../../employees/services/employeeService";
import api from "../../../services/api";

export default function BarangLogForm({ onSuccess, onClose, user }) {
  const [barangList, setBarangList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);

  const userName = user?.name || "-";

  const [form, setForm] = useState({
    barang_id: "",
    type: "IN",
    qty: 1,
    tanggal: new Date().toISOString().slice(0, 10),
    condition: "",
    notes: "",
    from_employee_id: "",
    to_employee_id: "",
    from_office_id: "",
    to_office_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [barangRes, empRes, officeRes] = await Promise.all([getBarang(), getEmployees(), api.get("/offices")]);

      setBarangList(barangRes.data.data);
      setEmployees(empRes.data.data);
      setOffices(officeRes.data.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setForm((prev) => ({
        ...prev,
        type: value,
        from_employee_id: "",
        to_employee_id: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.barang_id) return "Pilih barang";
    if (!form.qty || form.qty <= 0) return "Qty tidak valid";

    if (form.type === "OUT" && !form.to_employee_id) {
      return "Employee tujuan wajib dipilih";
    }

    if (form.type === "IN" && !form.from_employee_id) {
      return "Employee asal wajib dipilih";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return alert(error);

    setLoading(true);

    try {
      await createBarangLog(form);
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal simpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* INFO */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
        {form.type === "IN" && (
          <p className="text-blue-700">
            📥 Barang masuk ke: <b>{userName}</b>
          </p>
        )}
        {form.type === "OUT" && (
          <p className="text-red-600">
            📤 Barang keluar dari: <b>{userName}</b>
          </p>
        )}
      </div>

      {/* BARANG */}
      <div>
        <label className="block text-sm font-medium mb-1">Barang *</label>
        <select name="barang_id" value={form.barang_id} onChange={handleChange} className="w-full border rounded-lg p-2">
          <option value="">Pilih Barang</option>
          {barangList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* TYPE */}
      <div>
        <label className="block text-sm font-medium mb-1">Tipe Transaksi *</label>
        <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg p-2">
          <option value="IN">IN (Masuk)</option>
          <option value="OUT">OUT (Keluar)</option>
        </select>
      </div>

      {/* EMPLOYEE */}
      {form.type === "OUT" && (
        <div>
          <label className="block text-sm font-medium mb-1">Ke Employee *</label>
          <select name="to_employee_id" value={form.to_employee_id} onChange={handleChange} className="w-full border rounded-lg p-2">
            <option value="">Pilih Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nama}
              </option>
            ))}
          </select>
        </div>
      )}

      {form.type === "IN" && (
        <div>
          <label className="block text-sm font-medium mb-1">Dari Employee *</label>
          <select name="from_employee_id" value={form.from_employee_id} onChange={handleChange} className="w-full border rounded-lg p-2">
            <option value="">Pilih Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nama}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* OFFICE OPTIONAL */}
      <div>
        <label className="block text-sm font-medium mb-1">{form.type === "OUT" ? "Office Tujuan (Opsional)" : "Office Asal (Opsional)"}</label>
        <select name={form.type === "OUT" ? "to_office_id" : "from_office_id"} value={form.type === "OUT" ? form.to_office_id : form.from_office_id} onChange={handleChange} className="w-full border rounded-lg p-2">
          <option value="">Pilih Office</option>
          {offices.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      {/* QTY */}
      <div>
        <label className="block text-sm font-medium mb-1">Qty *</label>
        <input type="number" name="qty" value={form.qty} onChange={handleChange} className="w-full border rounded-lg p-2" />
      </div>

      {/* TANGGAL */}
      <div>
        <label className="block text-sm font-medium mb-1">Tanggal *</label>
        <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full border rounded-lg p-2" />
      </div>

      {/* CONDITION */}
      <div>
        <label className="block text-sm font-medium mb-1">Kondisi</label>
        <select name="condition" value={form.condition} onChange={handleChange} className="w-full border rounded-lg p-2">
          <option value="">Pilih Kondisi</option>
          <option value="baru">Baru</option>
          <option value="bekas">Bekas</option>
          <option value="rusak">Rusak</option>
        </select>
      </div>

      {/* NOTES */}
      <div>
        <label className="block text-sm font-medium mb-1">Catatan</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded-lg p-2" />
      </div>

      {/* BUTTON */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          Batal
        </button>

        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
