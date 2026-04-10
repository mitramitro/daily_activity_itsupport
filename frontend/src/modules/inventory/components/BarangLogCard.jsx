export default function BarangLogCard({ data, onDelete, onClick }) {
  return (
    <div onClick={() => onClick?.(data)} className="bg-white rounded-xl shadow p-4 active:scale-[0.98] transition cursor-pointer">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">{data.tanggal}</p>

        <span className={`text-xs px-2 py-1 rounded font-semibold ${data.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{data.type}</span>
      </div>

      {/* BARANG */}
      <h3 className="font-semibold text-sm mt-1">{data.barang?.name}</h3>

      {/* INFO */}
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p>
          Qty: <b>{data.qty}</b>
        </p>

        <p>
          Dari: <b>{data.from_employee?.nama || data.from_office?.name || "-"}</b>
        </p>

        <p>
          Ke: <b>{data.to_employee?.nama || data.to_office?.name || "-"}</b>
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 penting biar ga trigger onClick card
            onDelete(data);
          }}
          className="text-red-600 text-xs font-medium"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
