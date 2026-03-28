import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-center">Login</h2>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>

          <input
            type="email"
            placeholder="email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Button */}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-medium transition disabled:opacity-50">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
