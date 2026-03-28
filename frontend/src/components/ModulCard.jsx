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
        hover:shadow-md
        transition
        flex
        flex-col
        gap-2
      "
    >
      <div className="text-blue-600">{icon}</div>

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}
