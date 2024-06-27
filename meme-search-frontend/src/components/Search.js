import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    try {
      const response = await axios.get(`http://localhost:3001/memes?search=${searchTerm}`);
      console.log('Search response:', response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching memes:', error);
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
      <div className="search-results">
        {searchResults.map((meme) => (
          <div key={meme.id}>
            <Link to={`/meme/${meme.id}`}>
              <img src={meme.url} alt={meme.description} style={{width: '200px'}} />
            </Link>
            <p>{meme.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;