import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../../../contexts/AuthContext";

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = () => {
    navigate("/tasks"); // balik ke list
  };

  return (
    <div className="p-4">
      <TaskForm onSuccess={handleSuccess} currentUser={user} />
    </div>
  );
}
