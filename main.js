const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware untuk mengaktifkan fitur upload file
app.use(fileUpload());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Endpoint untuk mengunggah file ZIP
app.post('/upload', (req, res) => {
  // Debugging statement to log req.files
  console.log('Files:', req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
}


  // Since req.files contains an additional name property, we need to access the actual file object correctly
  const uploadedFile = req.files.name;

  // Menentukan lokasi tempat menyimpan file ZIP
  const filePath = path.join(uploadDir, uploadedFile.name);

  // Memindahkan file ZIP ke folder 'uploads'
  uploadedFile.mv(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal mengunggah file.', error: err });
    }
    res.json({ message: 'File berhasil diunggah.', filePath: filePath });
  });
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
