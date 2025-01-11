// server/index.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path'); // Add this to fix the "path is not defined" error
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']; // Add allowed origins here
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

// Debugging Middleware (Optional)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from the Math Tutor API!');
});

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files in the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
  },
});

// Initialize multer with the storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },  // 10 MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Upload Route with Error Handling
app.post('/upload', (req, res) => {
  upload.single('pdf')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file);

    // Return the URL to the uploaded file
    res.json({
      message: 'File uploaded successfully',
      file: { path: `/uploads/${req.file.filename.replace(/\\/g, '/')}` }, // Normalize path for URLs
    });
  });
});

// Serve the uploaded files statically
app.use('/uploads', express.static('uploads'));

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
