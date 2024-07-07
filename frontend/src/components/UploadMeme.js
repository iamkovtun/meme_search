import React, { useState } from 'react';
import axios from 'axios';

function UploadMeme() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const getDescriptionAndText = async () => {
    if (!file) {
      alert('Please select an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('http://localhost:3001/generate-description', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDescription(response.data.description);
      setExtractedText(response.data.extracted_text);
    } catch (error) {
      console.error('Error getting description and text:', error);
      alert('Failed to get description and text. Please try again.');
    }
  };

  const saveMeme = async () => {
    if (!file || !description) {
      alert('Please upload an image and provide a description.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);
    formData.append('extracted_text', extractedText);
    try {
      const response = await axios.post('http://localhost:3001/memes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response);
      alert('Meme saved successfully!');
    } catch (error) {
      console.error('Error saving meme:', error.response || error.message || error);
      alert('Failed to save meme. Please try again.');
    }
  };

  return (
    <div>
      <h2>Upload Meme</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />}
      <br />
      <button onClick={getDescriptionAndText}>Get Description and Text</button>
      <br />
      <div>
        <h3>Description:</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Meme description"
          rows="4"
          cols="50"
        />
      </div>
      <div>
        <h3>Extracted Text:</h3>
        <textarea
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
          placeholder="Extracted text"
          rows="4"
          cols="50"
        />
      </div>
      <br />
      <button onClick={saveMeme}>Save Meme</button>
    </div>
  );
}

export default UploadMeme;