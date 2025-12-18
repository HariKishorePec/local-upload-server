const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

// ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// multer config
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10 GB
});

// upload page

// Serve static files (HTML, CSS, JS) from /static
app.use("/static", express.static(path.join(__dirname, "static")));

// Serve the main page from /static/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// Endpoint to get the uploads folder absolute path
app.get("/upload-folder-path", (req, res) => {
  res.json({ uploadPath: UPLOAD_DIR });
});

// upload endpoint (support multiple files)
app.post("/upload", upload.single("file"), (req, res) => {
  // If multiple files, req.files will be set (from upload.array)
  if (req.files && Array.isArray(req.files)) {
    res.json({
      message: "Upload successful",
      files: req.files.map((f) => ({
        originalName: f.originalname,
        savedAs: f.filename,
        size: f.size,
      })),
    });
  } else if (req.file) {
    res.json({
      message: "Upload successful",
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
    });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

// Also support /upload-multi for array uploads (if needed by client)
app.post("/upload-multi", upload.array("files"), (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  res.json({
    message: "Upload successful",
    files: req.files.map((f) => ({
      originalName: f.originalname,
      savedAs: f.filename,
      size: f.size,
    })),
  });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
