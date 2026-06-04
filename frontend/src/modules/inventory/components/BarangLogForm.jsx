import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { createBarangLog } from "../services/barangLogService";
import { getBarang } from "../services/barangService";
import { getEmployeeOptions } from "../../employees/services/employeeService";
import api from "../../../services/api";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f9fafb",
    border: state.isFocused ? "2px solid #3b82f6" : "1px solid #e5e7eb",
    boxShadow: "none",
    borderRadius: "8px",
    minHeight: "38px",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export default function BarangLogForm({ onSuccess, onClose, user }) {
  const formRef = useRef(null);
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

  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: `${e.nama} - ${e.nomor_pekerja} - ${e.fungsi || "-"}`,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barangRes, empRes, officeRes] = await Promise.all([
          getBarang(),
          getEmployeeOptions(),
          api.get("/offices"),
        ]);

        setBarangList(barangRes.data.data);
        setEmployees(empRes.data);
        setOffices(officeRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data");
      }
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

  const handleEmployeeChange = (field, selected) => {
    setForm((prev) => ({
      ...prev,
      [field]: selected?.value || "",
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
    if (error) return toast.error(error);

    setLoading(true);

    try {
      await createBarangLog(form);
      toast.success("Transaksi berhasil disimpan");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal simpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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
          <Select
            options={employeeOptions}
            value={employeeOptions.find((opt) => opt.value === form.to_employee_id) || null}
            onChange={(selected) => handleEmployeeChange("to_employee_id", selected)}
            menuPortalTarget={document.body}
            styles={selectStyle}
            placeholder="Ketik nama employee..."
            noOptionsMessage={() => "Tidak ditemukan"}
          />
        </div>
      )}

      {form.type === "IN" && (
        <div>
          <label className="block text-sm font-medium mb-1">Dari Employee *</label>
          <Select
            options={employeeOptions}
            value={employeeOptions.find((opt) => opt.value === form.from_employee_id) || null}
            onChange={(selected) => handleEmployeeChange("from_employee_id", selected)}
            menuPortalTarget={document.body}
            styles={selectStyle}
            placeholder="Ketik nama employee..."
            noOptionsMessage={() => "Tidak ditemukan"}
          />
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
