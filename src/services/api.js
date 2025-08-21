// Simple fetch wrapper for json-server (http://localhost:5000)
const API_URL = "http://127.0.0.1:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: (resource, qs = "") => request(`/${resource}${qs}`),
  getById: (resource, id) => request(`/${resource}/${id}`),
  create: (resource, data) =>
    request(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: (resource, id, data) =>
    request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (resource, id) =>
    request(`/${resource}/${id}`, { method: "DELETE" }),
};

// Demo auth via json-server (NOT secure—only for local assessment)
export const authApi = {
  async login(email, password) {
    const users = await api.get("users", `?email=${encodeURIComponent(email)}`);
    const user = users.find((u) => u.password === password);
    if (!user) throw new Error("Invalid email or password");
    return user;
  },
  async register(email, password) {
    const existing = await api.get("users", `?email=${encodeURIComponent(email)}`);
    if (existing.length) throw new Error("User already exists");
    return api.create("users", { email, password, role: "customer" });
  },
};
