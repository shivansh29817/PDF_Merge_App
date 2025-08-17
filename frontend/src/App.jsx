import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import PDFUploader from './components/PDFUploader';
import PDFList from './components/PDFList';
import PDFActions from './components/PDFActions';
import './App.css';

// API URL from environment variable or default to localhost in development
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Remove trailing slash if present to avoid double slash in API calls
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processedPdf, setProcessedPdf] = useState(null);

  const handleFilesAdded = async (files) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create FormData for upload
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
      }

      // Upload files to server
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload files');
      }

      setPdfs(prevPdfs => [...prevPdfs, ...data.files]);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err.message || 'Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePdf = (id) => {
    setPdfs(pdfs.filter(pdf => pdf.id !== id));
  };

  const handleReorderPdfs = (startIndex, endIndex) => {
    const result = Array.from(pdfs);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setPdfs(result);
  };

  const handleMergePdfs = async () => {
    if (pdfs.length < 2) {
      setError('You need at least 2 PDFs to merge');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: pdfs,
          order: pdfs.map(pdf => pdf.id),
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to merge PDFs');
      }

      setProcessedPdf(data.file);
    } catch (err) {
      console.error('Error merging PDFs:', err);
      setError(err.message || 'Failed to merge PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPageNumbers = async () => {
    if (!processedPdf && pdfs.length === 0) {
      setError('You need at least 1 PDF to add page numbers');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fileToProcess = processedPdf || pdfs[0];

      const response = await fetch(`${API_URL}/api/add-page-numbers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: fileToProcess.id,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to add page numbers');
      }

      setProcessedPdf(data.file);
    } catch (err) {
      console.error('Error adding page numbers:', err);
      setError(err.message || 'Failed to add page numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedPdf) {
      setError('No processed PDF to download');
      return;
    }

    try {
      window.open(`${API_URL}/api/download/${processedPdf.id}`, '_blank');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError(err.message || 'Failed to download PDF');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Rusty PDF Merge</h1>
      </header>
      
      <main>
        <PDFUploader onFilesAdded={handleFilesAdded} loading={loading} />
        
        {error && <div className="error-message">{error}</div>}
        
        {pdfs.length > 0 && (
          <PDFList 
            pdfs={pdfs} 
            onRemove={handleRemovePdf} 
            onReorder={handleReorderPdfs} 
          />
        )}
        
        {pdfs.length > 0 && (
          <PDFActions 
            onMerge={handleMergePdfs} 
            onAddPageNumbers={handleAddPageNumbers} 
            onDownload={handleDownload} 
            loading={loading} 
            hasProcessedPdf={!!processedPdf} 
          />
        )}
        
        {processedPdf && (
          <div className="processed-pdf">
            <h3>Processed PDF</h3>
            <p>{processedPdf.filename}</p>
            <button onClick={handleDownload} disabled={loading}>
              Download
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
