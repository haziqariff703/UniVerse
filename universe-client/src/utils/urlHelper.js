export const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  
  // Clean up leading slashes to avoid double slashes when prepending /public
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  let finalUrl = `/public/${cleanUrl}`;

  // Fix any double slash issues in URLs
  finalUrl = finalUrl.replace(/([^:])\/\//g, "$1/");
  
  return finalUrl;
};

export const resolveApiUrl = (uri) => {
    if (!uri) return "";
    if (uri.startsWith("http")) return uri;
    const cleanUri = uri.startsWith("/") ? uri.slice(1) : uri;
    return `/api/${cleanUri}`;
};
