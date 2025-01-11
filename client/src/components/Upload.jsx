import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  // Handle file change
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      const correctedFilePath = response.data.file.path.replace(/\\/g, '/');  // Replace backslashes with forward slashes

      setFileUrl(correctedFilePath);  // Set the corrected file URL
      setError('');
    } catch (err) {
    if (err.response) {
      setError(err.response.data.message || 'Error uploading file. Please try again.');
    } else {
      setError('Error uploading file. Please try again.');
    }
    console.error(err);
  }
};
    

return (
  <div>
    <h1>Upload a PDF</h1>
    <input type="file" onChange={onFileChange} />
    <button onClick={onFileUpload}>Upload</button>

    {error && <div style={{ color: 'red' }}>{error}</div>}

    {/* Render the uploaded PDF if fileUrl is set */}
    {fileUrl && (
      <div>
        <iframe
          src={`http://localhost:8000${fileUrl}`} // Complete URL to the uploaded file
          width="600"
          height="400"
          title="Uploaded PDF"
        ></iframe>
      </div>
    )}
  </div>
);
};

export default Upload;
