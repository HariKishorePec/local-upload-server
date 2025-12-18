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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// upload page
app.get("/", (req, res) => {
  res.send(`
    <h2>File Upload</h2>
    <form method="POST" enctype="multipart/form-data" action="/upload">
      <input type="file" name="file" required />
      <br/><br/>
      <button type="submit">Upload</button>
    </form>
  `);
});

// upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "Upload successful",
    originalName: req.file.originalname,
    savedAs: req.file.filename,
    size: req.file.size,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
