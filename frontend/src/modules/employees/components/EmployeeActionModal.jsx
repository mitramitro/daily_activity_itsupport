export default function EmployeeActionModal({ open, onClose, onEdit, onDelete }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50"
      onClick={onClose} // 🔥 klik luar close
    >
      <div
        className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 pb-20 max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 🔥 biar gak nutup pas klik dalam
      >
        {/* handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>

        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Aksi</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* action */}
        <button onClick={onEdit} className="flex items-center gap-2 py-2 w-full">
          ✏️ Edit
        </button>

        <button onClick={onDelete} className="flex items-center gap-2 py-2 w-full text-red-500">
          🗑 Hapus
        </button>
      </div>
    </div>
  );
}
