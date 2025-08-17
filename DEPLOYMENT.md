# Deployment Guide for Rusty PDF Merge

## Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com if you don't have one
2. Install Vercel CLI: `npm install -g vercel`
3. Navigate to the frontend directory: `cd frontend`
4. Configure the API URL in your frontend code to point to your deployed backend
5. Deploy to Vercel: `vercel`
6. Follow the prompts to complete the deployment

## Backend Deployment (Render)

1. Create a Render account at https://render.com if you don't have one
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the following settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables if needed
6. Click "Create Web Service"

## Environment Variables

Make sure to set the following environment variables in your deployment platforms:

### Frontend (Vercel)
- `VITE_API_URL`: URL of your deployed backend API

### Backend (Render)
- `PORT`: Port for the server to listen on (default: 5000)
- `CORS_ORIGIN`: URL of your deployed frontend

## CORS Configuration

Update the CORS configuration in `backend/server.js` to allow requests from your deployed frontend:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-frontend-url.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

## Connecting Frontend to Backend

Update the API URL in your frontend code to point to your deployed backend:

```javascript
// In frontend/src/App.jsx
// The code now handles trailing slashes to prevent double-slash issues
let API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';
// Remove trailing slash if present to avoid double slash in API calls
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}
```

**Important Note**: When setting the `VITE_API_URL` environment variable, make sure it does not have a trailing slash. If it does, the code will now handle it, but it's better to set it without the trailing slash (e.g., `https://your-backend-url.onrender.com` instead of `https://your-backend-url.onrender.com/`).

## Testing the Deployment

1. Upload a PDF file to test file upload functionality
2. Test merging PDFs
3. Test adding page numbers
4. Test downloading processed PDFs