import UserForm from "./UserForm";

export default function UserModal({ open, onClose, onSubmit, initialData, currentUser, getOffices }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-5">{initialData ? "Edit User" : "Tambah User"}</h2>

        <UserForm key={initialData?.id || "new"} initialData={initialData} currentUser={currentUser} getOffices={getOffices} onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
}
