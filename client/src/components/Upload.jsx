import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // Store the file URL


  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('pdf', file);

      // Send the file to the server
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log('File uploaded successfully:', data);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div>
      <h1>Upload your PDF</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="application/pdf" 
        />
        <button type="submit">Upload PDF</button>
      </form>

      {fileUrl && (
        <div>
          <h2>Uploaded PDF:</h2>
          {/* Use the fileUrl to display the PDF */}
          <embed
            src={fileUrl}
            width="600"
            height="500"
            type="application/pdf"
          />
        </div>
      )}
    </div>
  );
};

export default Upload;