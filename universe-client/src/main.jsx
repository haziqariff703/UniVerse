import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { isBackendRelativePath, toBackendUrl } from "./config/api";

const normalizeBackendRequestUrl = (rawUrl) => {
  if (typeof rawUrl !== "string") return rawUrl;

  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (
      parsed.origin === window.location.origin &&
      isBackendRelativePath(parsed.pathname)
    ) {
      return toBackendUrl(`${parsed.pathname}${parsed.search}${parsed.hash}`);
    }
  } catch {
    return rawUrl;
  }

  return rawUrl;
};

const installFetchBaseUrlPatch = () => {
  if (typeof window === "undefined" || window.__universeFetchPatched__) return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (input instanceof Request) {
      const normalizedUrl = normalizeBackendRequestUrl(input.url);
      if (normalizedUrl !== input.url) {
        return originalFetch(new Request(normalizedUrl, input), init);
      }
      return originalFetch(input, init);
    }

    if (typeof input === "string") {
      return originalFetch(normalizeBackendRequestUrl(input), init);
    }

    if (input instanceof URL) {
      return originalFetch(normalizeBackendRequestUrl(input.toString()), init);
    }

    return originalFetch(input, init);
  };

  window.__universeFetchPatched__ = true;
};

installFetchBaseUrlPatch();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
