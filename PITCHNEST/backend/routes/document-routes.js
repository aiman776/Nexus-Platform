const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  toggleShare,
  downloadDocument,
} = require('../controllers/document_controller');

// ✅ Uploads folder ensure karo
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup - absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ Fix
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

router.post('/upload', authMiddleware, upload.single('document'), uploadDocument);
router.get('/my-documents', authMiddleware, getMyDocuments);
router.delete('/:id', authMiddleware, deleteDocument);
router.put('/share/:id', authMiddleware, toggleShare);
router.get('/download/:id', authMiddleware, downloadDocument);

module.exports = router;