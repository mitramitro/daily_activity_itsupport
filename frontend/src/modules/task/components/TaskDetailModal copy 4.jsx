import { useEffect, useState, useRef } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { updateTask, uploadTaskPhotos, getTaskById, deleteTaskPhoto, getImageUrl } from "../services/TaskService";
import { handleDownloadPhoto } from "../../../utils/download";
import toast from "react-hot-toast";

export default function TaskDetailModal({ task, onClose, onUpdated }) {
  const [localTask, setLocalTask] = useState(task);
  const [status, setStatus] = useState(task.status);
  const [kendala, setKendala] = useState(task.kendala || "");
  const [solusi, setSolusi] = useState(task.solusi || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State untuk modal preview
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Cek platform
  const isNative = Capacitor.isNativePlatform();
  const isMobileWeb = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const showMobileCameraOptions = isNative || isMobileWeb;

  useEffect(() => {
    setLocalTask(task);
    setStatus(task.status);
    setKendala(task.kendala || "");
    setSolusi(task.solusi || "");
  }, [task]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ SIMPAN PERUBAHAN (Status, Kendala, Solusi)
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTask(localTask.id, { status, kendala, solusi });

      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);

      onUpdated?.();
      toast.success("Task berhasil diupdate");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🔥 UPLOAD FOTO LANGSUNG (Via File Input - Web)
  // ============================================
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("photos[]", f));

    try {
      setUploading(true);
      await uploadTaskPhotos(localTask.id, formData);

      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);

      onUpdated?.();
      toast.success(`${files.length} foto berhasil diupload`);

      // Reset input file
      e.target.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // 🔥 AMBIL & UPLOAD FOTO DARI CAMERA (Capacitor)
  // ============================================
  const takePhotoAndUpload = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setUploading(true);

      // Convert dataUrl ke File
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `photo_${Date.now()}.jpeg`, { type: "image/jpeg" });

      // Upload langsung
      const formData = new FormData();
      formData.append("photos[]", file);

      await uploadTaskPhotos(localTask.id, formData);

      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);

      onUpdated?.();
      toast.success("Foto berhasil diupload");
    } catch (err) {
      console.error("Camera error:", err);
      if (err.message !== "User cancelled photos app") {
        toast.error("Gagal mengambil/upload foto");
      }
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // 🔥 AMBIL & UPLOAD FOTO DARI GALLERY (Capacitor)
  // ============================================
  const pickFromGalleryAndUpload = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      setUploading(true);

      // Convert dataUrl ke File
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `gallery_${Date.now()}.jpeg`, { type: "image/jpeg" });

      // Upload langsung
      const formData = new FormData();
      formData.append("photos[]", file);

      await uploadTaskPhotos(localTask.id, formData);

      const res = await getTaskById(localTask.id);
      setLocalTask(res.data.data);

      onUpdated?.();
      toast.success("Foto berhasil diupload");
    } catch (err) {
      console.error("Gallery error:", err);
      if (err.message !== "User cancelled photos app") {
        toast.error("Gagal memilih/upload foto");
      }
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // 🔥 HAPUS FOTO
  // ============================================
  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Hapus foto ini?")) return;

    try {
      await deleteTaskPhoto(photoId);

      setLocalTask((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      }));

      onUpdated?.();
      toast.success("Foto berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal hapus foto");
    }
  };

  // ============================================
  // 🔥 DOWNLOAD FOTO (via browser)
  // ============================================
  // sudah ada di utils/download.js sebagai handleDownloadPhoto, yang otomatis mendeteksi platform dan menggunakan cara terbaik untuk download (link download untuk web, Filesystem API untuk mobile)

  // ============================================
  // 🔥 PREVIEW FOTO (Modal Fullscreen)
  // ============================================
  const openPreview = (images, index) => {
    setPreviewImages(images);
    setCurrentPreviewIndex(index);
    setPreviewImage(images[index]);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewImages([]);
    setCurrentPreviewIndex(0);
  };

  const nextImage = () => {
    if (currentPreviewIndex < previewImages.length - 1) {
      const newIndex = currentPreviewIndex + 1;
      setCurrentPreviewIndex(newIndex);
      setPreviewImage(previewImages[newIndex]);
    }
  };

  const prevImage = () => {
    if (currentPreviewIndex > 0) {
      const newIndex = currentPreviewIndex - 1;
      setCurrentPreviewIndex(newIndex);
      setPreviewImage(previewImages[newIndex]);
    }
  };

  // Download dari modal preview
  const handleDownloadFromPreview = async () => {
    const currentPhoto = localTask.photos[currentPreviewIndex];
    console.log("Download:", currentPhoto); // debug objek
    console.log("Path:", currentPhoto?.photo); // debug path
    if (currentPhoto) {
      await handleDownloadPhoto(currentPhoto.photo);
    }
  };

  if (!localTask) return null;

  // Siapkan array URL foto untuk preview
  const photoUrls = localTask.photos?.map((p) => getImageUrl(p.photo)) || [];

  return (
    <>
      {/* MODAL UTAMA */}
      <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center">
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* modal */}
        <div className="relative bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl flex flex-col max-h-[90vh]">
          {/* HEADER */}
          <div className="flex justify-between items-start p-4 md:p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold">Detail Task</h2>
              <p className="text-xs text-gray-500">
                {localTask.employee?.nama} • {localTask.office?.name}
              </p>
            </div>

            <button onClick={onClose} className="text-gray-400 text-lg hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto flex-1 pb-20">
            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-gray-500">Kategori</p>
                <p className="font-medium">{localTask.kategori}</p>
              </div>

              <div>
                <p className="text-gray-500">Jenis</p>
                <p className="font-medium capitalize">{localTask.jenis_task}</p>
              </div>

              <div>
                <p className="text-gray-500">Tanggal</p>
                <p className="font-medium">{formatDate(localTask.tanggal)}</p>
              </div>
            </div>

            {/* FORM EDIT */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Kendala</label>
                <textarea value={kendala} onChange={(e) => setKendala(e.target.value)} rows="3" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Solusi</label>
                <textarea value={solusi} onChange={(e) => setSolusi(e.target.value)} rows="2" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

            {/* ============================================ */}
            {/* 🔥 FOTO SECTION */}
            {/* ============================================ */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3">Foto</h3>

              {/* UPLOAD BUTTONS - MOBILE VS WEB */}
              <div className="space-y-3 mb-4">
                {showMobileCameraOptions ? (
                  // MOBILE: Tombol Camera & Gallery
                  <div className="flex gap-2">
                    <button type="button" onClick={takePhotoAndUpload} disabled={uploading} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Camera
                    </button>

                    <button type="button" onClick={pickFromGalleryAndUpload} disabled={uploading} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Gallery
                    </button>
                  </div>
                ) : (
                  // WEB: File Input
                  <div>
                    <label className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer w-fit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Upload Foto
                      <input type="file" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" accept="image/*" />
                    </label>
                  </div>
                )}

                {uploading && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengupload...
                  </div>
                )}
              </div>

              {/* THUMBNAIL GRID */}
              {photoUrls.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {localTask.photos.map((p, idx) => {
                    console.log("Raw photo path:", p.photo);
                    const url = getImageUrl(p.photo);
                    console.log("Generated URL:", url);
                    return (
                      <div key={p.id} className="relative group">
                        {/* THUMBNAIL - klik untuk preview */}
                        <img src={url} onClick={() => openPreview(photoUrls, idx)} className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition" alt="task" />

                        {/* DOWNLOAD BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPhoto(p.photo);
                          }}
                          className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-[2px] rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                          title="Download"
                        >
                          ⬇
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(p.id);
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 text-xs rounded-full hover:bg-red-700 transition"
                          title="Hapus"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada foto</p>
              )}
            </div>

            {/* LOG ACTIVITY */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Log Activity</h3>

              {localTask.logs?.length ? (
                <div className="space-y-3">
                  {[...localTask.logs]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((log) => (
                      <div key={log.id} className="flex gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium capitalize">{log.status?.replace("_", " ") || "Update"}</p>
                          <p className="text-xs text-gray-500">{formatDate(log.created_at)}</p>
                          {log.note && <p className="text-xs text-gray-600">{log.note}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Belum ada log</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 🔥 MODAL PREVIEW FULLSCREEN (Dengan Zoom & Download) */}
      {/* ============================================ */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closePreview}>
          {/* Tombol Close */}
          <button onClick={closePreview} className="absolute top-4 right-4 text-white text-2xl z-10 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center">
            ✕
          </button>

          {/* Tombol Download */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadFromPreview();
            }}
            className="absolute top-4 left-4 text-white text-sm z-10 bg-black/50 px-3 py-1.5 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          {/* Tombol Prev */}
          {previewImages.length > 1 && currentPreviewIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 text-white text-3xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ‹
            </button>
          )}

          {/* Tombol Next */}
          {previewImages.length > 1 && currentPreviewIndex < previewImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 text-white text-3xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ›
            </button>
          )}

          {/* Counter */}
          {previewImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentPreviewIndex + 1} / {previewImages.length}
            </div>
          )}

          {/* Image dengan zoom support via css */}
          <img src={previewImage} alt="Preview" className="max-w-[95%] max-h-[95%] object-contain cursor-zoom-in" onClick={(e) => e.stopPropagation()} style={{ touchAction: "pinch-zoom" }} />
        </div>
      )}
    </>
  );
}
