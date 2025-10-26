// src/components/MainFeatures.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShield, FiFileText, FiArrowRight, FiActivity, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBgSecondary};
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto 5rem;
  line-height: 1.8;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 3rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.$color}10, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-15px);
    border-color: ${props => props.$color};
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5), 0 0 60px ${props => props.$color}40;
    
    &::before {
      opacity: 1;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.$color}15;
  border: 3px solid ${props => props.$color};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: ${props => props.$color};
  position: relative;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: ${props => props.theme.borderRadius.lg};
    border: 3px solid ${props => props.$color};
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  @keyframes ping {
    75%, 100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 40px ${props => props.$color}80;
  }
`;

const BadgeNew = styled.span`
  padding: 0.4rem 0.8rem;
  background: ${props => props.$color};
  color: ${props => props.theme.colors.darkBg};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
`;

const FeatureTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  
  svg {
    font-size: 1.2rem;
    color: ${props => props.$color};
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
`;

const LearnMoreButton = styled(motion.button)`
  width: 100%;
  padding: 1rem 2rem;
  background: transparent;
  color: ${props => props.$color};
  border: 2px solid ${props => props.$color};
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
    background: ${props => props.$color};
    transition: left 0.3s ease;
    z-index: -1;
  }
  
  &:hover::before {
    left: 0;
  }
  
  &:hover {
    color: ${props => props.theme.colors.darkBg};
    border-color: transparent;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const features = [
  {
    icon: <FiTrendingUp />,
    title: 'Real-Time ESG Tracker',
    description: 'Monitor company ESG performance with AI-powered analysis of news and social sentiment across Environmental, Social, and Governance dimensions.',
    color: '#00ff88',
    badge: 'Core Feature',
    items: [
      'Multi-source data aggregation',
      'AI sentiment classification',
      'Real-time score updates',
      'Historical trend analysis',
      'Peer benchmarking'
    ],
    path: '/dashboard'
  },
  {
    icon: <FiShield />,
    title: 'Greenwash Detector',
    description: 'Detect misleading ESG claims and verify corporate sustainability reports with advanced NLP analysis to identify vague language and unsubstantiated claims.',
    color: '#00ddbb',
    badge: 'New',
    items: [
      'PDF report analysis',
      'Credibility scoring',
      'Flag vague statements',
      'Evidence verification',
      'Compliance checking'
    ],
    path: '/greenwash-detector'
  },
  {
    icon: <FiFileText />,
    title: 'ESG Self-Reporting Engine',
    description: 'Generate comprehensive ESG compliance reports aligned with global standards. Streamline your reporting process with AI-assisted documentation.',
    color: '#00bb99',
    badge: 'Pro',
    items: [
      'Standards-compliant templates',
      'Auto-generate reports',
      'Data validation',
      'Export to multiple formats',
      'Audit trail tracking'
    ],
    path: '/self-reporting'
  }
];

const MainFeatures = () => {
  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Core Features
        </Heading>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Three powerful tools to help you navigate the complex world of ESG compliance 
          and reputation management
        </Subtitle>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              $color={feature.color}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <IconWrapper $color={feature.color}>
                  {feature.icon}
                </IconWrapper>
                <BadgeNew $color={feature.color}>
                  {feature.badge}
                </BadgeNew>
              </CardHeader>
              
              <CardContent>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                
                <FeatureList>
                  {feature.items.map((item, idx) => (
                    <ListItem key={idx} $color={feature.color}>
                      <FiCheckCircle />
                      {item}
                    </ListItem>
                  ))}
                </FeatureList>
                
                <LearnMoreButton
                  $color={feature.color}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Feature
                  <FiArrowRight />
                </LearnMoreButton>
              </CardContent>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Container>
    </Section>
  );
};

export default MainFeatures;
