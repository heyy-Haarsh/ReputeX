// src/components/Hero.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const HeroSection = styled.section`
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: ${props => props.theme.colors.darkBg};
  display: flex;
  align-items: center;
  padding: 8rem 5% 4rem;
  overflow: visible;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 6rem 3% 3rem;
  }
`;

const WaveBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 31, 28, 0.6) 100%);
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
`;

const TextContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 3;
`;

const Headline = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 400;
  line-height: 1.1;
  color: ${props => props.theme.colors.textPrimary};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

const HeadlineAccent = styled.span`
  display: block;
  font-size: 5rem;
  font-weight: 600;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subheadline = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
  max-width: 550px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: 0 auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 600;
  font-size: 1rem;
  align-self: flex-start;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.gradientButton};
    transition: left 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    left: 0;
  }

  &:hover {
    color: ${props => props.theme.colors.darkBg};
    box-shadow: ${props => props.theme.shadows.glow};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    align-self: center;
  }
`;

const SplineContainer = styled(motion.div)`
  width: 800px;
  height: 700px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  canvas {
    transform: scale(0.5); /* Reduce default size */
    transform-origin: center; /* Keep centered */
    
  }
`;

const SplineWrapper = styled.div`
  width: 150%; /* Make it bigger */
  height: 150%; /* Make it bigger */
  transform-origin: center;
  position: relative;
`;

const Hero = () => {
  const onSplineLoad = (spline) => {
    console.log('Spline loaded successfully:', spline);
  };

  return (
    <HeroSection>
      <WaveBackground />

      <ContentWrapper>
        <TextContent
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Headline
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Real-Time ESG Reputation
            <HeadlineAccent>Tracker & Advisor</HeadlineAccent>
          </Headline>

          <Subheadline
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover actionable insights. Monitor ESG performance like never before.
          </Subheadline>

          <CTAButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Get Started
          </CTAButton>
        </TextContent>

        {/* Reduced-size Spline */}
        <SplineContainer
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.4, duration: 1 }}
>
  <SplineWrapper>
    <Spline 
      scene="https://prod.spline.design/MP2mKLOdagY-8Hhd/scene.splinecode"
      onLoad={onSplineLoad}
    />
  </SplineWrapper>
</SplineContainer>
      </ContentWrapper>
    </HeroSection>
  );
};

export default Hero;
