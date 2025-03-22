import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';

import {createGlobalStyle} from 'styled-components';


function App() {
  const [count, setCount] = useState(0);
  const GlobalStyle = createGlobalStyle`
    html, body {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Убираем горизонтальный скролл */
  },
  #root
  {
    margin: 0;
    padding: 0;
    min-width: 100%
  }
`;

  return (
    
    <>
    <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="user/:id" element={<Details/>}/>
        </Routes>
      </Router>
    </>
    
  )
}

export default App
