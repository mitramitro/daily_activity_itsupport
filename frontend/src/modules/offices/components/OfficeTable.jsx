import { useState, useEffect } from "react";

export default function OfficeTable({ offices, onRowClick, loading }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th className="px-4 py-3 text-left w-16">No</th>
          <th className="px-4 py-3 text-left">Nama Office</th>
          <th className="px-4 py-3 text-right">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {loading && (
          <tr>
            <td colSpan="3" className="text-center py-4 text-gray-400">
              Loading...
            </td>
          </tr>
        )}

        {!loading && (!offices || offices.length === 0) && (
          <tr>
            <td colSpan="3" className="text-center py-4 text-gray-400">
              Tidak ada data
            </td>
          </tr>
        )}

        {!loading &&
          (offices || []).map((office, index) => (
            <tr
              key={office.id}
              onClick={isMobile && onRowClick ? () => onRowClick(office) : undefined}
              className="border-t hover:bg-gray-50 transition cursor-pointer lg:cursor-default"
            >
              <td className="px-4 py-3 text-gray-500">{index + 1}.</td>
              <td className="px-4 py-3 font-medium text-gray-800">{office.name}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick && onRowClick(office);
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
