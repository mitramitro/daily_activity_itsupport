export default function BarangTable({ data, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nama</th>
            <th className="p-2 text-center">Tipe</th>
            <th className="p-2 text-center">Unit</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}

          {data.map((row) => {
            const stocks = row.stocks || [];

            return (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {/* NAMA */}
                <td className="p-2 font-medium">{row.name}</td>

                {/* TIPE */}
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${row.type === "consumable" ? "bg-blue-500 text-white" : "bg-gray-400 text-white"}`}>{row.type}</span>
                </td>

                {/* UNIT */}
                <td className="p-2 text-center">{row.unit}</td>

                {/* AKSI */}
                <td className="p-2 text-center space-x-2">
                  <button onClick={() => onEdit(row)} className="text-blue-500 hover:scale-110">
                    ✏️
                  </button>

                  <button onClick={() => onDelete(row)} className="text-red-500 hover:scale-110">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
