// src/App.jsx


import React from 'react';
import SubmitProblem from './components/SubmitProblem.jsx'; // Ensure you've imported the new component
import Upload from './components/Upload';  // Import the Upload component


function App() {
  return (
    <div className="App">
      <h1>Welcome to the Math Problem Finder</h1>
      <SubmitProblem />

      <Upload />  {/* Include the Upload component */}


    </div>
  );
}



export default App;


