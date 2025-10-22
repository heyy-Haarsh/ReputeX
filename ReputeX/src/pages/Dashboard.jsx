// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiLoader, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const DashboardPage = styled.div`
  background: ${props => props.theme.colors.darkBg};
  min-height: 100vh;
  padding-top: 80px;
`;

// Hero Section
const HeroSection = styled.section`
  padding: 4rem 5%;
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
    background: radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

// Search Section
const SearchSection = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 4rem;
  position: relative;
  z-index: 3;
`;

const SearchContainer = styled.div`
  position: relative;
  background: rgba(0, 255, 170, 0.05);
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 0.5rem;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${props => props.theme.colors.primaryGreen};
    box-shadow: 0 0 30px rgba(0, 255, 170, 0.3);
    background: rgba(0, 255, 170, 0.1);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 5rem 1.5rem 2rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.3rem;
  outline: none;
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    padding: 1.2rem 4rem 1.2rem 1.5rem;
  }
`;

const SearchButton = styled(motion.button)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.gradientButton};
  color: ${props => props.theme.colors.darkBg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const LoadingSpinner = styled(motion.div)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 4rem 5%;
  background: ${props => props.theme.colors.darkBgSecondary};
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.$color};
    background: rgba(0, 255, 170, 0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px ${props => props.$color}40;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: ${props => props.$color}15;
  border: 3px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: ${props => props.$color};
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.2) rotate(360deg);
    box-shadow: 0 0 40px ${props => props.$color}80;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
`;

// Results Section
const ResultsSection = styled(motion.section)`
  padding: 4rem 5%;
  max-width: 1400px;
  margin: 0 auto;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ScoreOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
`;

const ScoreCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.$color};
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px ${props => props.$color}40;
  }
`;

const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
`;

const ScoreLabel = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.$color};
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const ErrorMessage = styled(motion.div)`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: #ff6b6b;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const features = [
  {
    icon: <FiSearch />,
    title: 'Real-Time Data Collection',
    description: 'Automatically fetches latest news and social media discussions about any company.',
    color: '#00ff88'
  },
  {
    icon: <FiTrendingUp />,
    title: 'AI-Powered Classification',
    description: 'Advanced AI classifies content into Environmental, Social, and Governance categories.',
    color: '#00ddbb'
  },
  {
    icon: <FiAlertCircle />,
    title: 'Sentiment Analysis',
    description: 'Analyzes public sentiment to calculate accurate ESG scores for each pillar.',
    color: '#00bb99'
  },
  {
    icon: <FiCheckCircle />,
    title: 'Comprehensive Scoring',
    description: 'Combines all factors to generate an overall ESG reputation score.',
    color: '#00ffaa'
  }
];

const Dashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      setError('Please enter a company name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Call your Python backend API
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: companyName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ESG data');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#00ddbb';
    if (score >= 40) return '#ffc107';
    return '#ff6b6b';
  };

  const radarData = results ? [
    { subject: 'Environmental', score: results.environmental_score, fullMark: 100 },
    { subject: 'Social', score: results.social_score, fullMark: 100 },
    { subject: 'Governance', score: results.governance_score, fullMark: 100 }
  ] : [];

  const barData = results ? [
    { name: 'Environmental', score: results.environmental_score },
    { name: 'Social', score: results.social_score },
    { name: 'Governance', score: results.governance_score }
  ] : [];

  return (
    <DashboardPage>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ESG Reputation Tracker
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Analyze any company's Environmental, Social, and Governance performance 
            in real-time using AI-powered sentiment analysis from news and social media.
          </HeroSubtitle>

          {/* Search Bar */}
          <SearchSection
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <form onSubmit={handleSearch}>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Enter company name (e.g., Tesla, Apple, Microsoft)..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
                <SearchButton
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner><FiLoader /></LoadingSpinner>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FiSearch />
                      Analyze
                    </>
                  )}
                </SearchButton>
              </SearchContainer>
            </form>
          </SearchSection>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      {!results && !loading && (
        <FeaturesSection>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                $color={feature.color}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <FeatureIcon $color={feature.color}>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <FiXCircle />
            <h3>Error</h3>
            <p>{error}</p>
          </ErrorMessage>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <ResultsSection
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <ResultsHeader>
              <h2>ESG Analysis Results for {results.company}</h2>
              <p>Generated on {new Date().toLocaleDateString()}</p>
            </ResultsHeader>

            {/* Score Overview */}
            <ScoreOverview>
              <ScoreCard
                $color={getScoreColor(results.esg_score)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <ScoreCircle>
                  <CircularProgressbar
                    value={results.esg_score}
                    text={`${results.esg_score}`}
                    styles={buildStyles({
                      textColor: getScoreColor(results.esg_score),
                      pathColor: getScoreColor(results.esg_score),
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                      textSize: '24px',
                    })}
                  />
                </ScoreCircle>
                <ScoreLabel>Overall ESG Score</ScoreLabel>
                <ScoreValue $color={getScoreColor(results.esg_score)}>
                  {results.esg_score}/100
                </ScoreValue>
              </ScoreCard>

              <ScoreCard
                $color="#00ff88"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <ScoreCircle>
                  <CircularProgressbar
                    value={results.environmental_score}
                    text={`${results.environmental_score}`}
                    styles={buildStyles({
                      textColor: '#00ff88',
                      pathColor: '#00ff88',
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                      textSize: '24px',
                    })}
                  />
                </ScoreCircle>
                <ScoreLabel>Environmental</ScoreLabel>
                <ScoreValue $color="#00ff88">
                  {results.environmental_score}/100
                </ScoreValue>
              </ScoreCard>

              <ScoreCard
                $color="#00ddbb"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <ScoreCircle>
                  <CircularProgressbar
                    value={results.social_score}
                    text={`${results.social_score}`}
                    styles={buildStyles({
                      textColor: '#00ddbb',
                      pathColor: '#00ddbb',
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                      textSize: '24px',
                    })}
                  />
                </ScoreCircle>
                <ScoreLabel>Social</ScoreLabel>
                <ScoreValue $color="#00ddbb">
                  {results.social_score}/100
                </ScoreValue>
              </ScoreCard>

              <ScoreCard
                $color="#00bb99"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <ScoreCircle>
                  <CircularProgressbar
                    value={results.governance_score}
                    text={`${results.governance_score}`}
                    styles={buildStyles({
                      textColor: '#00bb99',
                      pathColor: '#00bb99',
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                      textSize: '24px',
                    })}
                  />
                </ScoreCircle>
                <ScoreLabel>Governance</ScoreLabel>
                <ScoreValue $color="#00bb99">
                  {results.governance_score}/100
                </ScoreValue>
              </ScoreCard>
            </ScoreOverview>

            {/* Charts */}
            <ChartsSection>
              <ChartCard
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h3>ESG Pillars Comparison</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255, 255, 255, 0.5)"
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                    />
                    <YAxis 
                      stroke="rgba(255, 255, 255, 0.5)"
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
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      <Cell fill="#00ff88" />
                      <Cell fill="#00ddbb" />
                      <Cell fill="#00bb99" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h3>ESG Performance Radar</h3>
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
                      dataKey="score" 
                      stroke="#00ffaa" 
                      fill="#00ffaa" 
                      fillOpacity={0.4}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
            </ChartsSection>
          </ResultsSection>
        )}
      </AnimatePresence>
    </DashboardPage>
  );
};

export default Dashboard;
