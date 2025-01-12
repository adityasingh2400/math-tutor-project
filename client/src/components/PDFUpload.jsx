// client/src/components/PDFUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

function PDFUpload() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setErrorMsg('Please select a PDF first');
      return;
    }
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);

      // Adjust the URL if your server is on a different port
      // e.g. "http://localhost:3000/api/tests/upload"
      const res = await axios.post('/api/tests/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadResponse(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error uploading PDF. Check console for details.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h2>Upload a PDF to Aryn DocParse</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>
        Upload
      </button>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {uploadResponse && (
        <div>
          <h3>Upload/Parse Results</h3>
          <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default PDFUpload;
