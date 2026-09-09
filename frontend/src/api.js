
const BASE_URL = "http://192.168.28.203:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to load user profile");
    return res.json();
  },

  optimizeBlock: async (formData) => {
    const res = await fetch(`${BASE_URL}/optimize`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Optimization failed");
    }
    return res.json();
  },

  approveBlock: async (approvalData) => {
    const res = await fetch(`${BASE_URL}/blocks/approve`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(approvalData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Approval failed");
    }
    return res.json();
  },

  getWeeklyPlan: async () => {
    const res = await fetch(`${BASE_URL}/weekly-plan`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch weekly plan");
    return res.json();
  },

  getMonthlyPlan: async () => {
    const res = await fetch(`${BASE_URL}/monthly-plan`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch monthly plan");
    return res.json();
  },

  getDashboardStats: async () => {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
    return res.json();
  },

  getNetworkTopology: async () => {
    const res = await fetch(`${BASE_URL}/network`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch network topology");
    return res.json();
  },

  getTrains: async () => {
    const res = await fetch(`${BASE_URL}/trains`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch train positions");
    return res.json();
  }
};
