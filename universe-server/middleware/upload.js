const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { cloudinaryStorage } = require("../config/cloudinary");

// --- LOCAL STORAGE ENGINE (Fallback) ---
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public/uploads/assets");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📂 Created missing directory: ${dir}`);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : "anonymous";
    const uniqueName = `${userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// --- DYNAMIC STORAGE SELECTION ---
// If Cloudinary credentials are missing, we fallback to Local Disk
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

const selectedStorage = isCloudinaryConfigured ? cloudinaryStorage : diskStorage;

if (isCloudinaryConfigured) {
  console.log("☁️  Cloudinary Storage initialized for uploads.");
} else {
  console.log("📁 Local Disk Storage initialized for uploads (Cloudinary missing).");
}

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|pdf|webp|doc|docx|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
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
  storage: selectedStorage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
