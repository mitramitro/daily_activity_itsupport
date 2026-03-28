import { useEffect, useState } from "react";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // ambil JWT

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTasks(data.data || []);
    } catch (error) {
      console.error("Error fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task List</h1>

      {/* ================= MOBILE (CARD) ================= */}
      <div className="grid gap-4 md:hidden">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow p-4 border">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-sm">
                {task.kategori} - {task.jenis_task}
              </h2>

              <span className={`text-xs px-2 py-1 rounded-full ${task.status === "pending" ? "bg-gray-200" : task.status === "in_progress" ? "bg-yellow-200" : "bg-green-200"}`}>{task.status}</span>
            </div>

            <p className="text-sm mb-2">{task.kendala}</p>

            <div className="text-xs text-gray-500 space-y-1">
              <p>👤 {task.employee?.nama}</p>
              <p>📍 Office {task.office_id}</p>
              <p>📅 {task.tanggal}</p>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Detail</button>
              <button className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP (TABLE) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Kendala</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Status</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-2">{task.employee?.nama}</td>
                <td className="p-2">{task.kendala}</td>
                <td className="p-2 text-center">{task.kategori}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 text-xs rounded ${task.status === "pending" ? "bg-gray-200" : task.status === "in_progress" ? "bg-yellow-200" : "bg-green-200"}`}>{task.status}</span>
                </td>
                <td className="p-2 text-center">{task.tanggal}</td>
                <td className="p-2 text-center">
                  <button className="text-blue-500 text-xs mr-2">Detail</button>
                  <button className="text-yellow-500 text-xs">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
