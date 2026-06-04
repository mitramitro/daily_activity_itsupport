import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import api from "../../../services/api";
import { getLastUserEmail, getFingerprintToken, getDeviceId } from "../../../services/storage";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, loginWithFingerprint } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk fingerprint
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [fingerprintLoading, setFingerprintLoading] = useState(false);

  // Cek fingerprint availability dan status user
  useEffect(() => {
    checkFingerprintAvailability();
    checkLastUserFingerprintStatus();
  }, []);

  // Cek apakah device support biometric
  const checkFingerprintAvailability = async () => {
    try {
      const result = await BiometricAuth.checkBiometry();
      setFingerprintAvailable(result.isAvailable);
    } catch (error) {
      console.error("Biometric check failed:", error);
      setFingerprintAvailable(false);
    }
  };

  // Cek apakah user terakhir login sudah enable fingerprint
  const checkLastUserFingerprintStatus = async () => {
    const lastUserEmail = await getLastUserEmail();

    if (!lastUserEmail) {
      return;
    }

    try {
      const response = await api.post("/auth/check-fingerprint-user", {
        email: lastUserEmail,
      });

      setFingerprintEnabled(response.data.fingerprint_enabled);

      // Auto set email jika user terakhir ada
      if (response.data.fingerprint_enabled) {
        setEmail(lastUserEmail);
      }
    } catch (error) {
      console.error("Error checking fingerprint status:", error);
      setFingerprintEnabled(false);
    }
  };

  // Login dengan fingerprint
  const handleFingerprintLogin = async () => {
    setFingerprintLoading(true);
    setError("");

    try {
      // Authenticate dengan biometric device
      await BiometricAuth.authenticate({
        reason: "Verifikasi identitas untuk login ke ITApp",
        cancelTitle: "Batal",
        allowDeviceCredential: true,
        iosFallbackTitle: "Gunakan Passcode",
        androidTitle: "Login dengan Fingerprint",
        androidSubtitle: "Tempelkan jari Anda ke sensor fingerprint",
        androidMaxAttempts: 5,
      });

      // Ambil deviceId dan fingerprintToken dari storage
      const deviceId = await getDeviceId();
      const fingerprintToken = await getFingerprintToken();

      if (!deviceId || !fingerprintToken) {
        toast.error("Fingerprint belum diatur, silakan aktifkan di menu Profile");
        setFingerprintEnabled(false);
        return;
      }

      // Login dengan fingerprint via AuthContext
      await loginWithFingerprint(fingerprintToken, deviceId);

      // Navigate ke dashboard
      navigate("/");
    } catch (error) {
      console.error("Fingerprint login error:", error);

      if (error.code === "ERR_CANCELED") {
        // User membatalkan biometric prompt, tidak perlu error
        setError("");
      } else {
        setError(error.response?.data?.error || "Login dengan fingerprint gagal, silahkan login dengan email dan password");
      }
    } finally {
      setFingerprintLoading(false);
    }
  };

  // Login dengan email dan password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-center">Login</h2>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      {/* Tombol Login dengan Fingerprint */}
      {fingerprintAvailable && fingerprintEnabled && (
        <>
          <button
            onClick={handleFingerprintLogin}
            disabled={fingerprintLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-xl font-medium transition disabled:opacity-50 mb-4 flex items-center justify-center gap-2"
          >
            {fingerprintLoading ? (
              "Memverifikasi..."
            ) : (
              <>
                <span className="text-xl">🔐</span>
                Login dengan Fingerprint
              </>
            )}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>
        </>
      )}

      {/* Form Login dengan Email/Password */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading || fingerprintLoading}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading || fingerprintLoading}
          />
        </div>

        <button type="submit" disabled={loading || fingerprintLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-medium transition disabled:opacity-50">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
