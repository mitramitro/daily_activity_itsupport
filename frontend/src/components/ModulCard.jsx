import { Link } from "react-router-dom";

export default function ModuleCard({ title, desc, link, icon }) {
  return (
    <Link
      to={link}
      className="
        bg-white
        p-4
        rounded-2xl
        shadow-sm
        border border-gray-100/50
        hover:shadow-md
        active:scale-[0.97]
        transition-all
        duration-150
        flex
        flex-col
        gap-2.5
      "
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
