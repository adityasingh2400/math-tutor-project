// server/index.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
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
