// Centralized API configuration with production-safe URL normalization
const DEFAULT_API_BASE = "http://localhost:5000";

const normalizeBaseUrl = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
};

const normalizePath = (path = "") => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

const envApiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const API_BASE = envApiBase || DEFAULT_API_BASE;
export const API_URL = `${API_BASE}/api`;

export const toBackendUrl = (path = "") => `${API_BASE}${normalizePath(path)}`;
export const toApiUrl = (path = "") => `${API_URL}${normalizePath(path)}`;
export const isBackendRelativePath = (path = "") =>
  /^\/(api|public)(\/|$)/.test(path);
