import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";

export default function TaskCreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/tasks"); // balik ke list
  };

  return (
    <div className="p-4">
      <TaskForm onSuccess={handleSuccess} />
    </div>
  );
}
