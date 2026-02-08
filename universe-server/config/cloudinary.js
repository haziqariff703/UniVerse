const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary Storage for Multer
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "universe-uploads", // Target folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    // Documents like PDF might require different handling depending on Cloudinary settings
    resource_type: "auto", 
  },
});

module.exports = { cloudinary, cloudinaryStorage };
