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

module.exports = router;
