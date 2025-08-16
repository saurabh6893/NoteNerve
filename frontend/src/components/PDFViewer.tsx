import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface PDFViewerProps {
  filePath: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages: nextNum }: { numPages: number }) => {
    setNumPages(nextNum);
    setLoadError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setLoadError('Failed to load PDF');
  };

  // CRITICAL FIX: Construct full URL to backend
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const fullPdfUrl = filePath.startsWith('http') ? filePath : `${API_BASE}${filePath}`;

  return (
    <div className="border rounded p-4 h-[80vh] overflow-auto">
      {loadError && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-2">
          {loadError} - Check console for details
        </div>
      )}

      <Document
        file={fullPdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<p className="text-gray-500">Loading PDF…</p>}
        error={<p className="text-red-500">Failed to load PDF</p>}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={Math.min(2, (window.devicePixelRatio || 1) * 1.25)}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading=""
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
