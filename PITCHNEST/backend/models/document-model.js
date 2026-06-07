const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shared: { type: Boolean, default: false },
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;