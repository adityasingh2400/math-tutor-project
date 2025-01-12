import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MathJax from 'react-mathjax';

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
      setError({
        message: err.response?.data?.error || 'An unexpected error occurred.',
        details: err.response?.data?.details || null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to format similar problems into LaTeX
  const formatProblemForLatex = (problemText) => {
    return `$$${problemText}$$`; // Add LaTeX math delimiters
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
              <li key={index}>
                <MathJax.Provider>
                  <MathJax.Node formula={formatProblemForLatex(problem)} />
                </MathJax.Provider>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SubmitProblem;