import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getApiUrl } from '../api';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Description = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
`;

const GithubLink = styled.a`
  display: block;
  text-align: center;
  color: #0077ff;
  margin-bottom: 2rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const MemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const MemeCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const MemeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MemeDescription = styled.p`
  padding: 0.5rem;
  margin: 0;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
`;

function Home() {
  const [memes, setMemes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await axios.get(`${getApiUrl()}/memes`);
        setMemes(response.data);
      } catch (error) {
        console.error('Error fetching memes:', error);
        setError('Failed to fetch memes. Please try again later.');
      }
    };

    fetchMemes();
  }, []);

  return (
    <HomeContainer>
      <Title>Welcome to Meme Search</Title>
      <Description>
        Meme Search is your ultimate meme database, designed to save and search memes with ease.
        Never struggle to find a meme you remember again with our powerful search feature that 
        makes locating your favorite memes quick and effortless. 
      </Description>
      <GithubLink href="https://github.com/yourusername/meme-search-app" target="_blank" rel="noopener noreferrer">
        View on GitHub
      </GithubLink>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <MemeGrid>
        {memes.map((meme) => {
          const imageUrl = new URL(meme.url, getApiUrl()).href;
          return (
            <MemeCard key={meme.id}>
              <MemeImage
                src={imageUrl}
                alt={meme.description}
                onError={(e) => {
                  console.error(`Failed to load image: ${imageUrl}`);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                }}
              />
              <MemeDescription>{meme.description}</MemeDescription>
            </MemeCard>
          )
        })}
      </MemeGrid>
    </HomeContainer>
  );
}

export default Home;