// src/App.jsx

import React from 'react';
import SubmitProblem from './components/SubmitProblem.jsx'; // Ensure you've imported the new component

function App() {
  return (
    <div className="App">
      <h1>Welcome to the Math Problem Finder</h1>
      <SubmitProblem />
    </div>
  );
}

export default App;
