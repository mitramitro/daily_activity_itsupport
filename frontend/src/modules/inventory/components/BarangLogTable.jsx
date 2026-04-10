import { useState } from "react";
import BarangLogDetailModal from "./BarangLogDetailModal";

const formatEntity = (office, employee) => {
  if (employee) return `${employee.nama} (${employee.lokasi})`;
  if (office) return office.name;
  return "-";
};

export default function BarangLogTable({ data, loading, onDelete }) {
  const [selected, setSelected] = useState(null);

  if (loading) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Tanggal</th>
              <th className="p-2 text-left">Barang</th>
              <th className="p-2 text-center">Type</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-left">Dari</th>
              <th className="p-2 text-left">Ke</th>
              <th className="p-2 text-center">Notes</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}

            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(row)}>
                <td className="p-2">{new Date(row.tanggal).toLocaleDateString("id-ID")}</td>

                <td className="p-2">{row.barang?.name}</td>

                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded text-white text-xs ${row.type === "IN" ? "bg-green-500" : "bg-red-500"}`}>{row.type}</span>
                </td>

                <td className="p-2 text-center">{row.qty}</td>

                <td className="p-2">{formatEntity(row.fromOffice, row.fromEmployee)}</td>

                <td className="p-2">{formatEntity(row.toOffice, row.toEmployee)}</td>

                <td className="p-2 text-center">{row.notes ? "📝" : "-"}</td>

                {/* 🔥 AKSI */}
                <td
                  className="p-2 text-center"
                  onClick={(e) => e.stopPropagation()} // 🔥 penting!
                >
                  <button onClick={() => onDelete(row)} className="text-red-500 hover:scale-110">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 DETAIL MODAL */}
      <BarangLogDetailModal open={!!selected} data={selected} onClose={() => setSelected(null)} />
    </>
  );
}
