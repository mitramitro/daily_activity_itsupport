import OfficeForm from "./OfficeForm";

export default function OfficeModal({ open, onClose, onSubmit, initialData }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-5">
          {initialData ? "Edit Office" : "Tambah Office"}
        </h2>

        <OfficeForm
          key={initialData?.id || "new"}
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
