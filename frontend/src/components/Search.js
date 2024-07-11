import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';
import Masonry from 'react-masonry-css';
import { getApiUrl } from '../api';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 70%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px 0 0 4px;
  &:focus {
    outline: none;
    border-color: #0077ff;
  }
`;

const SearchButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #0077ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0066dd;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const MemeCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  margin-bottom: 1rem;
  &:hover {
    transform: translateY(-5px);
  }
`;

const MemeImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const MemeDescription = styled.p`
  padding: 1rem;
  margin: 0;
  font-size: 0.9rem;
  color: #333;
`;

const NoResults = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 2rem;
`;

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const searchUrl = `${getApiUrl()}/memes?search=${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(searchUrl);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching memes:', error);
      setError('Failed to fetch memes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <SearchContainer>
      <Title>Meme Search</Title>
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoading ? (
        <LoaderContainer>
          <ThreeDots color="#0077ff" height={80} width={80} />
        </LoaderContainer>
      ) : searchResults.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {searchResults.map((meme) => {
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
            );
          })}
        </Masonry>
      ) : searchTerm && !isLoading ? (
        <NoResults>No memes found. Try a different search term.</NoResults>
      ) : null}
    </SearchContainer>
  );
}

export default Search;