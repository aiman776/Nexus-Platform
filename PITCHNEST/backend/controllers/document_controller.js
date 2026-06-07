const Document = require('../models/document-model');
const path = require('path');
const fs = require('fs');

// ✅ Upload document
const uploadDocument = async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("User:", req.user?._id);

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const doc = new Document({
      name: req.file.originalname,
      originalName: req.file.originalname,
      type: path.extname(req.file.originalname).replace('.', '').toUpperCase(),
      size: sizeInMB,
      path: req.file.path,
      uploadedBy: req.user._id,
    });

    await doc.save();
    res.status(201).json({ msg: 'Document uploaded successfully', document: doc });

  } catch (error) {
    // ✅ next() mat use karo - seedha response do
    console.error('Upload error:', error.message);
    return res.status(500).json({ msg: error.message });
  }
};

// ✅ Get my documents
const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Delete document
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    // ✅ File bhi delete karo
    if (fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }

    await Document.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Toggle share
const toggleShare = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    doc.shared = !doc.shared;
    await doc.save();

    res.status(200).json({ msg: 'Document updated', document: doc });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Download document
const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    res.download(doc.path, doc.originalName);
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  toggleShare,
  downloadDocument,
};