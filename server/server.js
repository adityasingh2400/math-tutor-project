// server/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API Endpoint to Analyze Problem
app.post('/api/analyze', async (req, res) => {
  const { problemText } = req.body;

  if (!problemText) {
    return res.status(400).json({ error: 'Problem text is required.' });
  }

  try {
    // Step 1: Analyze the Problem
    const analysisPrompt = `
    Analyze the following math problem to determine its type (e.g., Algebra, Calculus, Geometry) and difficulty level (e.g., Easy, Medium, Hard).

    Problem:
    "${problemText}"

    Respond with a JSON object in the following format:
    {
      "type": "Algebra",
      "difficulty": "Medium"
    }
    `;

    const analysisResponse = await openai.createCompletion({
      model: 'gpt-4o',
      prompt: analysisPrompt,
      max_tokens: 100,
      temperature: 0.5,
    });

    const analysisResult = analysisResponse.data.choices[0].text.trim();

    let analysis;
    try {
      analysis = JSON.parse(analysisResult);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to parse analysis result.', details: analysisResult });
    }

    const { type, difficulty } = analysis;

    // Step 2: Generate Similar Problems
    const generationPrompt = `
    Generate five math problems similar in type (${type}) and difficulty (${difficulty}) to the following problem:

    "${problemText}"

    Provide the problems as a JSON array like this:
    [
      "Problem 1",
      "Problem 2",
      "Problem 3",
      "Problem 4",
      "Problem 5"
    ]
    `;

    const generationResponse = await openai.createCompletion({
      model: 'gpt-4o',
      prompt: generationPrompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const generationResult = generationResponse.data.choices[0].text.trim();

    let similarProblems;
    try {
      similarProblems = JSON.parse(generationResult);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to parse similar problems.', details: generationResult });
    }

    // Respond with Analysis and Similar Problems
    res.json({
      type,
      difficulty,
      similarProblems,
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
