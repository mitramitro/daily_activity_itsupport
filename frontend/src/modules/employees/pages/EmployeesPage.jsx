import { useEffect, useState } from "react";
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from "../services/employeeService";
import EmployeeTable from "../components/EmployeeTable";
import EmployeePagination from "../components/EmployeePagination";
import EmployeeModal from "../components/EmployeeModal";
import EmployeeActionModal from "../components/EmployeeActionModal";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setOpenAction(true);
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees({
        page,
        search,
      });

      setEmployees(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <input
          type="text"
          placeholder="Cari pekerja..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="
      w-full
      sm:flex-1
      bg-white
      border border-gray-200
      rounded-xl
      px-4 py-2.5
      text-sm
      focus:outline-none
      focus:ring-2 focus:ring-blue-500
    "
        />

        {/* Button */}
        <button
          onClick={() => setOpenModal(true)}
          className="
      w-full sm:w-auto
      bg-blue-600 hover:bg-blue-700
      text-white
      px-5 py-2.5
      rounded-xl
      text-sm font-medium
      transition
    "
        >
          Tambah Pekerja
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <EmployeeTable employees={employees} onRowClick={handleRowClick} />
      </div>

      {/* Pagination */}
      <EmployeePagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* Modal */}
      <EmployeeModal
        open={openForm || openModal}
        onClose={() => {
          setOpenForm(false);
          setOpenModal(false);
          setEditData(null);
        }}
        initialData={editData}
        onSuccess={async (data) => {
          try {
            if (editData) {
              await updateEmployee(editData.id, data);
            } else {
              await createEmployee(data);
            }

            setOpenForm(false);
            setOpenModal(false);
            setEditData(null);

            fetchEmployees();
          } catch (err) {
            console.error(err);
            alert("Gagal menyimpan data");
          }
        }}
      />

      <EmployeeActionModal
        open={openAction}
        onClose={() => setOpenAction(false)}
        onEdit={() => {
          setEditData(selectedEmployee); // kirim data ke form
          setOpenAction(false);
          setOpenForm(true);
        }}
        onDelete={async () => {
          if (!confirm("Yakin mau hapus?")) return;

          try {
            await deleteEmployee(selectedEmployee.id);

            setOpenAction(false);
            fetchEmployees();
          } catch (err) {
            console.error(err);
            alert("Gagal hapus data");
          }
        }}
      />
    </div>
  );
}
