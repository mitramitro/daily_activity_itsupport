import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout, fingerprintEnabled, enableFingerprint, disableFingerprint, generateFingerprintToken, generateDeviceId } = useAuth();

  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  // Cek apakah device support biometric
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const result = await BiometricAuth.checkBiometry();
      setFingerprintAvailable(result.isAvailable);
    } catch (error) {
      console.error("Biometric check failed:", error);
      setFingerprintAvailable(false);
    }
  };

  // Handle enable fingerprint
  const handleEnableFingerprint = async () => {
    if (!password) {
      toast.error("Masukkan password Anda");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Authenticate with biometric
      await BiometricAuth.authenticate({
        reason: "Verifikasi fingerprint untuk mengaktifkan login fingerprint",
        cancelTitle: "Batal",
        allowDeviceCredential: true,
        androidTitle: "Aktifkan Fingerprint",
        androidSubtitle: "Tempelkan jari Anda ke sensor fingerprint",
      });

      // Step 2: Generate token dan device ID
      const fingerprintToken = await generateFingerprintToken();
      const deviceId = await generateDeviceId();

      // Step 3: Enable fingerprint via AuthContext
      await enableFingerprint(password, fingerprintToken, deviceId);

      setShowPasswordModal(false);
      setPassword("");
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        toast.error("Verifikasi fingerprint dibatalkan");
      }
      // Error handling sudah ada di enableFingerprint
    } finally {
      setLoading(false);
    }
  };

  // Handle disable fingerprint
  const handleDisableFingerprint = async () => {
    if (!confirm("Apakah Anda yakin ingin menonaktifkan login dengan fingerprint?")) {
      return;
    }

    setLoading(true);
    await disableFingerprint();
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Profile Section */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-semibold">{user?.name?.charAt(0)}</div>
          <h2 className="mt-4 font-semibold text-lg">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Fingerprint Settings Section */}
        {fingerprintAvailable && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h3 className="font-medium text-sm">Login dengan Fingerprint</h3>
                  <p className="text-xs text-gray-500">{fingerprintEnabled ? "Aktif - Login cepat dengan fingerprint" : "Nonaktif - Aktifkan untuk login lebih cepat"}</p>
                </div>
              </div>

              <button
                onClick={fingerprintEnabled ? handleDisableFingerprint : () => setShowPasswordModal(true)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${fingerprintEnabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"} disabled:opacity-50`}
              >
                {loading ? "Memproses..." : fingerprintEnabled ? "Nonaktifkan" : "Aktifkan"}
              </button>
            </div>
          </div>
        )}

        {/* Info jika device tidak support fingerprint */}
        {!fingerprintAvailable && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-medium text-sm">Login dengan Fingerprint</h3>
                <p className="text-xs">Device Anda tidak mendukung fingerprint</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-6 border-t pt-4">
          <button onClick={handleLogout} className="w-full text-gray-600 hover:text-red-500 text-sm py-2 transition">
            Logout
          </button>
        </div>
      </div>

      {/* Modal Password Confirmation */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi Password</h3>
            <p className="text-sm text-gray-600 mb-4">Masukkan password Anda untuk mengaktifkan login dengan fingerprint</p>

            <input
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button onClick={handleEnableFingerprint} disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? "Memproses..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
