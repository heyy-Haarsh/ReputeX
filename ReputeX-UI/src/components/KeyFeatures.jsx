// src/components/KeyFeatures.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CardSpotlight } from '../components/aceternity/CardSpotlight';
import { FiGlobe, FiMessageSquare, FiAward } from 'react-icons/fi';

// Styled components
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
    background: radial-gradient(circle, rgba(0, 255, 170, 0.08) 0%, transparent 80%);
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

const IconCircle = styled.div`
  width: 86px;
  height: 86px;
  margin: 0 auto 2rem;
  background: ${props => props.$color}15;
  border: 2.5px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: ${props => props.$color};
  transition: all 0.3s cubic-bezier(.6,-0.1,.9,1.2);

  ${CardSpotlight}:hover & {
    transform: scale(1.1) rotate(7deg);
    box-shadow: 0 0 38px ${props => props.$color}88;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.55rem;
  margin-bottom: 0.6rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
`;

// Features for KEY features grid
const features = [
  {
    icon: <FiGlobe />,
    title: 'News & Media Monitoring',
    description: 'Automatically pull real-time news covering ESG topics and classify them for you.',
    color: '#00ff88',
  },
  {
    icon: <FiMessageSquare />,
    title: 'Social Sentiment Feed',
    description: 'Tap into Reddit and other social sources to capture employee and public perception, unfiltered and immediate.',
    color: '#00ddbb',
  },
  {
    icon: <FiAward />,
    title: 'Leaderboard & Benchmarking',
    description: 'View how companies stack up. Identify the ESG leaders, compare pillar-scores, and spot laggards.',
    color: '#00bb99',
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
            <CardSpotlight
              key={index}
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.14, duration: 0.65 }}
              style={{ cursor: "default" }}
            >
              <IconCircle $color={feature.color}>
                {feature.icon}
              </IconCircle>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>
                {feature.description}
              </FeatureDescription>
            </CardSpotlight>
          ))}
        </FeaturesGrid>
      </Container>
    </Section>
  );
};

export default KeyFeatures;
