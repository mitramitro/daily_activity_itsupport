import { Plus } from "lucide-react";

export default function FloatingButton({ onClick, icon = <Plus size={24} />, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-20 right-4
        bg-blue-600 text-white
        w-14 h-14 rounded-full
        flex items-center justify-center
        shadow-lg hover:bg-blue-700
        active:scale-95 transition
        ${className}
      `}
    >
      {icon}
    </button>
  );
}
