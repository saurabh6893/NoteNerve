import { useEffect, useState } from 'react';
import { getBackendHealth } from './api';
import ChatInterface from './components/ChatInterface';
import PDFUpload from './components/PDFUpload';
import PDFViewer from './components/PDFViewer';

const App = () => {
  const [message, setMessage] = useState('');
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  useEffect(() => {
    getBackendHealth().then(setMessage);
  }, []);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div>
      <h1>PDF NotebookLM Clone (Frontend)</h1>
      <p>Backend health: {message}</p>
      <PDFUpload onUploadSuccess={(path) => setUploadedPath(path)} />

      {uploadedPath && <PDFViewer filePath={`${API_BASE}${uploadedPath}`} />}

      <ChatInterface />
    </div>
  );
};

export default App;
