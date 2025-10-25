// src/components/SuggestionsPreview.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { MdNature } from 'react-icons/md';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBg};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg} 3%;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Heading = styled(motion.h2)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.colors.gradientESG};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.md};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SuggestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.$borderColor};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.glass};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    border-color: ${props => props.$borderColor};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const RiskLabel = styled.div`
  flex: 1;
  
  h4 {
    font-size: 1.3rem;
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 0.3rem;
  }
  
  span {
    font-size: 0.85rem;
    color: ${props => props.$color};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const Issue = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const Recommendation = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid ${props => props.$color};
  border-radius: 4px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.textPrimary};
`;

const CTAButton = styled(motion.button)`
  display: block;
  margin: 0 auto;
  padding: 1rem 2.5rem;
  background: ${props => props.theme.colors.gradientESG};
  color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: ${props => props.theme.shadows.card};
`;

const suggestions = [
  {
    icon: <FiAlertTriangle />,
    risk: 'Social Risk Detected',
    color: '#007bff',
    issue: 'Recent employee discussions show negative sentiment about workplace culture.',
    recommendation: 'Focus on employee onboarding, transparent communication, and public community initiatives.'
  },
  {
    icon: <MdNature />,
    risk: 'Environmental Concern',
    color: '#28a745',
    issue: 'News highlights show increased regulatory scrutiny on emissions.',
    recommendation: 'Enhance public reporting on carbon-intensity and invest in cleaner technologies.'
  }
];

const SuggestionsPreview = () => {
  return (
    <Section>
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Tailored Improvement Suggestions
        </Heading>
        
        <Description>
          Based on real-time sentiment, we surface the most-critical ESG areas for your company 
          — and recommend meaningful next steps.
        </Description>
        
        <SuggestionsGrid>
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={index}
              $borderColor={suggestion.color}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <CardHeader>
                <IconWrapper $color={suggestion.color}>
                  {suggestion.icon}
                </IconWrapper>
                <RiskLabel $color={suggestion.color}>
                  <h4>{suggestion.risk}</h4>
                  <span>Detected</span>
                </RiskLabel>
              </CardHeader>
              
              <Issue>{suggestion.issue}</Issue>
              
              <Recommendation $color={suggestion.color}>
                <strong>→</strong> {suggestion.recommendation}
              </Recommendation>
            </SuggestionCard>
          ))}
        </SuggestionsGrid>
        
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Detailed Recommendations
        </CTAButton>
      </Container>
    </Section>
  );
};

export default SuggestionsPreview;
