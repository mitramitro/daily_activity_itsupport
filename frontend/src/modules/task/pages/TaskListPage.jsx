import { useEffect, useState } from "react";
import { getTasks } from "../services/TaskService";
import TaskTable from "../components/TaskTable";
import TaskCard from "../components/TaskCard";
import TaskPagination from "../components/TaskPagination";
import TaskFilter from "../components/TaskFilter";
import TaskDetailModal from "../components/TaskDetailModal";
import FloatingButton from "../../../components/FloatingButton";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TaskListPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // 🔥 NEW: jenis task filter
  const [jenisTask, setJenisTask] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [summary, setSummary] = useState(null);

  const totalAll = summary?.total_all || 0;
  const totalIncident = summary?.total_incident || 0;
  const totalRequest = summary?.total_request || 0;

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getTasks({
        page,
        search,
        status,
        jenis_task: jenisTask, // 🔥 tambah ini
      });

      setTasks(res.data.data.data);
      setMeta(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, jenisTask, search, status]);

  useEffect(() => {
    setPage(1);
  }, [search, status, jenisTask]);

  // 🔥 FILTER STATUS (hanya active)
  const filteredTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress");

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Task List</h1>
        </div>

        {/* 🔥 JENIS TASK FILTER (BUTTON) */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setJenisTask("")} className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${jenisTask === "" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
            All <span className="text-xs">({totalAll})</span>
          </button>

          <button onClick={() => setJenisTask("incident")} className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${jenisTask === "incident" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
            Incident <span className="text-xs">({totalIncident})</span>
          </button>

          <button onClick={() => setJenisTask("request")} className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${jenisTask === "request" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
            Request <span className="text-xs">({totalRequest})</span>
          </button>
        </div>

        {/* FILTER */}
        <TaskFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          showAdvanced={false} // 🔥 sembunyikan filter selain search
        />

        {/* LOADING */}
        {loading && <div className="text-sm text-gray-500 mb-3">Loading...</div>}

        {/* EMPTY */}
        {!loading && filteredTasks.length === 0 && <div className="text-sm text-gray-400 text-center py-6">Tidak ada data</div>}

        {/* MOBILE */}
        <div className="grid gap-3 md:hidden">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onDetail={setSelectedTask} />
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block">
          <TaskTable tasks={filteredTasks} onDetail={setSelectedTask} />
        </div>

        {/* PAGINATION */}
        <TaskPagination meta={meta} onPageChange={setPage} />
      </div>

      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchData} />}

      {/* FLOATING BUTTON */}
      {/* <FloatingButton icon={<Plus size={24} />} onClick={() => navigate("/tasks/create")} /> */}
    </div>
  );
}
