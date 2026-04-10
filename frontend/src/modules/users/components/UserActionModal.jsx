import { useEffect, useState } from "react";

export default function UserActionModal({ open, onClose, onEdit, onChangePassword }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!open) return null;

  const ActionItem = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm text-gray-700 font-medium
        hover:bg-gray-100 active:scale-[0.98]
        transition-all
      "
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );

  // 📱 MOBILE (Bottom Sheet)
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose}>
        <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 pb-20 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Aksi User</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
              ✕
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-1">
            <ActionItem icon="✏️" label="Edit User" onClick={onEdit} />

            <div className="border-t border-gray-100 my-2"></div>

            <ActionItem icon="🔐" label="Ganti Password" onClick={onChangePassword} />
          </div>
        </div>
      </div>
    );
  }

  // 💻 DESKTOP (Centered Modal)
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="
          bg-white rounded-2xl w-80 shadow-xl p-5
          animate-fadeIn
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Aksi User</h3>

        {/* Actions */}
        <div className="space-y-1">
          <ActionItem icon="✏️" label="Edit User" onClick={onEdit} />

          <div className="border-t border-gray-100 my-2"></div>

          <ActionItem icon="🔐" label="Ganti Password" onClick={onChangePassword} />
        </div>
      </div>
    </div>
  );
}
