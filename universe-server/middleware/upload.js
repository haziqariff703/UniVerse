const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- BULLETPROOF STORAGE ENGINE ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1. Define the target folder (public/uploads/assets)
    const dir = path.join(process.cwd(), "public/uploads/assets");

    // 2. CHECK & CREATE: If it doesn't exist, make it!
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📂 Created missing directory: ${dir}`);
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 3. Rename file to avoid conflicts (userId + timestamp + extension)
    const userId = req.user ? req.user.id : "anonymous";
    const uniqueName = `${userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext - images and documents
  const filetypes = /jpeg|jpg|png|gif|pdf|webp|doc|docx|txt/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime - support images and documents
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const mimetype = allowedMimes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Unsupported file type! Allowed: images, PDF, Word, TXT"));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
