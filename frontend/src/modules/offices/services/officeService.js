import api from "../../../services/api";

export const getOffices = (params) => {
  return api.get("/offices", { params });
};

export const createOffice = (data) => {
  return api.post("/offices", data);
};

export const getOffice = (id) => {
  return api.get(`/offices/${id}`);
};

export const updateOffice = (id, data) => {
  return api.put(`/offices/${id}`, data);
};

export const deleteOffice = (id) => {
  return api.delete(`/offices/${id}`);
};
