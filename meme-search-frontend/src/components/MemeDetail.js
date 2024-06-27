import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MemeDetail() {
  const [meme, setMeme] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/memes/${id}`);
        setMeme(response.data);
      } catch (error) {
        console.error('Error fetching meme:', error);
      }
    };

    fetchMeme();
  }, [id]);

  if (!meme) return <div>Loading...</div>;

  return (
    <div>
      <h2>Meme Detail</h2>
      <img src={meme.url} alt={meme.description} style={{maxWidth: '500px'}} />
      <p>{meme.description}</p>
    </div>
  );
}

export default MemeDetail;