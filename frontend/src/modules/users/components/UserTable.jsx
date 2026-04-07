import { useState, useEffect } from "react";

export default function UserTable({ users, onRowClick }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return "bg-red-100 text-red-700";
    }
    return "bg-blue-100 text-blue-700";
  };

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th className="px-4 py-3 text-left">Nama</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Role</th>
          <th className="px-4 py-3 text-right">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {(!users || users.length === 0) && (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-400">
              Tidak ada data
            </td>
          </tr>
        )}

        {(users || []).map((user) => (
          <tr key={user.id} onClick={isMobile && onRowClick ? () => onRowClick(user) : undefined} className="border-t hover:bg-gray-50 transition cursor-pointer lg:cursor-default">
            <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>

            <td className="px-4 py-3 text-gray-500">{user.email}</td>

            <td className="px-4 py-3">
              <span
                className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${getRoleStyle(user.role)}
          `}
              >
                {user.role}
              </span>
            </td>

            <td className="px-4 py-3 text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick && onRowClick(user);
                }}
                className="text-gray-500 hover:text-black"
              >
                ⋯
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
