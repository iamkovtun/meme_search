import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import Home from './components/Home';
import Search from './components/Search';
import UploadMeme from './components/UploadMeme';

const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  background-color: #2c3e50;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: #ecf0f1;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-left: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header>
          <Nav>
            <Logo to="/">MemeSearch</Logo>
            <NavList>
              <NavItem><NavLink to="/">Home</NavLink></NavItem>
              <NavItem><NavLink to="/search">Search</NavLink></NavItem>
              <NavItem><NavLink to="/upload">Upload Meme</NavLink></NavItem>
            </NavList>
          </Nav>
        </Header>

        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/upload" element={<UploadMeme />} />
          </Routes>
        </Main>
      </AppContainer>
    </Router>
  );
}

export default App;