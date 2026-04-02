import api from "../../../services/api";
export const exportTasks = (params) => {
  return api.get("/reports/tasks/export", {
    params,
    responseType: "blob",
  });
};

// export const exportTasks = (params) => {
//   const token = localStorage.getItem("token");

//   return api.get("/reports/tasks/export", {
//     params,
//     responseType: "blob",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
