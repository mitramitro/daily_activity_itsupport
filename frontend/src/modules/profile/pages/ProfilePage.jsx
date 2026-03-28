import { useAuth } from "../../../contexts/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    window.location.href = "/login";
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-semibold">{user?.name?.charAt(0)}</div>

          <h2 className="mt-4 font-semibold text-lg">{user?.name}</h2>

          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <button onClick={handleLogout} className="w-full text-gray-600 hover:text-red-500 text-sm">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
