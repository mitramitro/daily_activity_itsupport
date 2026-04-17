export default function BarangLogDetailModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const formatEntity = (office, employee) => {
    // 🔥 UPDATED: lokas -> office.name
    if (employee) {
      return `${employee.nama} (${employee.office?.name || "-"})`;
    }

    if (office) return office.name;

    return "-";
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">Detail Transaksi</h2>

        <div className="text-sm space-y-2">
          {/* <p>
            <b>Tanggal:</b> {data.tanggal}
          </p>
          <p>
            <b>Barang:</b> {data.barang?.name}
          </p>
          <p>
            <b>Type:</b> {data.type}
          </p>
          <p>
            <b>Qty:</b> {data.qty}
          </p>
          <p>
            <b>Dari:</b> {formatEntity(data.fromOffice, data.fromEmployee)}
          </p>
          <p>
            <b>Ke:</b> {formatEntity(data.toOffice, data.toEmployee)}
          </p> */}
          <p>
            <b>Kondisi:</b> {data.condition || "-"}
          </p>
          <p>
            <b>Notes:</b> {data.notes || "-"}
          </p>
        </div>

        <div className="text-right mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
