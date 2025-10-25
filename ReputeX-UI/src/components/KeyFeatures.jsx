// src/components/KeyFeatures.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiGlobe, FiMessageSquare, FiAward } from 'react-icons/fi';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 255, 170, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg} 3%;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  padding: 3rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
  transition: all 0.4s ease;
  
  &:hover {
    background: rgba(0, 255, 170, 0.08);
    border-color: ${props => props.$color};
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px ${props => props.$color}40;
  }
`;

const IconCircle = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  background: ${props => props.$color}10;
  border: 3px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${props => props.$color};
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 0 40px ${props => props.$color}80;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.7rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
`;

const features = [
  {
    icon: <FiGlobe />,
    title: 'News & Media Monitoring',
    description: 'Automatically pull real-time news covering ESG topics and classify them for you.',
    color: '#00ff88'
  },
  {
    icon: <FiMessageSquare />,
    title: 'Social Sentiment Feed',
    description: 'Tap into Reddit and other social sources to capture employee and public perception, unfiltered and immediate.',
    color: '#00ddbb'
  },
  {
    icon: <FiAward />,
    title: 'Leaderboard & Benchmarking',
    description: 'View how companies stack up. Identify the ESG leaders, compare pillar-scores, and spot laggards.',
    color: '#00bb99'
  }
];

const KeyFeatures = () => {
  return (
    <Section>
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Key Features
        </Heading>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              $color={feature.color}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <IconCircle $color={feature.color}>
                {feature.icon}
              </IconCircle>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Container>
    </Section>
  );
};

export default KeyFeatures;
