const express = require('express');
const router = express.Router();
const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/find-similar-problems', async (req, res) => {
  const { problemDescription } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-004", // Adjust according to available models
      prompt: `Find math problems similar in difficulty and structure to: ${problemDescription}`,
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

module.exports = router;