import BarangForm from "./BarangForm";

export default function BarangModal({ open, onClose, onSuccess, initialData }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">{initialData ? "Edit Barang" : "Tambah Barang"}</h2>

        <BarangForm initialData={initialData} onSuccess={onSuccess} onClose={onClose} />
      </div>
    </div>
  );
}
