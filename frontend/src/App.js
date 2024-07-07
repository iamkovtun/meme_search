import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import MemeDetail from './components/MemeDetail';
import UploadMeme from './components/UploadMeme';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/upload">Upload Meme</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/meme/:id" element={<MemeDetail />} />
          <Route path="/upload" element={<UploadMeme />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;