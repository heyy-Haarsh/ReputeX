// src/components/LeaderboardPreview.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 5%;
  background: ${props => props.theme.colors.lightBg};
  
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
  color: ${props => props.theme.colors.textDark};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ChartContainer = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.card};
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
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

// TODO: Replace with real API data
const mockData = [
  { company: 'Apple', esg: 85, e: 82, s: 88, g: 85 },
  { company: 'Microsoft', esg: 83, e: 80, s: 86, g: 83 },
  { company: 'Google', esg: 80, e: 78, s: 82, g: 80 },
  { company: 'Infosys', esg: 77, e: 75, s: 79, g: 77 },
  { company: 'Reliance', esg: 72, e: 70, s: 74, g: 72 }
];

const colors = ['#28a745', '#007bff', '#6f42c1', '#00d4ff', '#ffc107'];

const LeaderboardPreview = () => {
  return (
    <Section>
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Top ESG Performers
        </Heading>
        
        <Description>
          See how leading companies stack up today. (Live scores coming soon.)
        </Description>
        
        <ChartContainer
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mockData}>
              <XAxis dataKey="company" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(30, 30, 47, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f7f7f7'
                }}
              />
              <Bar dataKey="esg" radius={[8, 8, 0, 0]}>
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Full Leaderboard
        </CTAButton>
      </Container>
    </Section>
  );
};

export default LeaderboardPreview;
