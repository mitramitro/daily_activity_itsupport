import { getToken } from "../services/storage";
import { BASE_URL } from "../services/api";

export const downloadFromUrl = async (path, params = {}) => {
  const token = await getToken();
  const query = new URLSearchParams(params).toString();
  const fullUrl = `${BASE_URL}/api${path}?token=${token}${query ? `&${query}` : ""}`;
  const a = document.createElement("a");
  a.href = fullUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
