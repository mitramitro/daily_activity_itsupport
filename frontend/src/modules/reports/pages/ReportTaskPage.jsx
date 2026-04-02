import { useEffect, useState } from "react";
import { getTasks } from "../../task/services/TaskService";
import { exportTasks } from "../services/ReportServices";
import TaskCard from "../../task/components/TaskCard";
import TaskFilter from "../../task/components/TaskFilter";
import toast from "react-hot-toast";

export default function ReportTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tanggalDari, setTanggalDari] = useState("");
  const [tanggalSampai, setTanggalSampai] = useState("");

  // 🔥 fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getTasks({
        search,
        status,
        tanggal_dari: tanggalDari,
        tanggal_sampai: tanggalSampai,
      });

      setTasks(res.data.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 filter
  const handleFilter = () => {
    if (tanggalDari && tanggalSampai && tanggalDari > tanggalSampai) {
      toast.error("Tanggal tidak valid");
      return;
    }

    fetchData();
  };

  // 🔥 export excel
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
      link.setAttribute("download", "report-task.xlsx");
      document.body.appendChild(link);
      link.click();

      toast.success("Export berhasil");
    } catch (err) {
      console.error(err);
      toast.error("Gagal export");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Report Task</h1>

          <button onClick={handleExport} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded text-sm hover:bg-green-100">
            Export Excel
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

        {/* LIST */}
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} hideAction />
          ))}
        </div>
      </div>
    </div>
  );
}
