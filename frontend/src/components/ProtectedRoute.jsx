import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // cek role
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
