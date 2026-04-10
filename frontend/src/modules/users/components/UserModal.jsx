import UserForm from "./UserForm";

export default function UserModal({ open, onClose, onSuccess, initialData, currentUser, getOffices }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-7 shadow-xl">
        {/* Title dinamis */}
        <h2 className="text-lg font-semibold mb-4">{initialData ? "Edit User" : "Tambah User"}</h2>

        <UserForm onSubmit={(data) => onSuccess(data)} onCancel={onClose} initialData={initialData} currentUser={currentUser} getOffices={getOffices} />
      </div>
    </div>
  );
}
