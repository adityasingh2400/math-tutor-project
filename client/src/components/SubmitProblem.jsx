// src/components/SubmitProblem.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SubmitProblem = () => {
  const [problem, setProblem] = useState(''); // State for the problem input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [analysis, setAnalysis] = useState(null); // State for analysis result
  const [similarProblems, setSimilarProblems] = useState([]); // State for similar problems
  const [error, setError] = useState(null); // State for error handling

  // Handle problem submission
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
      setError({
        message: err.response?.data?.error || 'An unexpected error occurred.',
        details: err.response?.data?.details || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Describe the type of problem you would like</h2>
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

      {error && (
        <div style={{ color: 'red' }}>
          <p>{error.message}</p>
          {error.details && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
      )}

      {analysis && (
        <div>
          <h3>Analysis</h3>
          <p><strong>Type:</strong> {analysis.type}</p>
          <p><strong>Difficulty:</strong> {analysis.difficulty}</p>
        </div>
      )}

      {similarProblems.length > 0 && (
        <div>
          <h3>Similar Problems</h3>
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
