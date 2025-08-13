import React, { useState } from 'react';

interface UploadResult {
  success: boolean;
  filename?: string;
  path?: string;
  error?: string;
}

interface PDFUploadProps {
  onUploadSuccess: (path: string) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle',
  );
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadResult(null);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/pdf/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        setUploadResult({
          success: true,
          filename: result.filename,
          path: result.path,
        });
        onUploadSuccess(result.path);
      } else {
        setUploadStatus('error');
        setUploadResult({
          success: false,
          error: result.error || 'Upload failed',
        });
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadResult({
        success: false,
        error: 'Network error during upload',
      });
    }
  };

  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Upload PDF</h3>

      <div className="space-y-3">
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === 'uploading'}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload PDF'}
        </button>

        {uploadResult && (
          <div
            className={`text-sm p-2 rounded ${
              uploadResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {uploadResult.success
              ? `Successfully uploaded: ${uploadResult.filename}`
              : `Error: ${uploadResult.error}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUpload;
