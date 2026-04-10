import BarangLogForm from "./BarangLogForm";

export default function BarangLogModal({ open, onClose, onSuccess, user }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL WRAPPER */}
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        {/* MODAL CONTENT */}
        <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Tambah Transaksi</h2>

            <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
              ✕
            </button>
          </div>

          {/* BODY (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            <BarangLogForm onSuccess={onSuccess} onClose={onClose} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
