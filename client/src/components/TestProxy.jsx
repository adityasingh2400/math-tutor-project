// src/components/TestProxy.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestProxy = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/test'); // Hardcoded URL
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching the message:', error);
        setMessage('Failed to fetch message from the server.');
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h2>Proxy Test</h2>
      <p>{message}</p>
    </div>
  );
};

export default TestProxy;
