import api from "../../../services/api";

// 🔥 GET LIST BARANG
export const getBarang = (params) => {
  return api.get("/barang", {
    params,
  });
};

// 🔥 CREATE
export const createBarang = (data) => {
  return api.post("/barang", data);
};

// 🔥 UPDATE
export const updateBarang = (id, data) => {
  return api.put(`/barang/${id}`, data);
};

// 🔥 DELETE
export const deleteBarang = (id) => {
  return api.delete(`/barang/${id}`);
};
