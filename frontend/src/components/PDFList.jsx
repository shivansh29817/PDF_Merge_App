import React from 'react';

const PDFList = ({ pdfs, onRemove, onReorder }) => {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
  };

  return (
    <div className="pdf-list">
      <h2>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs uploaded yet</p>
      ) : (
        <ul>
          {pdfs.map((pdf, index) => (
            <li 
              key={pdf.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="pdf-item"
            >
              <div className="pdf-info">
                <span className="pdf-name">{pdf.filename}</span>
                <div className="pdf-actions">
                  <button 
                    onClick={() => onRemove(pdf.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {pdfs.length > 1 && (
        <p className="drag-instruction">Drag and drop to reorder PDFs</p>
      )}
    </div>
  );
};

export default PDFList;