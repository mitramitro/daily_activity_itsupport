export default function TaskFilter({ search, setSearch, status, setStatus, tanggalDari, setTanggalDari, tanggalSampai, setTanggalSampai, onFilter, showAdvanced = true }) {
  return (
    <div className="space-y-3 mb-4">
      {/* SEARCH */}
      <div>
        <input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-72 border px-3 py-2 rounded text-sm" />
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
        {showAdvanced && (
          <>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <input type="date" value={tanggalDari} onChange={(e) => setTanggalDari(e.target.value)} className="border px-3 py-2 rounded text-sm" />

            <input type="date" value={tanggalSampai} onChange={(e) => setTanggalSampai(e.target.value)} className="border px-3 py-2 rounded text-sm" />

            <div></div>

            <button onClick={onFilter} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              Filter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
