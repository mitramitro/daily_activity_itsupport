import EmployeeForm from "./EmployeeForm";

export default function EmployeeModal({ open, onClose, onSuccess, initialData }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-7 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Tambah Pekerja</h2>

        <EmployeeForm onSubmit={(data) => onSuccess(data)} onCancel={onClose} initialData={initialData} />
      </div>
    </div>
  );
}
