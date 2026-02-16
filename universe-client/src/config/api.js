// Centralized API configuration
// Reads from environment variable on Vercel, falls back to localhost for dev
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_URL = `${API_BASE}/api`;
