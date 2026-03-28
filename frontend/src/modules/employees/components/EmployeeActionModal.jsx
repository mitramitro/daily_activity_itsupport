export default function EmployeeActionModal({ open, onClose, onEdit, onDelete }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 space-y-3">
        <button onClick={onEdit} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100">
          ✏️ Edit
        </button>

        <button onClick={onDelete} className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50">
          🗑️ Hapus
        </button>

        <button onClick={onClose} className="w-full text-center py-2 text-gray-500">
          Batal
        </button>
      </div>
    </div>
  );
}
