const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Routes
app.post('/api/upload', upload.array('pdfs', 10), (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      id: path.basename(file.path)
    }));
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Merge PDFs
app.post('/api/merge', async (req, res) => {
  try {
    const { files, order } = req.body;
    
    if (!files || !files.length) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Sort files based on the order array if provided
    const sortedFiles = order 
      ? order.map(id => files.find(file => file.id === id)).filter(Boolean)
      : files;

    // Process each PDF file in order
    for (const file of sortedFiles) {
      const filePath = path.join(__dirname, 'uploads', path.basename(file.path));
      const pdfBytes = await fs.readFile(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfPath = path.join(__dirname, 'uploads', `merged-${Date.now()}.pdf`);
    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(mergedPdfPath, mergedPdfBytes);

    res.json({
      success: true,
      file: {
        path: mergedPdfPath,
        filename: path.basename(mergedPdfPath),
        id: path.basename(mergedPdfPath)
      }
    });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add page numbers to PDF
app.post('/api/add-page-numbers', async (req, res) => {
  try {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const filePath = path.join(__dirname, 'uploads', fileId);
    const pdfBytes = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    // Add page numbers to each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      page.drawText(`${i + 1} / ${pages.length}`, {
        x: width / 2,
        y: 30,
        size: 12,
        color: rgb(0, 0, 0),
      });
    }

    // Save the modified PDF
    const numberedPdfPath = path.join(__dirname, 'uploads', `numbered-${Date.now()}.pdf`);
    const numberedPdfBytes = await pdfDoc.save();
    await fs.writeFile(numberedPdfPath, numberedPdfBytes);

    res.json({
      success: true,
      file: {
        path: numberedPdfPath,
        filename: path.basename(numberedPdfPath),
        id: path.basename(numberedPdfPath)
      }
    });
  } catch (error) {
    console.error('Error adding page numbers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download a processed PDF
app.get('/api/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(__dirname, 'uploads', fileId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});