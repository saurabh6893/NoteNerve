const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  totalPages: { type: Number, required: true },
  extractedText: { type: String, required: true },
  pageTexts: [{ type: String }],
  sessionId: { type: String, default: 'default' },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PDFDocument', pdfSchema);
