import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface PDFViewerProps {
  filePath: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath }) => {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages: nextNum }: { numPages: number }) => {
    setNumPages(nextNum);
  };

  return (
    <div className="border rounded p-4 h-[80vh] overflow-auto">
      <Document
        file={filePath}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p className="text-gray-500">Loading PDF…</p>}
      >
        {Array.from({ length: numPages }, (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={Math.min(2, (window.devicePixelRatio || 1) * 1.25)}
            renderTextLayer
            renderAnnotationLayer={false}
            loading=""
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
