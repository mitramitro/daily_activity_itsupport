import TaskStatusBadge from "./TaskStatusBadge";

export default function TaskTable({ tasks }) {
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th className="px-4 py-3 text-left">NAMA</th>
          <th className="px-4 py-3 text-left">KENDALA</th>
          <th className="px-4 py-3 text-left">KATEGORI</th>
          <th className="px-4 py-3 text-left">STATUS</th>
          <th className="px-4 py-3 text-left">TANGGAL</th>
          <th className="px-4 py-3 text-right">AKSI</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b last:border-none hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{task.employee?.nama}</td>

            <td className="px-4 py-3 text-gray-600">{task.kendala}</td>

            <td className="px-4 py-3">{task.kategori}</td>

            <td className="px-4 py-3">
              <TaskStatusBadge status={task.status} />
            </td>

            <td className="px-4 py-3">{task.tanggal}</td>

            <td className="px-4 py-3 text-right">
              <button className="text-gray-500 hover:text-black mr-3">...</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
