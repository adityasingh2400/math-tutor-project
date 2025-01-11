// server/models/Problem.js

const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  mainTopic: {
    type: String,
    required: true,
    trim: true,
  },
  subTopic: {
    type: String,
    required: true,
    trim: true,
  },
  problem: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    required: true,
    trim: true,
  },
  // Optionally, add more fields like difficulty, tags, etc.
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
