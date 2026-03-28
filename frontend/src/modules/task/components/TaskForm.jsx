import { useEffect, useState } from "react";
import Select from "react-select";
import { createTaskWithPhoto, getEmployees, getOffices } from "../services/TaskService";

export default function TaskForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [offices, setOffices] = useState([]);

  const kategoriOptions = [
    { value: "PC", label: "PC" },
    { value: "Laptop", label: "Laptop" },
    { value: "Network", label: "Network" },
    { value: "Aplikasi", label: "Aplikasi" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  const jenisOptions = [
    { value: "incident", label: "Incident" },
    { value: "request", label: "Request" },
  ];

  const [form, setForm] = useState({
    employee_id: "",
    office_id: "",
    kategori: "",
    jenis_task: "incident",
    kendala: "",
    solusi: "",
    tanggal: "",
  });

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  // 🔥 ambil data
  useEffect(() => {
    fetchEmployees();
    fetchOffices();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOffices = async () => {
    try {
      const res = await getOffices();
      setOffices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 mapping options
  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: e.nama,
  }));

  const officeOptions = offices.map((o) => ({
    value: o.id,
    label: o.name,
  }));

  // 🔹 style react-select
  const customSelectStyle = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f9fafb",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      borderRadius: "8px",
      minHeight: "38px",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      overflow: "hidden",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "200px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#eff6ff" : "white",
      color: "#111827",
      cursor: "pointer",
    }),
  };

  // 🔹 change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 upload
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    setFiles((prev) => [...prev, ...selected]);

    const previewUrls = selected.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(form);
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      files.forEach((file) => {
        formData.append("photos[]", file);
      });

      await createTaskWithPhoto(formData);

      alert("Task berhasil dibuat");
      onSuccess && onSuccess();
    } catch (err) {
      //   console.error(err);
      console.log(err.response?.data);
      alert("Gagal membuat task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
      <h2 className="text-lg font-semibold mb-6">Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMPLOYEE */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Employee</label>
          <Select options={employeeOptions} placeholder="Pilih Employee..." onChange={(selected) => setForm({ ...form, employee_id: selected?.value })} styles={customSelectStyle} />
        </div>

        {/* OFFICE */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Office</label>
          <Select options={officeOptions} placeholder="Pilih Office..." onChange={(selected) => setForm({ ...form, office_id: selected?.value })} styles={customSelectStyle} />
        </div>

        {/* ROW */}
        <div className="grid grid-cols-2 gap-3">
          {/* KATEGORI */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Kategori</label>
            <Select options={kategoriOptions} placeholder="Pilih..." onChange={(selected) => setForm({ ...form, kategori: selected?.value })} styles={customSelectStyle} />
          </div>

          {/* JENIS TASK */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Jenis</label>
            <Select options={jenisOptions} defaultValue={jenisOptions[0]} onChange={(selected) => setForm({ ...form, jenis_task: selected?.value })} styles={customSelectStyle} />
          </div>
        </div>

        {/* DATE */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
          <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* KENDALA */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Kendala</label>
          <textarea name="kendala" value={form.kendala} onChange={handleChange} rows="3" className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* SOLUSI */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Solusi</label>
          <textarea name="solusi" value={form.solusi} onChange={handleChange} rows="2" className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* FOTO */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Upload Foto</label>
          <input type="file" multiple onChange={handleFileChange} className="text-sm" />
        </div>

        {/* PREVIEW */}
        {preview.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="w-20 h-20 object-cover rounded-lg" />

                {/* tombol hapus */}
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <div className="pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
            {loading ? "Saving..." : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
