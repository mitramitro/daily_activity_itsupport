import TaskStatusBadge from "./TaskStatusBadge";

export default function TaskCard({ task, onDetail }) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-sm font-semibold">
          {task.kategori} - {task.jenis_task}
        </h2>

        <TaskStatusBadge status={task.status} />
      </div>

      <p className="text-xs text-gray-700 mb-2 line-clamp-2">{task.kendala}</p>

      <div className="text-[11px] text-gray-500 space-y-0.5">
        <p>👤 {task.employee?.nama}</p>
        <p>📍 Office {task.office_id}</p>
        <p>📅 {task.tanggal}</p>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <button onClick={() => onDetail(task)} className="text-blue-600 text-sm">
          Detail
        </button>

        <button className="text-xs text-blue-600 hover:underline">Edit</button>
      </div>
    </div>
  );
}
