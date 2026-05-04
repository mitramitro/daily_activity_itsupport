import api, { BASE_URL } from "../../../services/api";

// ============================================
// 🔥 HELPER: Get full image URL
// ============================================
export const getImageUrl = (path) => {
  if (!path) return null;

  // Jika sudah URL lengkap, return langsung
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Hapus leading slash jika ada
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Bangun URL lengkap
  return `${BASE_URL}/storage/${cleanPath}`;
};

// GET LIST
export const getTasks = (params) => {
  return api.get("/tasks", { params });
};

// GET DETAIL - dengan transformasi foto
export const getTaskById = (id) => {
  return api.get(`/tasks/${id}`).then((response) => {
    // 🔥 Transform data photos agar memiliki URL lengkap
    if (response.data?.data?.photos && Array.isArray(response.data.data.photos)) {
      response.data.data.photos = response.data.data.photos.map((photo) => ({
        ...photo,
        photo_url: getImageUrl(photo.photo), // Tambahkan URL lengkap
      }));
    }
    return response;
  });
};

// CREATE (tanpa foto - JSON)
export const createTask = (data) => {
  return api.post("/tasks", data);
};

// CREATE (dengan foto - multipart)
export const createTaskWithPhoto = (formData) => {
  return api.post("/tasks", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// download foto
export const downloadTaskPhoto = (filename) => {
  // Hanya ambil nama file, bersihkan dari path
  const cleanFilename = filename.split("/").pop();
  return `${BASE_URL}/api/tasks/photo/download/${cleanFilename}`;
};

// upload foto
export const uploadTaskPhotos = (id, formData) => {
  return api.post(`/tasks/${id}/photos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteTaskPhoto = (photoId) => {
  return api.delete(`/task-photos/${photoId}`);
};

// UPDATE
export const updateTask = (id, data) => {
  return api.put(`/tasks/${id}`, data);
};

// DELETE
export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

// ambil employee
export const getEmployees = () => {
  return api.get("/employees");
};

// ambil office
export const getOffices = () => {
  return api.get("/offices");
};
