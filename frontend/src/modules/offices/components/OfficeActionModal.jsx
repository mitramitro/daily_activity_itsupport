import { useEffect, useState } from "react";

function ActionItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 active:scale-[0.98] transition-all ${danger ? "text-red-500" : "text-gray-700"}`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

export default function OfficeActionModal({ open, onClose, onEdit, onDelete }) {
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

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose}>
        <div
          className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 pb-20 max-h-[70vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Aksi Office</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
              ✕
            </button>
          </div>

          <div className="space-y-1">
            <ActionItem icon="✏️" label="Edit Office" onClick={onEdit} />

            <div className="border-t border-gray-100 my-2"></div>

            <ActionItem icon="🗑" label="Hapus Office" onClick={onDelete} danger />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-80 shadow-xl p-5 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Aksi Office</h3>

        <div className="space-y-1">
          <ActionItem icon="✏️" label="Edit Office" onClick={onEdit} />

          <div className="border-t border-gray-100 my-2"></div>

          <ActionItem icon="🗑" label="Hapus Office" onClick={onDelete} danger />
        </div>
      </div>
    </div>
  );
}
