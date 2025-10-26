// src/components/HowItWorks.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiCpu, FiPieChart, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: 1200px;
    background: radial-gradient(circle, rgba(0, 255, 170, 0.1) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  
  span {
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto 4rem;
  line-height: 1.8;
`;

const ProcessFlow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StepCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  transition: all 0.4s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -2rem;
    transform: translateY(-50%);
    width: 2rem;
    height: 2px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primaryGreen}, transparent);
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      display: none;
    }
  }
  
  &:last-child::after {
    display: none;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.$color};
    background: rgba(0, 255, 170, 0.08);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${props => props.$color}40;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: ${props => props.$color}20;
  border: 3px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.$color};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid ${props => props.$color};
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  @keyframes ping {
    75%, 100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
  
  ${StepCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 0 30px ${props => props.$color}80;
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${props => props.$color};
  margin-bottom: 1.5rem;
  
  svg {
    filter: drop-shadow(0 0 10px ${props => props.$color}60);
  }
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
`;

const FeatureShowcase = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ShowcaseContent = styled(motion.div)`
  h3 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.textPrimary};
    
    span {
      background: ${props => props.theme.colors.gradientPrimary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 2rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FeatureItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 170, 0.05);
  border-left: 3px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.sm};
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primaryGreen};
    flex-shrink: 0;
  }
  
  span {
    color: ${props => props.theme.colors.textPrimary};
    font-size: 1rem;
  }
  
  &:hover {
    background: rgba(0, 255, 170, 0.1);
    transform: translateX(10px);
  }
`;

const ShowcaseVisual = styled(motion.div)`
  width: 100%;
  height: 500px;
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(0, 255, 170, 0.2),
      transparent,
      rgba(0, 221, 187, 0.2),
      transparent
    );
    animation: rotate 15s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const AnimatedChart = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 300px;
  height: 300px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 60px rgba(0, 255, 170, 0.4);
  
  h4 {
    font-size: 4rem;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 0.5rem;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 1.2rem 3rem;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;
  
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
    box-shadow: ${props => props.theme.shadows.glowStrong};
    border-color: transparent;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const steps = [
  {
    icon: <FiSearch />,
    number: '01',
    title: 'Data Collection',
    description: 'Fetch real-time news and social media data from multiple sources',
    color: '#00ff88'
  },
  {
    icon: <FiCpu />,
    title: 'AI Analysis',
    number: '02',
    description: 'Classify content using advanced NLP and sentiment analysis models',
    color: '#00ddbb'
  },
  {
    icon: <FiPieChart />,
    number: '03',
    title: 'ESG Scoring',
    description: 'Calculate comprehensive scores for Environmental, Social, Governance',
    color: '#00bb99'
  },
  {
    icon: <FiCheckCircle />,
    number: '04',
    title: 'Insights',
    description: 'Generate actionable recommendations and detect greenwashing',
    color: '#00ffaa'
  }
];

const features = [
  'Multi-source data aggregation (News + Social)',
  'AI-powered sentiment classification',
  'Real-time ESG score calculation',
  'Greenwashing detection algorithms',
  'Historical trend analysis'
];

const HowItWorks = () => {
  return (
    <Section>
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How <span>ReputeX</span> Works
        </Heading>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Our AI-powered platform analyzes thousands of data points to deliver 
          real-time ESG insights you can trust
        </Subtitle>
        
        <ProcessFlow>
          {steps.map((step, index) => (
            <StepCard
              key={index}
              $color={step.color}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <StepNumber $color={step.color}>{step.number}</StepNumber>
              <IconWrapper $color={step.color}>
                {step.icon}
              </IconWrapper>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </ProcessFlow>
        
        <FeatureShowcase>
          <ShowcaseContent
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3>
              <span>Real-Time</span> ESG Intelligence
            </h3>
            <p>
              Our flagship feature combines cutting-edge AI with comprehensive data 
              sources to deliver instant, accurate ESG reputation analysis for any 
              publicly traded company.
            </p>
            
            <FeatureList>
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <FiCheckCircle />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try ESG Tracker
              <FiArrowRight />
            </CTAButton>
          </ShowcaseContent>
          
          <ShowcaseVisual
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedChart
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <h4>85</h4>
              <p>ESG Score</p>
            </AnimatedChart>
          </ShowcaseVisual>
        </FeatureShowcase>
      </Container>
    </Section>
  );
};

export default HowItWorks;
