// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './GlobalStyles';
import { theme } from '../src/theme.js';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import GreenwashAnalyzer from './GreenwashAnalyzer.jsx'; // Your component
import About from './pages/About';
import Contact from './pages/Contact';



function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* --- ADD YOUR NEW ROUTE HERE --- */}
        <Route path="/analyzer" element={<GreenwashAnalyzer />} />
        {/* --- You can choose the path, "/analyzer" is a good option --- */}

        <Route path="/GreenwashAnalyzer" element={<GreenwashAnalyzer />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;