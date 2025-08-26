# Rusty PDF Merge

A web application that allows users to perform various operations on PDF files, including importing, merging, adding page numbers, and saving modified files.
http://pdfmergebyrusty.vercel.app/
## Features

- Import PDFs via drag-and-drop or file browser
- Merge multiple PDFs with custom ordering
- Add page numbers to PDFs
- Save modified PDFs as new files
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **PDF Processing**: pdf-lib
- **File Upload**: react-dropzone, multer

##Desktop View

<img width="1792" height="863" alt="{BE7F6A48-AD26-496A-AE1E-B0E7E6ECC7B4}" src="https://github.com/user-attachments/assets/85640a53-0bc5-4f38-8fdd-e548c8faccc7" />



## Project Structure

```
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   │   ├── PDFUploader.jsx
│   │   │   ├── PDFList.jsx
│   │   │   └── PDFActions.jsx
│   │   ├── App.jsx    # Main application component
│   │   └── App.css    # Styles
│   └── ...
└── backend/           # Node.js backend
    ├── server.js      # Express server
    ├── uploads/       # Uploaded PDFs
    ├── processed/     # Processed PDFs
    └── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd rusty-pdf-merge
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173/)

## Deployment

The application can be deployed using various platforms:

- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Heroku, Render, Railway

## License

MIT
