import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

const setToken = (token) => {
  if (token)
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete client.defaults.headers.common["Authorization"];
};

export default {
  client,
  setToken,
  register: (payload) => client.post("/api/auth/register", payload),
  login: (payload) => client.post("/api/auth/login", payload),
  getTasks: () => client.get("/api/tasks"),
  getTask: (id) => client.get(`/api/tasks/${id}`),
  createTask: (payload) => client.post("/api/tasks", payload),
  updateTask: (id, payload) => client.put(`/api/tasks/${id}`, payload),
  deleteTask: (id) => client.delete(`/api/tasks/${id}`),
  getNotifications: () => client.get("/api/notifications"),
  markNotificationRead: (id) => client.put(`/api/notifications/${id}/read`),
};
