// src/components/HowItWorks.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiBarChart2, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBgSecondary};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg} 3%;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 400;
  
  span {
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
  margin-top: ${props => props.theme.spacing.md};
`;

const StepCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  padding: 3rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  transition: all 0.4s ease;
  
  &:hover {
    border-color: ${props => props.$color};
    background: rgba(0, 255, 170, 0.08);
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${props => props.$color}30;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: ${props => props.$color}15;
  border: 2px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: ${props => props.$color};
  transition: all 0.3s ease;
  
  ${StepCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 0 30px ${props => props.$color}60;
  }
`;

const StepNumber = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${props => props.$color};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
`;

const steps = [
  {
    icon: <FiSearch />,
    number: 'Step 01',
    title: 'Company Search',
    description: 'Enter any publicly traded company and our system collects relevant news articles and social discussions in minutes.',
    color: '#00ff88'
  },
  {
    icon: <FiBarChart2 />,
    number: 'Step 02',
    title: 'Sentiment Analysis',
    description: 'We classify content into Environmental, Social, Governance categories and measure sentiment across each pillar.',
    color: '#00ddbb'
  },
  {
    icon: <FiTrendingUp />,
    number: 'Step 03',
    title: 'Dual Perspectives',
    description: 'See sentiment from both official media and social buzz — side by side, so you get a complete picture.',
    color: '#00bb99'
  },
  {
    icon: <FiAlertCircle />,
    number: 'Step 04',
    title: 'Actionable Insights',
    description: 'Based on what people are saying, receive suggestions for improvement and flag potential greenwashing or governance risk.',
    color: '#00ffaa'
  }
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
          How <span>ESG-Pulse</span> Works
        </Heading>
        
        <StepsGrid>
          {steps.map((step, index) => (
            <StepCard
              key={index}
              $color={step.color}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <IconWrapper $color={step.color}>
                {step.icon}
              </IconWrapper>
              <StepNumber $color={step.color}>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsGrid>
      </Container>
    </Section>
  );
};

export default HowItWorks;
