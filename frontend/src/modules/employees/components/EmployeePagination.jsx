export default function EmployeePagination({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">
        Prev
      </button>

      <span className="px-3 py-1">
        {page} / {totalPages}
      </span>

      <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">
        Next
      </button>
    </div>
  );
}
