export default function StockTable({ data }) {
  return (
    <table className="bg-white rounded-xl shadow overflow-x-auto w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Barang</th>
          <th className="p-2 text-left">Office</th>
          <th className="p-2 text-left">Stock</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-t">
            <td className="p-2">{row.barang?.name}</td>
            <td className="p-2">{row.office?.name}</td>
            <td className="p-2 font-semibold">{row.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
