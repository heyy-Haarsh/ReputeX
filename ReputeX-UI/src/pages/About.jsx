// src/pages/About.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiUsers, FiAward, FiTrendingUp, FiGlobe } from 'react-icons/fi';

const AboutPage = styled.div`
  background: ${props => props.theme.colors.darkBg};
  padding-top: 80px;
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 4rem 5%;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    height: 1000px;
    background: radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }
`;

const HeroContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
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

const HeroSubtitle = styled(motion.p)`
  font-size: 1.4rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

// Story Section
const StorySection = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBgSecondary};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StoryContent = styled(motion.div)`
  h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
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
    line-height: 1.9;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    h2 {
      font-size: 2.5rem;
    }
  }
`;

const StoryVisual = styled(motion.div)`
  width: 100%;
  height: 500px;
  background: rgba(0, 255, 170, 0.05);
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
      transparent
    );
    animation: rotate 10s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const FloatingCard = styled(motion.div)`
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
  box-shadow: 0 0 50px rgba(0, 255, 170, 0.3);
  
  h3 {
    font-size: 2rem;
    color: ${props => props.theme.colors.primaryGreen};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1rem;
  }
`;

// Values Section
const ValuesSection = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBg};
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 4rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ValueCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.$color}15, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-15px);
    border-color: ${props => props.$color};
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 50px ${props => props.$color}40;
    
    &::before {
      opacity: 1;
    }
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: ${props => props.$color}15;
  border: 3px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: ${props => props.$color};
  transition: all 0.3s ease;
  
  ${ValueCard}:hover & {
    transform: scale(1.2) rotate(360deg);
    box-shadow: 0 0 40px ${props => props.$color}80;
  }
`;

const ValueTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  position: relative;
  z-index: 2;
`;

const ValueDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
  position: relative;
  z-index: 2;
`;

// Team Section
const TeamSection = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.darkBgSecondary};
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TeamMember = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.theme.colors.primaryGreen};
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 255, 170, 0.2);
  }
`;

const MemberImage = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, rgba(0, 255, 170, 0.2), rgba(0, 221, 187, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: ${props => props.theme.colors.primaryGreen};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 255, 170, 0.2), transparent);
    animation: pulse 3s ease-in-out infinite;
  }
`;

const MemberInfo = styled.div`
  padding: 2rem;
  text-align: center;
  
  h4 {
    font-size: 1.4rem;
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: ${props => props.theme.colors.primaryGreen};
    margin-bottom: 1rem;
  }
  
  span {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

const values = [
  {
    icon: <FiTarget />,
    title: 'Mission-Driven',
    description: 'We are committed to making ESG data accessible and actionable for everyone.',
    color: '#00ff88'
  },
  {
    icon: <FiEye />,
    title: 'Transparency',
    description: 'Clear, honest reporting backed by real-time data and AI-driven insights.',
    color: '#00ddbb'
  },
  {
    icon: <FiUsers />,
    title: 'Collaboration',
    description: 'Working together with stakeholders to drive meaningful ESG improvements.',
    color: '#00bb99'
  },
  {
    icon: <FiAward />,
    title: 'Excellence',
    description: 'Delivering the highest quality ESG analytics and recommendations.',
    color: '#00ffaa'
  },
  {
    icon: <FiTrendingUp />,
    title: 'Innovation',
    description: 'Pushing boundaries with cutting-edge AI and sentiment analysis technology.',
    color: '#00ff88'
  },
  {
    icon: <FiGlobe />,
    title: 'Global Impact',
    description: 'Creating positive change in corporate sustainability worldwide.',
    color: '#00ddbb'
  }
];

const team = [
  {
    icon: <FiUsers />,
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    bio: 'ESG strategist with 15+ years in sustainability consulting.'
  },
  {
    icon: <FiUsers />,
    name: 'Michael Chen',
    role: 'CTO',
    bio: 'AI/ML expert specializing in sentiment analysis and data science.'
  },
  {
    icon: <FiUsers />,
    name: 'Emily Rodriguez',
    role: 'Head of Research',
    bio: 'Environmental scientist driving our ESG methodology and standards.'
  },
  {
    icon: <FiUsers />,
    name: 'David Park',
    role: 'Lead Engineer',
    bio: 'Full-stack developer building scalable ESG analytics platforms.'
  }
];

const About = () => {
  return (
    <AboutPage>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About ESG-Pulse
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            We're on a mission to revolutionize how companies understand and improve 
            their ESG performance through real-time data, AI-driven insights, and 
            transparent reporting.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Story Section */}
      <StorySection>
        <Container>
          <StoryGrid>
            <StoryContent
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Our <span>Story</span></h2>
              <p>
                Founded in 2024, ESG-Pulse was born from a simple observation: 
                companies need better tools to understand their real ESG reputation, 
                not just what they report.
              </p>
              <p>
                Traditional ESG ratings rely on self-reported data and outdated methodologies. 
                We saw an opportunity to leverage AI, real-time news monitoring, and social 
                sentiment analysis to provide a more accurate, transparent view of corporate 
                ESG performance.
              </p>
              <p>
                Today, we're helping companies worldwide identify ESG risks early, benchmark 
                against competitors, and take meaningful action to improve their sustainability impact.
              </p>
            </StoryContent>
            
            <StoryVisual
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <FloatingCard
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <h3>2024</h3>
                <p>Founded with a vision to transform ESG analytics</p>
              </FloatingCard>
            </StoryVisual>
          </StoryGrid>
        </Container>
      </StorySection>

      {/* Values Section */}
      <ValuesSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Values
          </SectionTitle>
          
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard
                key={index}
                $color={value.color}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ValueIcon $color={value.color}>
                  {value.icon}
                </ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Container>
      </ValuesSection>

      {/* Team Section */}
      <TeamSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Team
          </SectionTitle>
          
          <TeamGrid>
            {team.map((member, index) => (
              <TeamMember
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <MemberImage>
                  {member.icon}
                </MemberImage>
                <MemberInfo>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <span>{member.bio}</span>
                </MemberInfo>
              </TeamMember>
            ))}
          </TeamGrid>
        </Container>
      </TeamSection>
    </AboutPage>
  );
};

export default About;
