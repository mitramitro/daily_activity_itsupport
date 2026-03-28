import { useEffect } from "react";

export default function TaskDetailModal({ task, onClose }) {
  // close ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Detail Task</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* INFO */}
        <div className="space-y-2 text-sm mb-5">
          <div>
            <b>Employee:</b> {task.employee?.nama}
          </div>
          <div>
            <b>Office:</b> {task.office?.name}
          </div>
          <div>
            <b>Kategori:</b> {task.kategori}
          </div>
          <div>
            <b>Jenis:</b> {task.jenis_task}
          </div>
          <div>
            <b>Status:</b> {task.status}
          </div>
          <div>
            <b>Tanggal:</b> {task.tanggal}
          </div>
          <div>
            <b>Kendala:</b> {task.kendala}
          </div>
          <div>
            <b>Solusi:</b> {task.solusi || "-"}
          </div>
        </div>

        {/* FOTO */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold mb-2">Foto</h3>

          {task.photos?.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {task.photos.map((p) => (
                <img key={p.id} src={`http://localhost:8000/storage/${p.photo}`} className="w-24 h-24 object-cover rounded-lg border" />
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400">Tidak ada foto</div>
          )}
        </div>

        {/* LOG */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Log Activity</h3>

          {task.logs?.length > 0 ? (
            <div className="space-y-3">
              {task.logs.map((log) => (
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
      </div>
    </div>
  );
}
