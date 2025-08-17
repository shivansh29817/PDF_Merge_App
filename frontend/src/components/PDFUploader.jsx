import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const PDFUploader = ({ onFilesAdded, loading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Filter only PDF files
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === 'application/pdf'
    );
    
    if (pdfFiles.length > 0) {
      onFilesAdded(pdfFiles);
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  return (
    <div className="pdf-uploader">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <p>Uploading...</p>
        ) : isDragActive ? (
          <p>Drop the PDF files here...</p>
        ) : (
          <div>
            <p>Drag & drop PDF files here, or click to select files</p>
            <button type="button" className="browse-button">
              Browse Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;