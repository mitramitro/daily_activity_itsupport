import { downloadFromUrl } from "../../../utils/downloadUrl";

export const exportTasks = async (params) => {
  await downloadFromUrl("/reports/tasks/export", params);
};

export const exportInventory = async (params) => {
  await downloadFromUrl("/reports/inventory/export", params);
};
