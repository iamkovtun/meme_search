import React, { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../api';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('Search initiated with term:', searchTerm);
    try {
      const searchUrl = `${getApiUrl()}/memes?search=${encodeURIComponent(searchTerm)}`;
      console.log('Sending GET request to:', searchUrl);
      const response = await axios.get(searchUrl);
      console.log('Search response received:', response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching memes:', error);
      setError('Failed to fetch memes. Please try again.');
    }
  };

  return (
    <div>
      <h2>Search Memes</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="search-results">
        {searchResults.map((meme) => {
          const imageUrl = new URL(meme.url, getApiUrl()).href;
          return (
            <div key={meme.id}>
              <img 
                src={imageUrl}
                alt={meme.description} 
                style={{width: '200px'}} 
                onError={(e) => {
                  console.error(`Failed to load image: ${imageUrl}`);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                }}
              />
              <p>{meme.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Search;