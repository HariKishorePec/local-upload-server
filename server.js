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
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>File Upload</title>
      <link rel="stylesheet" href="/uploads/style.css">
    </head>
    <body>
      <h1>Hari's Server File Upload</h1>
      <div class="container">
        <h2>File Upload</h2>
        <form id="uploadForm">
          <input type="file" name="file" id="fileInput" required />
          <button type="submit">Upload</button>
        </form>
        <div id="progressContainer" style="display:none;margin-top:1.2rem;">
          <div id="progressBar" style="height:18px;width:0;background:#007bff;border-radius:6px;transition:width 0.2s;"></div>
          <div id="progressText" style="margin-top:0.5rem;font-size:0.95rem;"></div>
        </div>
        <div id="resultMsg" style="margin-top:1.2rem;"></div>
      </div>
      <script>
        const form = document.getElementById('uploadForm');
        const fileInput = document.getElementById('fileInput');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const resultMsg = document.getElementById('resultMsg');
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const file = fileInput.files[0];
          if (!file) return;
          const formData = new FormData();
          formData.append('file', file);
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/upload', true);
          progressContainer.style.display = 'block';
          progressBar.style.width = '0';
          progressText.textContent = '';
          resultMsg.textContent = '';
          xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              progressBar.style.width = percent + '%';
              progressText.textContent = percent + '%';
            }
          };
          xhr.onload = function() {
            if (xhr.status === 200) {
              progressBar.style.width = '100%';
              progressText.textContent = '100%';
              try {
                const res = JSON.parse(xhr.responseText);
                resultMsg.textContent = res.message || 'Upload successful!';
                resultMsg.style.color = '#28a745';
              } catch {
                resultMsg.textContent = 'Upload successful!';
                resultMsg.style.color = '#28a745';
              }
            } else {
              resultMsg.textContent = 'Upload failed!';
              resultMsg.style.color = '#dc3545';
            }
          };
          xhr.onerror = function() {
            resultMsg.textContent = 'Upload failed!';
            resultMsg.style.color = '#dc3545';
          };
          xhr.send(formData);
        });
      </script>
    </body>
    </html>
  `);
  // Serve static files from uploads (for style.css)
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
