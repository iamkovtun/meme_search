import React, { useState } from 'react';
import axios from 'axios';

function UploadMeme() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');

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

  const getDescription = async () => {
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
    } catch (error) {
      console.error('Error getting description:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      alert('Failed to get description. Please try again.');
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
      <button onClick={getDescription}>Get Description</button>
      <br />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Meme description"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={saveMeme}>Save Meme</button>
    </div>
  );
}

export default UploadMeme;