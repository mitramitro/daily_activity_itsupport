import { useState, useEffect } from "react";

export default function EmployeeTable({ employees, onRowClick }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Pekerja") {
      return "bg-green-100 text-green-700";
    }
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th className="px-4 py-3 text-left">Nama</th>
          <th className="px-4 py-3 text-left">Nomor</th>
          <th className="px-4 py-3 text-left">Jabatan</th>
          <th className="px-4 py-3 text-left">Lokasi</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-right">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id} onClick={isMobile && onRowClick ? () => onRowClick(emp) : undefined} className="border-t hover:bg-gray-50 transition cursor-pointer lg:cursor-default">
            <td className="px-4 py-3 font-medium text-gray-800">{emp.nama}</td>

            <td className="px-4 py-3 text-gray-500">{emp.nomor_pekerja}</td>

            <td className="px-4 py-3 text-gray-600">{emp.jabatan}</td>

            <td className="px-4 py-3 text-gray-600">{emp.lokasi}</td>

            <td className="px-4 py-3">
              <span
                className={`
                  px-3 py-1
                  rounded-full
                  text-xs font-medium
                  ${getStatusStyle(emp.status)}
                `}
              >
                {emp.status}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // penting!
                  onRowClick && onRowClick(emp);
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
