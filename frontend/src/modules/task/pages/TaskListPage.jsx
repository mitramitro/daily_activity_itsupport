import { useEffect, useState } from "react";
import { getTasks, exportTasks } from "../services/TaskService";
import TaskTable from "../components/TaskTable";
import TaskCard from "../components/TaskCard";
import TaskPagination from "../components/TaskPagination";
import TaskFilter from "../components/TaskFilter";
import TaskDetailModal from "../components/TaskDetailModal";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tanggalDari, setTanggalDari] = useState("");
  const [tanggalSampai, setTanggalSampai] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getTasks({
        page,
        search,
        status,
        tanggal_dari: tanggalDari,
        tanggal_sampai: tanggalSampai,
      });

      setTasks(res.data.data.data);
      setMeta(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleFilter = () => {
    if (tanggalDari && tanggalSampai && tanggalDari > tanggalSampai) {
      alert("Tanggal tidak valid");
      return;
    }

    setPage(1);
    fetchData();
  };

  const handleExport = async () => {
    try {
      const res = await exportTasks({
        search,
        status,
        tanggal_dari: tanggalDari,
        tanggal_sampai: tanggalSampai,
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "tasks.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Task List</h1>

          <button onClick={handleExport} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded text-sm hover:bg-green-100">
            Export
          </button>
        </div>

        {/* FILTER */}
        <TaskFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          tanggalDari={tanggalDari}
          setTanggalDari={setTanggalDari}
          tanggalSampai={tanggalSampai}
          setTanggalSampai={setTanggalSampai}
          onFilter={handleFilter}
        />

        {/* LOADING */}
        {loading && <div className="text-sm text-gray-500 mb-3">Loading...</div>}

        {/* EMPTY */}
        {!loading && tasks.length === 0 && <div className="text-sm text-gray-400 text-center py-6">Tidak ada data</div>}

        {/* MOBILE */}
        <div className="grid gap-3 md:hidden">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDetail={setSelectedTask} />
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block">
          <TaskTable tasks={tasks} onDetail={setSelectedTask} />
        </div>

        {/* PAGINATION */}
        <TaskPagination meta={meta} onPageChange={setPage} />
      </div>

      {selectedTask && (
        <TaskDetailModal
          key={selectedTask.id} // 🔥 penting
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
