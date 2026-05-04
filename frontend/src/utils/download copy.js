import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { getImageUrl } from "../services/api";

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });
};

export const handleDownloadPhoto = async (photoPath) => {
  try {
    const url = getImageUrl(photoPath);
    const filename = photoPath.split("/").pop() || `foto_${Date.now()}.jpg`;

    const isNative = Capacitor.isNativePlatform();

    // 🌐 WEB (cross-domain safe)
    if (!isNative) {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
      return;
    }

    // 📱 MOBILE VERSION (Capacitor)
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
    });

    alert("File berhasil disimpan di perangkat");
  } catch (err) {
    console.error("Download error:", err);
    alert("Gagal download foto");
  }
};
