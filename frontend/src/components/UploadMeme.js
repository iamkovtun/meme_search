import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getApiUrl } from '../api';

const UploadContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

const Section = styled.div`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

function UploadMeme() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
      const response = await axios.post(`${getApiUrl()}/generate-description`, formData, {
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
      const response = await axios.post(`${getApiUrl()}/memes`, formData, {
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
    <UploadContainer>
      <Title>Upload Meme</Title>
      <FileInputLabel>
        Choose File
        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
      </FileInputLabel>
      {previewUrl && <PreviewImage src={previewUrl} alt="Preview" />}
      <Button onClick={getDescriptionAndText}>Get Description and Text</Button>
      <Section>
        <SectionTitle>Description:</SectionTitle>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Meme description"
          rows="4"
        />
      </Section>
      <Section>
        <SectionTitle>Extracted Text:</SectionTitle>
        <TextArea
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
          placeholder="Extracted text"
          rows="4"
        />
      </Section>
      <Button onClick={saveMeme}>Save Meme</Button>
    </UploadContainer>
  );
}

export default UploadMeme;