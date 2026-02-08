const path = require("path");

/**
 * Resolves a file path to a public-facing URL or absolute path.
 * Handles local disk storage and Supabase URLs.
 * 
 * @param {Object} file - The file object from multer (req.file or req.files[i])
 * @returns {string} - The resolved path/URL to be saved in the database
 */
const resolveFilePath = (file) => {
  if (!file) return "";

  // Supabase or any cloud storage sets file.path to the full URL
  if (file.path && (file.path.startsWith("http://") || file.path.startsWith("https://"))) {
    return file.path;
  }

  // Fallback for local disk storage: convert absolute filesystem path to relative public URL
  try {
    const relativePath = path.relative(process.cwd(), file.path).replace(/\\/g, "/");
    return "/" + relativePath;
  } catch (error) {
    console.error("Error resolving local file path:", error);
    return "";
  }
};

module.exports = { resolveFilePath };
