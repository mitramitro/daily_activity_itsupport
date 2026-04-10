import toast from "react-hot-toast";

export default function BarangCard({ data, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <div className="flex justify-between">
        <h3 className="font-semibold">{data.name}</h3>

        <span className={`text-xs px-2 py-1 rounded ${data.type === "consumable" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{data.type}</span>
      </div>

      <p className="text-sm text-gray-500">Unit: {data.unit}</p>

      <div className="flex justify-end">
        <button
          onClick={() => {
            if (confirm("Hapus barang?")) {
              onDelete(data);
              toast.success("Barang dihapus");
            }
          }}
          className="text-red-600 text-sm"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
