const express = require('express');
const router = express.Router();

const {
  uploadPdf,
  uploadAndProcessPdf,
  getPdfDocument,
  getPageText,
  getPdfDocuments,
  deletePdfDocument,
} = require('../controllers/pdfController');

router.post('/upload', uploadPdf);

router.post('/process', uploadAndProcessPdf);

router.get('/documents', getPdfDocuments);

router.get('/:documentId', getPdfDocument);

router.get('/:documentId/page/:pageNumber', getPageText);

router.delete('/:documentId', deletePdfDocument);

router.delete('/admin/nuke', async (req, res) => {
  const PDFDocument = require('../models/PDFDocument.js');
  try {
    const result = await PDFDocument.deleteMany({});
    res.json({ success: true, deleted: result.deletedCount });
  } catch (e) {
    console.error('Error nuking PDFs:', e);
    res.status(500).json({ success: false, error: 'Failed to delete PDFs' });
  }
});

module.exports = router;
