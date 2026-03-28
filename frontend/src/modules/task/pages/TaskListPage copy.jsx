export default function TaskListPage() {
  const tasks = [
    {
      id: 1,
      title: "Perbaiki Printer",
      worker: "Budi",
      date: "05 Mar 2026",
      status: "Selesai",
    },
    {
      id: 2,
      title: "Install Ulang PC",
      worker: "Andi",
      date: "05 Mar 2026",
      status: "Proses",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Daftar Task</h1>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-500">
                  {task.worker} • {task.date}
                </p>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full ${task.status === "Selesai" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
