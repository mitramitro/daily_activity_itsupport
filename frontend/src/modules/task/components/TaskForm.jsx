import { useEffect, useState } from "react";
import Select from "react-select";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core"; // 🔥 import Capacitor
import { createTaskWithPhoto, updateTask, getEmployees, getOffices } from "../services/TaskService";
import { getImageUrl } from "../../../services/api";
import toast from "react-hot-toast";

export default function TaskForm({ onSuccess, initialData, currentUser }) {
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [offices, setOffices] = useState([]);

  const isEditMode = !!initialData;
  const isNative = Capacitor.isNativePlatform(); // 🔥 cek apakah jalan di mobile

  //untuk default office berdasarkan user yang login (hanya saat create, kalau edit tidak diubah)
  useEffect(() => {
    if (!isEditMode && currentUser?.office_id && offices.length) {
      setForm((prev) => {
        if (prev.office_id) return prev;

        return {
          ...prev,
          office_id: Number(currentUser.office_id),
        };
      });
    }
  }, [currentUser, offices, isEditMode]);

  const kategoriOptions = [
    { value: "PC", label: "PC" },
    { value: "Laptop", label: "Laptop" },
    { value: "Network", label: "Network" },
    { value: "Aplikasi", label: "Aplikasi" },
    { value: "Printer", label: "Printer" },
    { value: "HT", label: "HT" },
    { value: "Sound System", label: "Sound System" },
    { value: "Telepon", label: "Telepon" },
    { value: "Email", label: "Email" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  const jenisOptions = [
    { value: "incident", label: "Incident" },
    { value: "request", label: "Request" },
  ];

  // 🔥 tanggal default hari ini
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [form, setForm] = useState({
    employee_id: "",
    office_id: "",
    kategori: "",
    jenis_task: "incident",
    kendala: "",
    solusi: "",
    tanggal: getTodayDate(),
    status: "in_progress",
  });

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState({});

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
        tanggal: initialData.tanggal || getTodayDate(),
        status: initialData.status || "in_progress",
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
    label: `${e.nama} - ${e.nomor_pekerja} - ${e.fungsi}`,
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
      border: state.isFocused ? "2px solid #3b82f6" : "1px solid #e5e7eb",
      boxShadow: "none",
      borderRadius: "8px",
      minHeight: "38px",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      },
    }),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // 🔥 AMBIL FOTO DARI CAMERA (CAPACITOR)
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `photo_${Date.now()}.jpeg`, { type: "image/jpeg" });

      setFiles((prev) => [...prev, file]);
      setPreview((prev) => [...prev, image.dataUrl]);
    } catch (err) {
      console.error("Camera error:", err);
      if (err.message !== "User cancelled photos app") {
        toast.error("Gagal mengambil foto");
      }
    }
  };

  // 🔥 AMBIL FOTO DARI GALLERY (CAPACITOR)
  const pickFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `gallery_${Date.now()}.jpeg`, { type: "image/jpeg" });

      setFiles((prev) => [...prev, file]);
      setPreview((prev) => [...prev, image.dataUrl]);
    } catch (err) {
      console.error("Gallery error:", err);
      if (err.message !== "User cancelled photos app") {
        toast.error("Gagal memilih foto");
      }
    }
  };

  // 🔥 FILE INPUT UNTUK WEB
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

  // 🔥 validasi form
  const validateForm = () => {
    const newErrors = {};

    if (!form.kategori) {
      newErrors.kategori = "Kategori wajib dipilih";
    }
    if (!form.employee_id) {
      newErrors.employee_id = "Employee wajib dipilih";
    }
    if (!form.kendala) {
      newErrors.kendala = "Kendala wajib diisi";
    }
    if (!form.solusi) {
      newErrors.solusi = "Solusi wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !validateForm()) {
      toast.error("Mohon lengkapi data yang wajib diisi");
      return;
    }

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

      toast.success("Task berhasil disimpan");
      onSuccess && onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Gagal menyimpan task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMPLOYEE */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Employee <span className="text-red-500">*</span>
          </label>
          <Select
            options={employeeOptions}
            value={employeeOptions.find((opt) => opt.value === form.employee_id)}
            onChange={(selected) => {
              setForm({ ...form, employee_id: selected?.value || "" });
              if (errors.employee_id) setErrors({ ...errors, employee_id: "" });
            }}
            isDisabled={isEditMode}
            styles={{
              ...customSelectStyle,
              control: (base, state) => ({
                ...customSelectStyle.control(base, state),
                borderColor: errors.employee_id ? "#ef4444" : state.isFocused ? "#3b82f6" : "#e5e7eb",
              }),
            }}
            placeholder="Pilih employee..."
          />
          {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
        </div>

        {/* OFFICE */}
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
            isDisabled={isEditMode}
            styles={customSelectStyle}
            placeholder="Pilih office..."
          />
        </div>

        {/* ROW */}
        <div className="grid grid-cols-2 gap-3">
          {/* KATEGORI */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Kategori <span className="text-red-500">*</span>
            </label>
            <Select
              options={kategoriOptions}
              value={kategoriOptions.find((opt) => opt.value === form.kategori)}
              onChange={(selected) => {
                setForm({ ...form, kategori: selected?.value || "" });
                if (errors.kategori) setErrors({ ...errors, kategori: "" });
              }}
              isDisabled={isEditMode}
              styles={{
                ...customSelectStyle,
                control: (base, state) => ({
                  ...customSelectStyle.control(base, state),
                  borderColor: errors.kategori ? "#ef4444" : state.isFocused ? "#3b82f6" : "#e5e7eb",
                }),
              }}
              placeholder="Pilih kategori..."
            />
            {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
          </div>

          {/* JENIS */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Jenis</label>
            <Select
              options={jenisOptions}
              value={jenisOptions.find((opt) => opt.value === form.jenis_task)}
              onChange={(selected) => setForm({ ...form, jenis_task: selected?.value || "incident" })}
              isDisabled={isEditMode}
              styles={customSelectStyle}
            />
          </div>
        </div>

        {/* STATUS (editable) */}
        {isEditMode && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200">
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}

        {/* TANGGAL */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
          <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} disabled={isEditMode} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200" />
        </div>

        {/* KENDALA */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Kendala <span className="text-red-500">*</span>
          </label>
          <textarea
            name="kendala"
            value={form.kendala}
            onChange={handleChange}
            rows="3"
            className={`w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border ${errors.kendala ? "border-red-500" : "border-gray-200"}`}
            placeholder="Masukkan kendala..."
          />
          {errors.kendala && <p className="text-red-500 text-xs mt-1">{errors.kendala}</p>}
        </div>

        {/* SOLUSI */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Solusi <span className="text-red-500">*</span>
          </label>
          <textarea
            name="solusi"
            value={form.solusi}
            onChange={handleChange}
            rows="2"
            className={`w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border ${errors.solusi ? "border-red-500" : "border-gray-200"}`}
            placeholder="Masukkan solusi..."
          />
          {errors.solusi && <p className="text-red-500 text-xs mt-1">{errors.solusi}</p>}
        </div>

        {/* FOTO */}
        {!isEditMode && (
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Foto</label>

            {/* 🔥 MOBILE: Camera & Gallery */}
            {isNative ? (
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={takePhoto} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Camera
                </button>

                <button type="button" onClick={pickFromGallery} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Gallery
                </button>
              </div>
            ) : (
              /* 🔥 WEB: File input */
              <div className="mb-3">
                <label className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Choose File
                  <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                </label>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW (hanya CREATE) */}
        {!isEditMode && preview.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PREVIEW (EDIT MODE) */}
        {isEditMode && preview.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Foto Existing</label>
            <div className="flex gap-2 flex-wrap">
              {preview.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="w-20 h-20 object-cover rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Task"
          )}
        </button>
      </form>
    </div>
  );
}
