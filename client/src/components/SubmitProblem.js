import React, { useState } from 'react';
import axios from 'axios';

const SubmitProblem = () => {
  const [problem, setProblem] = useState('');
  const [similarProblems, setSimilarProblems] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/find-similar-problems', { problemDescription: problem });
      setSimilarProblems(response.data.similarProblems);
    } catch (error) {
      console.error('Error fetching similar problems:', error);
    }
  };

  return (
    <div>
      <h1>Submit Your Problem</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe the math problem"
        />
        <button type="submit">Find Similar Problems</button>
      </form>
      <div>
        <h2>Similar Problems</h2>
        <p>{similarProblems}</p>
      </div>
    </div>
  );
};

export default SubmitProblem;
