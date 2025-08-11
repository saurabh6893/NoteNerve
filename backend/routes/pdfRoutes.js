const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../controllers/pdfController');

router.post('/upload', uploadPdf);

module.exports = router;
