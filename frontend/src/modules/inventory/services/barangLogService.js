import api from "../../../services/api";

// 🔥 GET LIST
export const getBarangLogs = (params) => {
  return api.get("/barang-logs", {
    params,
  });
};

// 🔥 CREATE TRANSAKSI
export const createBarangLog = (data) => {
  return api.post("/barang-logs", data);
};

// 🔥 DELETE
export const deleteBarangLog = (id) => {
  return api.delete(`/barang-logs/${id}`);
};
