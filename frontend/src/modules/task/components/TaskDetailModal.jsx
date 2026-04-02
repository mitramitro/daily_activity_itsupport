import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { updateTask, uploadTaskPhotos, getTaskById } from "../services/TaskService";
import { getImageUrl } from "../../../services/api";
import { deleteTaskPhoto } from "../services/TaskService";

export default function TaskDetailModal({ task, onClose, onUpdated }) {
  const [isEdit, setIsEdit] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [uploading, setUploading] = useState(false);

  // 🔥 local state biar tidak nutup modal
  const [localTask, setLocalTask] = useState(task);

  useEffect(() => {
    setLocalTask(task);
    setCurrentStatus(task.status);
  }, [task]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!localTask) return null;

  // 🔥 update status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);

    try {
      await updateTask(localTask.id, {
        status: newStatus,
      });

      // refresh data
      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err.response?.data);
      alert("Gagal update status");
    }
  };

  // 🔥 upload foto TANPA nutup modal
  const handleUploadPhoto = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos[]", file);
    });

    try {
      setUploading(true);

      await uploadTaskPhotos(localTask.id, formData);
      // 🔥 refresh data langsung
      const res = await getTaskById(localTask.id);
      // update local
      setLocalTask(res.data.data);

      // 🔥 refresh parent
      onUpdated && onUpdated();

      // reset input
      e.target.value = null;
    } catch (err) {
      console.error(err);
      alert("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    const confirmDelete = confirm("Yakin mau hapus foto ini?");

    if (!confirmDelete) return;

    try {
      await deleteTaskPhoto(photoId);

      setLocalTask((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      }));

      // 🔥 refresh parent
      onUpdated && onUpdated();
      // toast.success("Foto berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal hapus foto");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Task" : "Detail Task"}</h2>

          <div className="flex gap-2">
            {!isEdit && (
              <button onClick={() => setIsEdit(true)} className="px-3 py-1 text-sm border rounded">
                Edit
              </button>
            )}

            {isEdit && (
              <button onClick={() => setIsEdit(false)} className="px-3 py-1 text-sm border rounded">
                Cancel
              </button>
            )}

            <button onClick={onClose} className="text-gray-500">
              ✕
            </button>
          </div>
        </div>

        {/* EDIT MODE */}
        {isEdit ? (
          <TaskForm
            initialData={localTask}
            onSuccess={() => {
              setIsEdit(false);
              onClose();
            }}
          />
        ) : (
          <>
            {/* INFO */}
            <div className="space-y-3 text-sm mb-5">
              <div>
                <b>Employee:</b> {localTask.employee?.nama}
              </div>

              <div>
                <b>Office:</b> {localTask.office?.name}
              </div>

              <div>
                <b>Kategori:</b> {localTask.kategori}
              </div>

              <div>
                <b>Jenis:</b> {localTask.jenis_task}
              </div>

              {/* STATUS */}
              <div>
                <b>Status:</b>
                <select value={currentStatus} onChange={handleStatusChange} className="ml-2 border rounded px-2 py-1 text-sm">
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <b>Tanggal:</b> {localTask.tanggal}
              </div>

              <div>
                <b>Kendala:</b> {localTask.kendala}
              </div>

              <div>
                <b>Solusi:</b> {localTask.solusi || "-"}
              </div>
            </div>

            {/* FOTO */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2">Foto</h3>

              {localTask.photos?.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {localTask.photos.map((p) => (
                    <div key={p.id} className="relative">
                      <img src={getImageUrl(p.photo)} className="w-24 h-24 object-cover rounded-lg border" />

                      {/* 🔥 tombol delete */}
                      <button onClick={() => handleDeletePhoto(p.id)} className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400">Tidak ada foto</div>
              )}

              {/* 🔥 upload after */}
              <div className="mt-3">
                <label className="text-xs text-gray-500 block mb-1">Tambah Foto (After)</label>

                <input type="file" multiple onChange={handleUploadPhoto} disabled={uploading} className="text-sm" />

                {uploading && <div className="text-xs text-blue-500 mt-1">Uploading...</div>}
              </div>
            </div>

            {/* LOG */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Log Activity</h3>

              {localTask.logs?.length > 0 ? (
                <div className="space-y-3">
                  {localTask.logs.map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <div className="font-medium">{log.status}</div>
                        <div className="text-xs text-gray-400">{log.created_at}</div>
                        {log.note && <div className="text-xs">{log.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400">Belum ada log</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
