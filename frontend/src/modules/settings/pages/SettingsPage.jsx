import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, fingerprintEnabled, enableFingerprint, disableFingerprint, generateFingerprintToken, generateDeviceId } = useAuth();
  const navigate = useNavigate();

  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

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

  const handleEnableFingerprint = async () => {
    if (!password) {
      toast.error("Masukkan password Anda");
      return;
    }

    setLoading(true);

    try {
      await BiometricAuth.authenticate({
        reason: "Verifikasi fingerprint untuk mengaktifkan login fingerprint",
        cancelTitle: "Batal",
        allowDeviceCredential: true,
        androidTitle: "Aktifkan Fingerprint",
        androidSubtitle: "Tempelkan jari Anda ke sensor fingerprint",
      });

      const fingerprintToken = await generateFingerprintToken();
      const deviceId = await generateDeviceId();

      await enableFingerprint(password, fingerprintToken, deviceId);

      setShowPasswordModal(false);
      setPassword("");
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        toast.error("Verifikasi fingerprint dibatalkan");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisableFingerprint = async () => {
    if (!confirm("Apakah Anda yakin ingin menonaktifkan login dengan fingerprint?")) {
      return;
    }

    setLoading(true);
    await disableFingerprint();
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Pengaturan</h1>
        <p className="text-sm text-gray-500">Kelola pengaturan akun Anda</p>
      </div>

      {/* Keamanan */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold mb-4">Keamanan</h2>

        {fingerprintAvailable && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h3 className="font-medium text-sm">Login dengan Fingerprint</h3>
                <p className="text-xs text-gray-500">
                  {fingerprintEnabled
                    ? "Aktif - Login cepat dengan fingerprint"
                    : "Nonaktif - Aktifkan untuk login lebih cepat"}
                </p>
              </div>
            </div>

            <button
              onClick={fingerprintEnabled ? handleDisableFingerprint : () => setShowPasswordModal(true)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                fingerprintEnabled
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              } disabled:opacity-50`}
            >
              {loading ? "Memproses..." : fingerprintEnabled ? "Nonaktifkan" : "Aktifkan"}
            </button>
          </div>
        )}

        {!fingerprintAvailable && (
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-medium text-sm">Login dengan Fingerprint</h3>
              <p className="text-xs">Device Anda tidak mendukung fingerprint</p>
            </div>
          </div>
        )}
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
