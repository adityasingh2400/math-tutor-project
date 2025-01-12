import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null); // File selected for upload
  const [localPdfUrl, setLocalPdfUrl] = useState(null); // Local preview
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState(null); // URL from server
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setLocalPdfUrl(URL.createObjectURL(selectedFile)); // Create local preview
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file); // Key 'pdf' must match backend configuration

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedPdfUrl(data.file.path); // Update server URL for uploaded file
        alert('File uploaded successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error during file upload:', err);
      alert('An error occurred during upload');
    }
  };

  // Redirect to another page
  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Upload Your PDF</h2>

      {/* File input */}
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf" // Restrict file types
      />
      <br />
      <button onClick={handleFileUpload}>Upload PDF</button>
      <br />
      <button onClick={handleRedirect}>Go to Submit Problem</button>

      {/* Local and Uploaded PDF preview */}
      {localPdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Preview:</h3>
          <iframe
            src={uploadedPdfUrl || localPdfUrl} // Show uploaded PDF if available, otherwise local preview
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default Upload;
