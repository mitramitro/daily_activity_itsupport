import api, { BASE_URL, getImageUrl } from "../../../services/api";

// ============================================
// TASKS
// ============================================

// GET LIST
export const getTasks = (params) => api.get("/tasks", { params });

// GET DETAIL
export const getTaskById = (id) =>
  api.get(`/tasks/${id}`).then((response) => {
    // Tambahkan photo_url ke setiap foto
    const photos = response.data?.data?.photos;
    if (Array.isArray(photos)) {
      response.data.data.photos = photos.map((photo) => ({
        ...photo,
        photo_url: getImageUrl(photo.photo),
      }));
    }
    return response;
  });

// CREATE (JSON)
export const createTask = (data) => api.post("/tasks", data);

// CREATE (dengan foto - multipart)
export const createTaskWithPhoto = (formData) =>
  api.post("/tasks", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// UPDATE
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

// DELETE
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ============================================
// PHOTOS
// ============================================

// Upload foto ke task
export const uploadTaskPhotos = (id, formData) =>
  api.post(`/tasks/${id}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Hapus foto
export const deleteTaskPhoto = (photoId) => api.delete(`/task-photos/${photoId}`);

// ============================================
// EMPLOYEES & OFFICES
// ============================================
export const getEmployees = () => api.get("/employees");
export const getOffices = () => api.get("/offices");

// Re-export getImageUrl agar komponen yang sudah import dari sini tidak perlu ubah
export { getImageUrl };
