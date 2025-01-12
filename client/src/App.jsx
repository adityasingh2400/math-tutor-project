// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Updated for React Router v6
import SubmitProblem from './components/SubmitProblem'; // Ensure this path is correct
import Upload from './components/Upload'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Maple</h1>

        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Describe the type of problem you would like</Link></li> {/* Updated text */}
            <li><Link to="/upload">Upload</Link></li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<SubmitProblem />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
