// server/index.js

const express = require('express');
const cors = require('cors');
//const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
/*mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));
*/
// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from the Math Tutor API!');
});

// Import Routes
const problemRoutes = require('./routes/problems');

// Use Routes
app.use('/api/problems', problemRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
