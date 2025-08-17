import React from 'react';

const PDFActions = ({ 
  onMerge, 
  onAddPageNumbers, 
  onDownload, 
  loading, 
  hasProcessedPdf 
}) => {
  return (
    <div className="pdf-actions-container">
      <h2>PDF Operations</h2>
      <div className="action-buttons">
        <button 
          onClick={onMerge} 
          disabled={loading}
          className="action-button merge-button"
        >
          {loading ? 'Merging...' : 'Merge PDFs'}
        </button>
        
        <button 
          onClick={onAddPageNumbers} 
          disabled={loading}
          className="action-button page-numbers-button"
        >
          {loading ? 'Adding...' : 'Add Page Numbers'}
        </button>
        
        {hasProcessedPdf && (
          <button 
            onClick={onDownload} 
            disabled={loading}
            className="action-button download-button"
          >
            Download Result
          </button>
        )}
      </div>
    </div>
  );
};

export default PDFActions;