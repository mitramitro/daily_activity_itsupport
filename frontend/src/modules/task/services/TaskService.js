import api from "../../../services/api";

// GET LIST
export const getTasks = (params) => {
  return api.get("/tasks", { params });
};

// GET DETAIL
export const getTaskById = (id) => {
  return api.get(`/tasks/${id}`);
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

// 🔹 ambil employee
export const getEmployees = () => {
  return api.get("/employees");
};

// 🔹 ambil office
export const getOffices = () => {
  return api.get("/offices");
};
