// src/components/LeaderboardPreview.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FiTrendingUp, FiAward, FiArrowRight } from 'react-icons/fi';

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
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 70%);
    animation: pulse 6s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg} 3%;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const ToggleButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: ${props => props.$active ? props.theme.colors.gradientButton : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.darkBg : props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => !props.$active && 'rgba(0, 255, 170, 0.1)'};
  }
`;

const ChartWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primaryGreen};
    box-shadow: 0 20px 80px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 255, 170, 0.2);
    transform: translateY(-5px);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  svg {
    color: ${props => props.theme.colors.primaryGreen};
  }
`;

const LeaderboardTable = styled.div`
  margin-top: 3rem;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px 100px;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem 2rem;
  background: ${props => props.$isHeader ? 'rgba(0, 255, 170, 0.1)' : 'rgba(0, 255, 170, 0.03)'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => !props.$isHeader && 'rgba(0, 255, 170, 0.08)'};
    border-color: ${props => !props.$isHeader && props.theme.colors.primaryGreen};
    transform: ${props => !props.$isHeader && 'translateX(10px)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 60px 1fr 80px;
    gap: 1rem;
    padding: 1rem;
  }
`;

const RankBadge = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.$rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 
                         props.$rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #808080)' :
                         props.$rank === 3 ? 'linear-gradient(135deg, #CD7F32, #8B4513)' :
                         props.theme.colors.gradientButton};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.darkBg};
  box-shadow: 0 0 20px ${props => props.$rank <= 3 ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 255, 170, 0.5)'};
`;

const CompanyName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const Score = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.$score >= 80 ? '#00ff88' : 
                    props.$score >= 60 ? '#00ddbb' : 
                    '#ffc107'};
  text-align: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.$hideOnMobile && 'none'};
  }
`;

const CTAButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 3rem auto 0;
  padding: 1.2rem 3rem;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
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
    box-shadow: ${props => props.theme.shadows.glow};
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const mockData = [
  { rank: 1, company: 'Apple', esg: 88, e: 85, s: 90, g: 89 },
  { rank: 2, company: 'Microsoft', esg: 85, e: 83, s: 87, g: 85 },
  { rank: 3, company: 'Google', esg: 82, e: 80, s: 84, g: 82 },
  { rank: 4, company: 'Infosys', esg: 78, e: 76, s: 80, g: 78 },
  { rank: 5, company: 'Reliance', esg: 74, e: 72, s: 76, g: 74 }
];

const radarData = mockData.map(item => ({
  subject: item.company,
  A: item.e,
  fullMark: 100
}));

const Leaderboard= () => {
  const [view, setView] = useState('chart');

  return (
    <Section>
      <Container>
        <Header>
          <Heading
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Top ESG Performers
          </Heading>
          
          <Description>
            See how leading companies stack up today. Real-time scores powered by AI analysis.
          </Description>
        </Header>
        
        <ViewToggle>
          <ToggleButton
            $active={view === 'chart'}
            onClick={() => setView('chart')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Chart View
          </ToggleButton>
          <ToggleButton
            $active={view === 'table'}
            onClick={() => setView('table')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Table View
          </ToggleButton>
        </ViewToggle>
        
        <AnimatePresence mode="wait">
          {view === 'chart' ? (
            <ChartWrapper
              key="charts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ChartCard
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ChartTitle>
                  <FiTrendingUp />
                  Overall ESG Scores
                </ChartTitle>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={mockData}>
                    <XAxis 
                      dataKey="company" 
                      stroke={`rgba(255, 255, 255, 0.5)`}
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                    />
                    <YAxis 
                      stroke={`rgba(255, 255, 255, 0.5)`}
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgba(0, 255, 170, 0.3)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="esg" radius={[8, 8, 0, 0]}>
                      {mockData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient${index})`}
                        />
                      ))}
                    </Bar>
                    <defs>
                      {mockData.map((entry, index) => (
                        <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00ffaa" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#00bb99" stopOpacity={0.3}/>
                        </linearGradient>
                      ))}
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ChartTitle>
                  <FiAward />
                  ESG Pillar Comparison
                </ChartTitle>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(0, 255, 170, 0.2)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      stroke="rgba(255, 255, 255, 0.7)"
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                    />
                    <PolarRadiusAxis 
                      stroke="rgba(255, 255, 255, 0.3)"
                      tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                    />
                    <Radar 
                      name="ESG Score" 
                      dataKey="A" 
                      stroke="#00ffaa" 
                      fill="#00ffaa" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
            </ChartWrapper>
          ) : (
            <LeaderboardTable
              key="table"
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <TableRow $isHeader>
                <div style={{ textAlign: 'center', fontWeight: 700 }}>Rank</div>
                <div style={{ fontWeight: 700 }}>Company</div>
                <div style={{ textAlign: 'center', fontWeight: 700 }}>ESG</div>
                <Score style={{ fontWeight: 700 }} $hideOnMobile>E</Score>
                <Score style={{ fontWeight: 700 }} $hideOnMobile>S</Score>
                <Score style={{ fontWeight: 700 }} $hideOnMobile>G</Score>
              </TableRow>
              
              {mockData.map((company, index) => (
                <TableRow
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <RankBadge $rank={company.rank}>
                    {company.rank}
                  </RankBadge>
                  <CompanyName>{company.company}</CompanyName>
                  <Score $score={company.esg}>{company.esg}</Score>
                  <Score $score={company.e} $hideOnMobile>{company.e}</Score>
                  <Score $score={company.s} $hideOnMobile>{company.s}</Score>
                  <Score $score={company.g} $hideOnMobile>{company.g}</Score>
                </TableRow>
              ))}
            </LeaderboardTable>
          )}
        </AnimatePresence>
        
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Full Leaderboard
          <FiArrowRight />
        </CTAButton>
      </Container>
    </Section>
  );
};

export default Leaderboard;
