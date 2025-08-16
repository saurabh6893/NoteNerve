const path = require('path');
const fs = require('fs');
const { extractTextFromPDF } = require('../services/pdfService');
const PDFDocument = require('../models/PDFDocument');

const multer = require('multer');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

const uploadAndProcessPdf = [
  upload.single('pdf'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file uploaded',
      });
    }

    try {
      console.log(`Processing PDF: ${req.file.originalname}`);

      const extractedData = await extractTextFromPDF(req.file.path);

      const pdfDoc = new PDFDocument({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        totalPages: extractedData.totalPages,
        extractedText: extractedData.fullText,
        pageTexts: extractedData.pageTexts,
        sessionId: req.body.sessionId || 'default',
        fileSize: req.file.size,
      });

      await pdfDoc.save();

      console.log(`PDF processed successfully: ${extractedData.totalPages} pages extracted`);

      res.json({
        success: true,
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        documentId: pdfDoc._id,
        totalPages: extractedData.totalPages,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        message: 'PDF uploaded and processed successfully',
      });
    } catch (error) {
      console.error('PDF processing error:', error);

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        error: 'Failed to process PDF. Please ensure the file is a valid PDF document.',
      });
    }
  },
];

const getPdfDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const pdfDoc = await PDFDocument.findById(documentId);
    if (!pdfDoc) {
      return res.status(404).json({
        success: false,
        error: 'PDF document not found',
      });
    }

    res.json({
      success: true,
      document: {
        id: pdfDoc._id,
        originalName: pdfDoc.originalName,
        filename: pdfDoc.filename,
        totalPages: pdfDoc.totalPages,
        fileSize: pdfDoc.fileSize,
        uploadedAt: pdfDoc.uploadedAt,
        path: `/uploads/${pdfDoc.filename}`,
      },
    });
  } catch (error) {
    console.error('Error fetching PDF document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch PDF document',
    });
  }
};

const getPageText = async (req, res) => {
  try {
    const { documentId, pageNumber } = req.params;
    const pageNum = parseInt(pageNumber);

    const pdfDoc = await PDFDocument.findById(documentId);
    if (!pdfDoc) {
      return res.status(404).json({
        success: false,
        error: 'PDF document not found',
      });
    }

    if (pageNum < 1 || pageNum > pdfDoc.pageTexts.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page number',
      });
    }

    res.json({
      success: true,
      pageNumber: pageNum,
      text: pdfDoc.pageTexts[pageNum - 1] || '',
      totalPages: pdfDoc.totalPages,
    });
  } catch (error) {
    console.error('Error fetching page text:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page text',
    });
  }
};

const getPdfDocuments = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;

    const documents = await PDFDocument.find({ sessionId })
      .select('_id originalName filename totalPages fileSize uploadedAt')
      .sort({ uploadedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc._id,
        originalName: doc.originalName,
        filename: doc.filename,
        totalPages: doc.totalPages,
        fileSize: doc.fileSize,
        uploadedAt: doc.uploadedAt,
        path: `/uploads/${doc.filename}`,
      })),
    });
  } catch (error) {
    console.error('Error fetching PDF documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch PDF documents',
    });
  }
};

const deletePdfDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const pdfDoc = await PDFDocument.findById(documentId);
    if (!pdfDoc) {
      return res.status(404).json({
        success: false,
        error: 'PDF document not found',
      });
    }

    if (fs.existsSync(pdfDoc.filePath)) {
      fs.unlinkSync(pdfDoc.filePath);
    }

    await PDFDocument.findByIdAndDelete(documentId);

    res.json({
      success: true,
      message: 'PDF document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting PDF document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete PDF document',
    });
  }
};

const uploadPdf = [
  upload.single('pdf'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    res.json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });
  },
];

module.exports = {
  uploadPdf,
  uploadAndProcessPdf,
  getPdfDocument,
  getPageText,
  getPdfDocuments,
  deletePdfDocument,
};
