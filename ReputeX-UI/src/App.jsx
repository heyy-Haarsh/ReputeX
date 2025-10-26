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
// --- FIX 1: Correct the import path ---
import GreenwashAnalyzer from './pages/GreenwashAnalyzer.jsx'; // It's in the 'pages' folder
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

        {/* --- FIX 2: Use your desired path --- */}
        <Route path="/greenwash-detector" element={<GreenwashAnalyzer />} />
        {/* --- End Fix --- */}

        {/* <Route path="/analyzer" element={<GreenwashAnalyzer />} /> // Removed old path */}
        {/* <Route path="/GreenwashAnalyzer" element={<GreenwashAnalyzer />} /> // Removed old path */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;