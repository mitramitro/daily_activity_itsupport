import api from "../../../services/api";

export const getUsers = (params) => {
  return api.get("/users", {
    params,
  });
};

export const createUser = (data) => {
  return api.post("/users", data);
};

export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
export const updateUserPassword = (id, data) => {
  return api.put(`/users/${id}/password`, data);
};
