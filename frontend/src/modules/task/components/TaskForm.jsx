import { useEffect, useState } from "react";
import Select from "react-select";
import { createTaskWithPhoto, updateTask, getEmployees, getOffices } from "../services/TaskService";
import { getImageUrl } from "../../../services/api";

export default function TaskForm({ onSuccess, initialData }) {
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [offices, setOffices] = useState([]);

  const isEditMode = !!initialData;

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
    status: "in_progress",
  });

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  // 🔥 fetch data
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

  // 🔥 set data saat edit
  useEffect(() => {
    if (initialData) {
      setForm({
        employee_id: initialData.employee?.id || "",
        office_id: initialData.office?.id || "",
        kategori: initialData.kategori || "",
        jenis_task: initialData.jenis_task || "incident",
        kendala: initialData.kendala || "",
        solusi: initialData.solusi || "",
        tanggal: initialData.tanggal || "",
        status: initialData.status || "in_progress	",
      });

      // preview foto lama
      if (initialData.photos) {
        const existingPhotos = initialData.photos.map((p) => getImageUrl(p.photo));
        setPreview(existingPhotos);
      }
    }
  }, [initialData]);

  // 🔹 options mapping
  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: e.nama,
  }));

  const officeOptions = offices.map((o) => ({
    value: o.id,
    label: o.name,
  }));

  // 🔹 style select
  const customSelectStyle = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isEditMode ? "#f3f4f6" : "#f9fafb",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      borderRadius: "8px",
      minHeight: "38px",
    }),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  // 🔥 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await updateTask(initialData.id, form);
      } else {
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
          formData.append(key, form[key]);
        });

        files.forEach((file) => {
          formData.append("photos[]", file);
        });

        await createTaskWithPhoto(formData);
      }

      alert("Task berhasil disimpan");
      onSuccess && onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Gagal menyimpan task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMPLOYEE */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Employee</label>
          <Select
            options={employeeOptions}
            value={employeeOptions.find((opt) => opt.value === form.employee_id)}
            onChange={(selected) => setForm({ ...form, employee_id: selected?.value })}
            isDisabled={isEditMode}
            styles={customSelectStyle}
          />
        </div>

        {/* OFFICE */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Office</label>
          <Select options={officeOptions} value={officeOptions.find((opt) => opt.value === form.office_id)} onChange={(selected) => setForm({ ...form, office_id: selected?.value })} isDisabled={isEditMode} styles={customSelectStyle} />
        </div>

        {/* ROW */}
        <div className="grid grid-cols-2 gap-3">
          {/* KATEGORI */}
          <Select options={kategoriOptions} value={kategoriOptions.find((opt) => opt.value === form.kategori)} onChange={(selected) => setForm({ ...form, kategori: selected?.value })} isDisabled={isEditMode} styles={customSelectStyle} />

          {/* JENIS */}
          <Select options={jenisOptions} value={jenisOptions.find((opt) => opt.value === form.jenis_task)} onChange={(selected) => setForm({ ...form, jenis_task: selected?.value })} isDisabled={isEditMode} styles={customSelectStyle} />
        </div>

        {/* STATUS (editable) */}
        {isEditMode && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select name="status" value={form.status} disabled onChange={handleChange} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm">
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}

        {/* TANGGAL */}
        <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} disabled={isEditMode} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm" />

        {/* KENDALA */}
        <label className="text-xs text-gray-500 mb-1 block">Kendala</label>
        <textarea name="kendala" value={form.kendala} onChange={handleChange} rows="3" className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm" />

        {/* SOLUSI */}
        <label className="text-xs text-gray-500 mb-1 block">Solusi</label>
        <textarea name="solusi" value={form.solusi} onChange={handleChange} rows="2" className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm" />

        {/* FOTO */}
        {!isEditMode && <input type="file" multiple onChange={handleFileChange} />}

        {/* PREVIEW */}
        {/* PREVIEW (hanya CREATE) */}
        {!isEditMode && preview.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="w-20 h-20 object-cover rounded" />

                {/* 🔥 tombol delete */}
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Save Task"}
        </button>
      </form>
    </div>
  );
}
