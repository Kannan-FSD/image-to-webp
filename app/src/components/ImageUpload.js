import React, { useState } from 'react';
import axios from 'axios';
import '../styles/index.css';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
    setMessage('');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles([...selectedFiles, ...files]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('images', file));

    try {
      setIsProcessing(true);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDownloadLink(`http://localhost:5000${response.data.downloadLink}`);
      sessionStorage.setItem('userId', response.data.userId);
      setIsProcessing(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message === 'Only image files are allowed.'
          ? `Invalid files: ${error.response.data.invalidFiles.join(', ')}`
          : 'Error processing images.'
      );
      setIsProcessing(false);
    }
  };

  const preventDefault = (event) => event.preventDefault();

  return (
    <div className="container">
      <h2 className="container__title">Convert Images to WEBP</h2>
      <div
        className="drop-area"
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDrop={handleDrop}
      >
        <p className="drop-area__text">Drag & drop images here, or click to select files</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="drop-area__file-input"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={isProcessing}
        className={`btn btn--upload`}
      >
        {isProcessing ? 'Processing...' : 'Upload Images'}
      </button>

      {downloadLink && (
        <a href={downloadLink} className="btn btn--download" download>
          Download as ZIP
        </a>
      )}
      
      {selectedFiles.length > 0 && (
        <div className="preview">
          {selectedFiles.map((file, index) => (
            <div key={index} className="preview__item">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="preview__image"
              />
              <p className="preview__file-name">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default App;
