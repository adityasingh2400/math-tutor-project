// client/src/components/SubmitProblem.jsx

import React, { useState } from 'react';
import axios from 'axios';

const SubmitProblem = () => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [similarProblems, setSimilarProblems] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problem.trim()) {
      alert('Please enter a problem.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSimilarProblems([]);

    try {
      const response = await axios.post('/api/analyze', {
        problemText: problem,
      });

      const { type, difficulty, similarProblems } = response.data;

      setAnalysis({ type, difficulty });
      setSimilarProblems(similarProblems);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Submit Your Problem</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your problem here..."
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {analysis && (
        <div>
          <h2>Analysis</h2>
          <p><strong>Type:</strong> {analysis.type}</p>
          <p><strong>Difficulty:</strong> {analysis.difficulty}</p>
        </div>
      )}

      {similarProblems.length > 0 && (
        <div>
          <h2>Similar Problems</h2>
          <ol>
            {similarProblems.map((problem, index) => (
              <li key={index}>{problem}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SubmitProblem;
