import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const fetchJob = (url) => {
  return api.post("/scrape", {
    url,
  });
};

export const saveApplication = (data) => {
  return api.post("/applications", data);
};

export const fetchApplications = ({ page = 1, limit = 12, search = "" } = {}) => {
  return api.get("/applications", { params: { page, limit, search } });
};

export const updateApplication = (id, data) => {
  return api.put(`/applications/${id}`, data);
};

export const deleteApplication = (id) => {
  return api.delete(`/applications/${id}`);
};

export default api;
