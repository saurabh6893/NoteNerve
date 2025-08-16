import { useEffect, useState } from 'react';
import { getBackendHealth } from './api';
import ChatInterface from './components/ChatInterface';
import PDFUpload from './components/PDFUpload';
import PDFViewer from './components/PDFViewer';

const App = () => {
  const [message, setMessage] = useState('');
  const [pdfPath, setPdfPath] = useState<string>('');
  useEffect(() => {
    getBackendHealth().then(setMessage);
  }, []);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const handleUploadSuccess = (path: string) => {
    const fullPath = path.startsWith('/uploads/') ? API_BASE + path : path;
    setPdfPath(fullPath);
  };

  return (
    <div>
      <h1>PDF NotebookLM Clone (Frontend)</h1>
      <p>Backend health: {message}</p>
      <PDFUpload onUploadSuccess={handleUploadSuccess} />
      {pdfPath && <PDFViewer filePath={pdfPath} />}
      <ChatInterface />
    </div>
  );
};

export default App;
