const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabaseStorage = require("../utils/supabaseStorage");

// --- LOCAL STORAGE ENGINE (Fallback) ---
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public/uploads/assets");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created missing directory: ${dir}`);
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
// Priority: 1. Supabase, 2. Local Disk
const isSupabaseConfigured = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

let selectedStorage;
if (isSupabaseConfigured) {
  selectedStorage = supabaseStorage();
  console.log("Supabase Storage initialized for uploads.");
} else {
  selectedStorage = diskStorage;
  console.log("Local Disk Storage initialized for uploads (Supabase missing).");
}

// Check file type
function checkFileType(file, cb) {
  const isImage = typeof file.mimetype === "string" && file.mimetype.startsWith("image/");
  const isPdf = file.mimetype === "application/pdf";

  if (isImage || isPdf) {
    return cb(null, true);
  }

  const err = new Error("Unsupported file type. Only image/* and application/pdf are allowed.");
  err.statusCode = 400;
  cb(err);
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
