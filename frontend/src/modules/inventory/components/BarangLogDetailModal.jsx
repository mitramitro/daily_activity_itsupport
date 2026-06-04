export default function BarangLogDetailModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const formatEntity = (employee, office) => {
    if (employee) {
      return `${employee.nama} (${employee.office?.name || "-"})`;
    }
    if (office) return office.name;
    return "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Detail Transaksi</h2>

        <div className="text-sm space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500">Tanggal</p>
              <p className="font-medium">{formatDate(data.tanggal)}</p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">
                <span className={`px-2 py-0.5 rounded text-white text-xs ${data.type === "IN" ? "bg-green-500" : "bg-red-500"}`}>
                  {data.type}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-500">Barang</p>
              <p className="font-medium">{data.barang?.name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Qty</p>
              <p className="font-medium">{data.qty}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Dari</p>
            <p className="font-medium">{formatEntity(data.from_employee, data.from_office)}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Ke</p>
            <p className="font-medium">{formatEntity(data.to_employee, data.to_office)}</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-gray-500">Kondisi</p>
            <p className="font-medium">{data.condition || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Catatan</p>
            <p className="font-medium">{data.notes || "-"}</p>
          </div>
        </div>

        <div className="text-right mt-6">
          <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
