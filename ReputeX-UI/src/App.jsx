// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './GlobalStyles';
import { theme } from './theme.js'; // Assumes theme.js is at /src/theme.js
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Page Imports ---
import Homepage from './pages/Homepage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
// --- Feature Page Imports ---
import GreenwashAnalyzer from './pages/GreenwashAnalyzer.jsx';
import SelfReporting from './pages/SelfReporting.jsx'; // Corrected import

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navbar />
      <Routes>
        
        {/* --- Primary App Routes --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        {/* --- FEATURE 1: GREENWASH DETECTOR --- */}
        <Route path="/greenwash-detector" element={<GreenwashAnalyzer />} /> 
        
        {/* --- FEATURE 2: SELF-ASSESSMENT ROUTE --- */}
        <Route path="/self-reporting" element={<SelfReporting />} /> 
        
        {/* --- Info Pages --- */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;