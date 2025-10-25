// src/components/Benefits.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContentSide = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Heading = styled.h2`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 400;
  color: ${props => props.theme.colors.textPrimary};
  
  span {
    display: block;
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

const BenefitsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BenefitItem = styled(motion.li)`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(0, 255, 170, 0.03);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 170, 0.08);
    border-color: ${props => props.theme.colors.primaryGreen};
    transform: translateX(10px);
  }
`;

const CheckIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.primaryGreen};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.darkBg};
  font-size: 1.2rem;
  box-shadow: 0 0 20px ${props => props.theme.colors.primaryGreen}60;
`;

const BenefitText = styled.div`
  flex: 1;
  
  h4 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.textPrimary};
    font-weight: 600;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.7;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const VisualSide = styled(motion.div)`
  width: 100%;
  height: 500px;
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(10px);
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
    background: radial-gradient(circle, rgba(0, 255, 170, 0.1) 0%, transparent 50%);
    animation: rotate 10s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const PlaceholderText = styled.div`
  position: relative;
  z-index: 2;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const benefits = [
  {
    title: 'Early Warning Signals',
    description: 'Spot issues before they become headlines — protect investments, reputation and compliance.'
  },
  {
    title: 'Transparent Decision-Making',
    description: 'Get data-driven ESG scores built on what people are actually saying, not just what companies claim.'
  },
  {
    title: 'Competitive Advantage',
    description: 'Benchmark against peers and set targeted improvement initiatives to stand out in the ESG landscape.'
  }
];

const Benefits = () => {
  return (
    <Section>
      <Container>
        <ContentSide
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Heading>
            Why This <span>Matters</span>
          </Heading>
          
          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitItem
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <CheckIcon>
                  <FiCheckCircle />
                </CheckIcon>
                <BenefitText>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </BenefitText>
              </BenefitItem>
            ))}
          </BenefitsList>
        </ContentSide>
        
        <VisualSide
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <PlaceholderText>
            Dashboard Visualization<br/>Coming Soon
          </PlaceholderText>
        </VisualSide>
      </Container>
    </Section>
  );
};

export default Benefits;
