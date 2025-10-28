// src/pages/Homepage.jsx
import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import MainFeatures from '../components/MainFeatures';
import LeaderboardPreview from '../components/LeaderboardPreview';
import Benefits from '../components/Benefits';
import CTASection from '../components/CTASection';

const Homepage = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <MainFeatures />
      
      <Benefits />
      <CTASection />
    </>
  );
};

export default Homepage;
