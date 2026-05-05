import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { BASE_URL, downloadBlob } from "../services/api";

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });

export const handleDownloadPhoto = async (photoPath) => {
  try {
    const rawName = photoPath.split("/").pop();
    const filename = rawName || `foto_${Date.now()}.jpg`;
    const extension = filename.split(".").pop();

    // ✅ Lewat API route (bawa token + CORS aman), bukan /storage langsung
    const downloadName = `foto_task_${Date.now()}.${extension}`;
    const url = `${BASE_URL}/api/tasks/photo/download/${filename}`;
    const blob = await downloadBlob(url);

    if (Capacitor.isNativePlatform()) {
      const base64 = await blobToBase64(blob);
      await Filesystem.writeFile({
        path: downloadName,
        data: base64,
        directory: Directory.Documents,
      });
      alert(`File disimpan: ${downloadName}`);
    } else {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.error("Download error:", err);
    alert("Gagal download foto");
  }
};
