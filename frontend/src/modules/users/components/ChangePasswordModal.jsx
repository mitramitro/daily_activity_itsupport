import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Password tidak sama");
      toast.error("Password tidak sama");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await onSubmit({
        password,
        password_confirmation: confirm,
      });

      // ✅ sukses
      toast.success("Password berhasil diubah");

      // reset form
      setPassword("");
      setConfirm("");
      onClose();
    } catch (err) {
      console.error(err);

      // ❌ error dari backend
      const message = err?.response?.data?.message || "Gagal mengubah password";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 animate-fadeIn">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Ganti Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition
            "
          />

          {/* Confirm */}
          <input
            type="password"
            placeholder="Konfirmasi password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="
              w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition
            "
          />

          {/* Error text kecil */}
          {error && <p className="text-sm text-red-500 -mt-2">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !password || !confirm}
            className="
              w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl
              text-sm font-medium transition disabled:opacity-50
            "
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>

        {/* Cancel */}
        <button onClick={onClose} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition">
          Batal
        </button>
      </div>
    </div>
  );
}
