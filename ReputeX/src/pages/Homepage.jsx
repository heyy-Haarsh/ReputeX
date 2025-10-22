// src/pages/Homepage.jsx
import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import KeyFeatures from '../components/KeyFeatures';
import Benefits from '../components/Benefits';
import LeaderboardPreview from '../components/LeaderboardPreview';
import SuggestionsPreview from '../components/SuggestionsPreview';
import CTASection from '../components/CTASection';

const Homepage = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <KeyFeatures />
      <Benefits />
      <LeaderboardPreview />
      <CTASection />
    </>
  );
};

export default Homepage;
