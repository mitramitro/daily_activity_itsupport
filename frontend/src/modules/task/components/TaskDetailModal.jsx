import { useEffect, useState } from "react";
import { updateTask, uploadTaskPhotos, getTaskById, deleteTaskPhoto } from "../services/TaskService";
import { getImageUrl } from "../../../services/api";

export default function TaskDetailModal({ task, onClose, onUpdated }) {
  const [localTask, setLocalTask] = useState(task);
  const [status, setStatus] = useState(task.status);
  const [kendala, setKendala] = useState(task.kendala || "");
  const [solusi, setSolusi] = useState(task.solusi || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalTask(task);
    setStatus(task.status);
    setKendala(task.kendala || "");
    setSolusi(task.solusi || "");
  }, [task]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ SIMPAN PERUBAHAN
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTask(localTask.id, { status, kendala, solusi });

      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);

      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPLOAD FOTO
  const handleUploadPhoto = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("photos[]", f));

    try {
      setUploading(true);
      await uploadTaskPhotos(localTask.id, formData);

      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);

      onUpdated?.();
    } catch (err) {
      alert("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Hapus foto ini?")) return;

    try {
      await deleteTaskPhoto(photoId);

      setLocalTask((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      }));

      onUpdated?.();
    } catch (err) {
      alert("Gagal hapus foto");
    }
  };

  if (!localTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-start p-4 md:p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Detail Task</h2>
            <p className="text-xs text-gray-500">
              {localTask.employee?.nama} • {localTask.office?.name}
            </p>
          </div>

          <button onClick={onClose} className="text-gray-400 text-lg">
            ✕
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto flex-1 pb-20">
          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <p className="text-gray-500">Kategori</p>
              <p className="font-medium">{localTask.kategori}</p>
            </div>

            <div>
              <p className="text-gray-500">Jenis</p>
              <p className="font-medium">{localTask.jenis_task}</p>
            </div>

            <div>
              <p className="text-gray-500">Tanggal</p>
              <p className="font-medium">{formatDate(localTask.tanggal)}</p>
            </div>
          </div>

          {/* FORM */}
          <div className="space-y-3 mb-5">
            <div>
              <label className="text-xs text-gray-500">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                <option value="pending">Pending</option>
                <option value="in_progress">Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Kendala</label>
              <textarea value={kendala} onChange={(e) => setKendala(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-xs text-gray-500">Solusi</label>
              <textarea value={solusi} onChange={(e) => setSolusi(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
            </div>

            <button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-medium">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

          {/* FOTO */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2">Foto</h3>

            {localTask.photos?.length ? (
              <div className="flex flex-wrap gap-2">
                {localTask.photos.map((p) => (
                  <div key={p.id} className="relative">
                    <img src={getImageUrl(p.photo)} className="w-24 h-24 object-cover rounded-lg border" />

                    <button onClick={() => handleDeletePhoto(p.id)} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 text-xs rounded-full">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Tidak ada foto</p>
            )}

            <input type="file" multiple onChange={handleUploadPhoto} disabled={uploading} className="mt-2 text-sm" />

            {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
          </div>

          {/* LOG */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Log Activity</h3>

            {localTask.logs?.length ? (
              <div className="space-y-3">
                {[...localTask.logs]
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium capitalize">{log.status.replace("_", " ")}</p>
                        <p className="text-xs text-gray-500">{formatDate(log.created_at)}</p>
                        {log.note && <p className="text-xs text-gray-600">{log.note}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Belum ada log</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
