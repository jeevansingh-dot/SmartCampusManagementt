const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload directory ensure karein
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer instance create karein
const upload = multer({ storage });

// Direct export (Crucial for router.post)
module.exports = upload;