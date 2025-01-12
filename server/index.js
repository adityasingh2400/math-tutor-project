const dotenv = require('dotenv');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Add fs to check folder existence
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const problemsRoutes = require('./routes/problems');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
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

// Ensure the 'uploads' folder exists, create it if not
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
  limits: { fileSize: 200 * 1024 * 1024 },  // 200 MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Upload Route with Error Handling
app.post('/api/upload', (req, res) => { // Changed route to /api/upload
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
app.use(helmet()); // Adds security-related HTTP headers
app.use(cors({
  origin: 'http://localhost:5173', // Adjust as needed for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Apply rate limiting to /api routes
app.use('/api', apiLimiter, problemsRoutes);

// Swagger Configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Math Tutor API',
      version: '1.0.0',
      description: 'API for analyzing math problems and generating similar ones.',
    },
  },
  apis: ['./routes/*.js'], // Files containing Swagger annotations
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Handle Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Use the centralized error handler
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
