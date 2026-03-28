export default function TaskPagination({ meta, onPageChange }) {
  if (!meta) return null;

  const { current_page, last_page } = meta;

  return (
    <div className="flex justify-center items-center gap-2 mt-4 text-sm">
      <button disabled={current_page === 1} onClick={() => onPageChange(current_page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">
        Prev
      </button>

      <span>
        Page {current_page} of {last_page}
      </span>

      <button disabled={current_page === last_page} onClick={() => onPageChange(current_page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">
        Next
      </button>
    </div>
  );
}
