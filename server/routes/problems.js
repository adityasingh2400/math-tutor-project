const express = require('express');
const router = express.Router();
const axios = require('axios');
const OPENAI_API_KEY = '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';

router.post('/find-similar-problems', async (req, res) => {
  const { problemDescription } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "gpt-4o", // Adjust according to available models
      prompt: `Find math problems similar in difficulty and structure and type to: ${problemDescription}`,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ similarProblems: response.data.choices[0].text });
  } catch (error) {
    console.error('Error fetching similar problems:', error);
    res.status(500).send('Failed to fetch similar problems');
  }
});
const { analyzeProblem } = require('../controllers/problemController.js');

// Define the POST /api/analyze route
router.post('/analyze', analyzeProblem);
module.exports = router;