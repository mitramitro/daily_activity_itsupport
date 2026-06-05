import { downloadFromUrl } from "./downloadUrl";
import toast from "react-hot-toast";

export const handleDownloadPhoto = async (photoPath) => {
  try {
    const rawName = photoPath.split("/").pop();
    const filename = rawName || `foto_${Date.now()}.jpg`;
    const url = `/tasks/photo/download/${filename}`;
    await downloadFromUrl(url);
    toast.success("Download foto berhasil");
  } catch (err) {
    console.error("Download error:", err);
    toast.error("Gagal download foto");
  }
};
