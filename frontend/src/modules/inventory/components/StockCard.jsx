export default function StockCard({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
      <h3 className="font-semibold">{data.barang?.name}</h3>

      <p className="text-sm text-gray-500">{data.office?.name}</p>

      <p className="text-2xl font-bold mt-2">{data.stock}</p>
    </div>
  );
}
