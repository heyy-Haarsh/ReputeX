// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// Use FiAlertTriangle for risks, FiInfo for tooltips
import { FiSearch, FiLoader, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { theme } from '../theme.js'; // <-- FIX: Assumes theme.js is at src/theme.js

// --- STYLED COMPONENTS (Includes RiskAreaSection & Heatmap) ---
const DashboardPage = styled.div`
  background: ${props => props.theme.colors.darkBg};
  min-height: 100vh;
  padding-top: 80px; /* Adjust if navbar height is different */
`;
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
  position: relative; /* Added for tooltip positioning */

  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.$color};
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px ${props => props.$color}40;
  }
`;

// Tooltip styles
const TooltipIcon = styled(FiInfo)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: help;

  &:hover + span {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 250px;
  background-color: #333;
  color: #fff;
  text-align: left;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 10px;
  position: absolute;
  z-index: 10;
  bottom: 125%; /* Position above the icon */
  left: 50%;
  margin-left: -125px; /* Center the tooltip */
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.9rem;
  line-height: 1.4;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
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
  margin-bottom: 4rem;

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
const FeedsSection = styled.div`
  margin-top: 4rem;
  margin-bottom: 4rem; /* Added margin */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ModuleCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem 2rem;
  max-height: 600px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${props => props.theme.colors.border}; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: ${props => props.theme.colors.primaryGreen}80; }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.textPrimary};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 0.8rem;
    position: sticky;
    top: -1.5rem;
    background: rgba(17, 17, 17, 0.95); /* Adjust background for sticky header */
    padding-top: 1.5rem;
    z-index: 5;
  }
`;

const FeedItem = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderFaint};

  &:last-child { border-bottom: none; margin-bottom: 0; }

  p { color: ${props => props.theme.colors.textSecondary}; margin-bottom: 0.5rem; line-height: 1.6; }
  p strong { color: ${props => props.theme.colors.textPrimary}; }
  small { color: ${props => props.theme.colors.textMuted}; font-size: 0.9em; }
  i { color: #aaa; } /* Explanation style */
  a { color: ${props => props.theme.colors.primaryGreen}; text-decoration: none; font-weight: 600; font-size: 0.9em; word-break: break-all; &:hover { text-decoration: underline; } }
`;

const RiskAreaSection = styled(motion.div)`
  margin-top: 4rem;
  background: rgba(255, 170, 0, 0.05); /* Orange hint for risk */
  border: 1px solid ${props => props.theme.colors.border};
  border-left: 5px solid #ffc107; /* Orange accent */
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 0.75rem;
    svg { color: #ffc107; flex-shrink: 0; } /* Orange icon */
  }

  ul { list-style: none; padding-left: 0; }
  li {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
    &:last-child { margin-bottom: 0; }
    &::before {
       content: '⚠️'; /* Warning emoji */
       display: inline-block;
       position: absolute;
       left: 0;
       top: 2px;
       font-size: 1rem;
    }
  }
`;

// --- NEW STYLED COMPONENTS FOR HEATMAP ---
const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const HeatmapCell = styled(motion.div)`
  background: ${props => props.$riskColor}20; /* Use risk color with low opacity */
  border: 1px solid ${props => props.$riskColor}80; /* Border with medium opacity */
  border-radius: ${props => props.theme.borderRadius.md}; /* Use theme border radius */
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px ${props => props.$riskColor}30;
  }
`;

const HeatmapLabel = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeatmapValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$riskColor};
  margin: 0;
`;

const HeatmapHeader = styled.h4`
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.theme.colors.textPrimary};
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    opacity: 0.5;
    text-align: left; /* Align section headers */
    padding-top: 1rem; /* Add space between sections */
`;
// --- END STYLED COMPONENTS ---


const features = [
  { icon: <FiSearch />, title: 'Real-Time Data', description: 'Fetches latest news & Reddit discussions.', color: '#00ff88' },
  { icon: <FiTrendingUp />, title: 'AI Classification', description: 'Classifies content into E, S, G categories.', color: '#00ddbb' },
  { icon: <FiAlertCircle />, title: 'Sentiment Analysis', description: 'Analyzes public sentiment for scores.', color: '#00bb99' },
  { icon: <FiCheckCircle />, title: 'Overall Scoring', description: 'Generates overall ESG reputation score.', color: '#00ffaa' }
];

// --- === MAIN COMPONENT WRAPPER === ---
const DashboardPageWrapper = () => {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  )
}

// --- === MAIN COMPONENT === ---
const Dashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // --- handleSearch function (no changes needed) ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) { setError('Please enter a company name'); setResults(null); return; }
    setLoading(true); setError(null); setResults(null);
    const apiUrl = `http://localhost:8000/api/analyze?company=${encodeURIComponent(companyName)}`;
    try {
      console.log(`Fetching: ${apiUrl}`);
      const response = await fetch(apiUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
      console.log(`Response Status: ${response.status}`);
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try { const errorData = await response.json(); errorMsg = errorData.message || errorData.detail || errorMsg; }
        catch (jsonError) { errorMsg = response.statusText || errorMsg; }
        throw new Error(errorMsg);
      }
      const data = await response.json(); console.log("Data received:", data);
      if (data.error) { throw new Error(data.message || data.error); }
      setResults(data);
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError(err.message || 'Failed to fetch ESG data. Is the backend server running?');
    } finally { setLoading(false); }
  };
  // --- END handleSearch function ---


  // --- Helper functions (Updated getScoreValue to use 50 default for "N/A") ---
  const getScoreValue = (score) => {
    // Return 50 if "N/A" for visual consistency in progress bars/charts
    return (score === "N/A" || score === null || score === undefined) ? 50 : Number(score);
  };
  const getScoreColor = (scoreValue) => {
    // Use the ORIGINAL score value ("N/A" or number) for color logic
    if (scoreValue === "N/A") return 'grey'; // Specific color for N/A display
    const numericScore = Number(scoreValue); // Convert potential number string
    if (numericScore >= 75) return '#00ff88'; // Bright Green
    if (numericScore >= 50) return '#00ddbb'; // Teal
    if (numericScore >= 25) return '#ffc107'; // Yellow/Orange
    return '#ff6b6b'; // Red
  };
   // --- End helper functions ---


  // --- Data preparation for charts (Use getChartScoreValue which maps N/A to 0) ---
   const getChartScoreValue = (score) => {
     // Return 0 if N/A for chart calculations
     return (score === "N/A" || score === null || score === undefined) ? 0 : Number(score);
   };
  const overallScoreValueForChart = results ? getChartScoreValue(results.overall_score) : 0;
  const envScoreValueForChart = results?.scores ? getChartScoreValue(results.scores.environmental) : 0;
  const socScoreValueForChart = results?.scores ? getChartScoreValue(results.scores.social) : 0;
  const govScoreValueForChart = results?.scores ? getChartScoreValue(results.scores.governance) : 0;

  const radarData = results ? [
    { subject: 'Environmental', score: envScoreValueForChart, fullMark: 100 },
    { subject: 'Social', score: socScoreValueForChart, fullMark: 100 },
    { subject: 'Governance', score: govScoreValueForChart, fullMark: 100 }
  ] : [];
  const barData = results ? [
    { name: 'Env.', score: envScoreValueForChart },
    { name: 'Soc.', score: socScoreValueForChart },
    { name: 'Gov.', score: govScoreValueForChart }
  ] : [];
  // --- End data preparation ---

  // --- NEW: Helper function and data for Heatmap ---
  const getRiskColor = (score) => {
    // Risk score is 0 or low
    if (!score || score < 1.0) return '#00ddbb'; // Low risk (Teal)
    // Medium risk
    if (score < 3.0) return '#ffc107'; // Medium risk (Yellow)
    // High risk
    return '#ff6b6b'; // High risk (Red)
  };
  
  const heatmapCategories = {
    Environmental: ["Climate & Emissions", "Waste & Pollution", "Resources & Biodiversity"],
    Social: ["Labor & Safety", "Diversity & Inclusion", "Product & Data"],
    Governance: ["Ethics & Compliance", "Board & Executive", "Transparency & Reporting"]
  };
  // --- END NEW Heatmap helpers ---


  return (
    <DashboardPage>
      {/* Hero Section (Keep as is) */}
      <HeroSection>
        <HeroContent>
           <HeroTitle initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             ReputeX ESG Tracker
           </HeroTitle>
           <HeroSubtitle initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
             Analyze any company's Environmental, Social, and Governance performance
             in real-time using AI-powered analysis from news and social media.
           </HeroSubtitle>
          <SearchSection initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} >
            <form onSubmit={handleSearch}>
               <SearchContainer>
                 <SearchInput
                   type="text"
                   placeholder="Enter company name (e.g., Tesla, Apple, Tata)..."
                   value={companyName}
                   onChange={(e) => setCompanyName(e.target.value)}
                   disabled={loading}
                 />
                 <SearchButton type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
                   {loading ? ( <><LoadingSpinner><FiLoader /></LoadingSpinner>Analyzing...</> ) : ( <><FiSearch />Analyze</> )}
                 </SearchButton>
               </SearchContainer>
            </form>
          </SearchSection>
        </HeroContent>
      </HeroSection>

      {/* Features Section (Keep as is) */}
      {!results && !loading && !error && (
         <FeaturesSection>
             <FeaturesGrid>
                 {features.map((feature, index) => (
                     <FeatureCard
                       key={index} $color={feature.color}
                       initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.6 }}
                     >
                       <FeatureIcon $color={feature.color}>{feature.icon}</FeatureIcon>
                       <FeatureTitle>{feature.title}</FeatureTitle>
                       <FeatureDescription>{feature.description}</FeatureDescription>
                     </FeatureCard>
                 ))}
             </FeaturesGrid>
         </FeaturesSection>
      )}

      {/* Error Message (Keep as is) */}
      <AnimatePresence>
        {error && (
            <ErrorMessage initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <FiXCircle />
                <h3>Error Analyzing Company</h3>
                <p>{error}</p>
            </ErrorMessage>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {results && !error && (
          <ResultsSection initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.8 }}>
            <ResultsHeader>
              <h2>ESG Analysis: {results.company_name}</h2>
              <p>Analysis based on data fetched on {new Date().toLocaleDateString()}</p>
            </ResultsHeader>

            {/* Score Overview */}
            <ScoreOverview>
              {/* Overall Score Card */}
              <ScoreCard $color={getScoreColor(results.overall_score)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <ScoreCircle>
                    <CircularProgressbar
                      value={getScoreValue(results.overall_score)} // Use numeric value (50 for N/A)
                      text={`${results.overall_score}`} // Display original text ("N/A" or number)
                      styles={buildStyles({
                          textColor: getScoreColor(results.overall_score),
                          pathColor: getScoreColor(results.overall_score),
                          trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px'
                      })}
                    />
                  </ScoreCircle>
                  <ScoreLabel>Overall Score</ScoreLabel>
                  <ScoreValue $color={getScoreColor(results.overall_score)}>
                    {results.overall_score}{typeof results.overall_score === 'number' ? '/100' : ''}
                  </ScoreValue>
              </ScoreCard>

              {/* Environmental Score Card */}
              <ScoreCard $color={getScoreColor(results.scores?.environmental)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <TooltipIcon />
                  <TooltipText>Environmental factors: Climate impact, resource use, pollution, sustainability efforts. (Relates to GRI 300 series / SASB industry specifics)</TooltipText>
                  <ScoreCircle>
                   <CircularProgressbar
                     value={getScoreValue(results.scores?.environmental)}
                     text={`${results.scores?.environmental ?? 'N/A'}`}
                     styles={buildStyles({ textColor: getScoreColor(results.scores?.environmental), pathColor: getScoreColor(results.scores?.environmental), trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px' })}
                   />
                </ScoreCircle>
                <ScoreLabel>Environmental</ScoreLabel>
                <ScoreValue $color={getScoreColor(results.scores?.environmental)}>
                  {results.scores?.environmental ?? 'N/A'}{typeof results.scores?.environmental === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>

              {/* Social Score Card */}
              <ScoreCard $color={getScoreColor(results.scores?.social)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
                   <TooltipIcon />
                   <TooltipText>Social factors: Employee relations, diversity, human rights, community impact, product safety. (Relates to GRI 400 series / SASB human capital)</TooltipText>
                   <ScoreCircle>
                   <CircularProgressbar
                     value={getScoreValue(results.scores?.social)}
                     text={`${results.scores?.social ?? 'N/A'}`}
                     styles={buildStyles({ textColor: getScoreColor(results.scores?.social), pathColor: getScoreColor(results.scores?.social), trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px' })}
                   />
                 </ScoreCircle>
                <ScoreLabel>Social</ScoreLabel>
                <ScoreValue $color={getScoreColor(results.scores?.social)}>
                  {results.scores?.social ?? 'N/A'}{typeof results.scores?.social === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>

              {/* Governance Score Card */}
              <ScoreCard $color={getScoreColor(results.scores?.governance)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                   <TooltipIcon />
                   <TooltipText>Governance factors: Leadership ethics, board structure, executive pay, shareholder rights, transparency. (Relates to GRI 200 series / SASB governance metrics)</TooltipText>
                   <ScoreCircle>
                   <CircularProgressbar
                     value={getScoreValue(results.scores?.governance)}
                     text={`${results.scores?.governance ?? 'N/A'}`}
                     styles={buildStyles({ textColor: getScoreColor(results.scores?.governance), pathColor: getScoreColor(results.scores?.governance), trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px' })}
                   />
                 </ScoreCircle>
                <ScoreLabel>Governance</ScoreLabel>
                <ScoreValue $color={getScoreColor(results.scores?.governance)}>
                  {results.scores?.governance ?? 'N/A'}{typeof results.scores?.governance === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>
            </ScoreOverview>

            {/* Charts (Data prep uses getChartScoreValue which defaults N/A to 0) */}
            <ChartsSection>
                 <ChartCard initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                     <h3>ESG Pillars Comparison</h3>
                     <ResponsiveContainer width="100%" height={350}>
                         <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                             <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                             <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} domain={[0, 100]}/>
                             <Tooltip contentStyle={{ background: 'rgba(0, 0, 0, 0.95)', border: '1px solid rgba(0, 255, 170, 0.3)', borderRadius: '8px', color: '#fff' }} />
                             <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                 {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#00ff88', '#00ddbb', '#00bb99'][index % 3]} />
                                 ))}
                             </Bar>
                         </BarChart>
                     </ResponsiveContainer>
                 </ChartCard>

                 <ChartCard initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                     <h3>ESG Performance Radar</h3>
                     <ResponsiveContainer width="100%" height={350}>
                         <RadarChart data={radarData}>
                             <PolarGrid stroke="rgba(0, 255, 170, 0.2)" />
                             <PolarAngleAxis dataKey="subject" stroke="rgba(255, 255, 255, 0.7)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                             <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.3)" tick={{ fill: 'rgba(255, 255, 255, 0.5)' }} domain={[0, 100]} />
                             <Radar name="Score" dataKey="score" stroke="#00ffaa" fill="#00ffaa" fillOpacity={0.4} strokeWidth={3} />
                         </RadarChart>
                     </ResponsiveContainer>
                 </ChartCard>

                 {/* --- NEW: ESG RISK HEATMAP --- */}
                 {/* This spans two columns if ChartsSection has 2 columns */}
                 {results.risk_heatmap && ( // Check if heatmap data exists
                   <ChartCard
                      style={{ gridColumn: "span 2" }} // Make it span full width
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                   >
                      <h3>ESG Risk Heatmap</h3>
                      <p style={{ color: '#aaa', marginTop: '-1.5rem', marginBottom: '2rem', fontSize: '0.9rem'}}>
                        Based on volume and trust of negative news & social media. Higher scores indicate higher risk.
                      </p>

                      {/* Environmental Section */}
                      <HeatmapHeader>Environmental</HeatmapHeader>
                      <HeatmapGrid style={{ marginBottom: '2rem' }}>
                        {heatmapCategories.Environmental.map((topic) => {
                          const riskScore = results.risk_heatmap?.[topic] || 0;
                          const riskColor = getRiskColor(riskScore);
                          return (
                            <HeatmapCell key={topic} $riskColor={riskColor} theme={theme}>
                              <HeatmapLabel theme={theme}>{topic}</HeatmapLabel>
                              <HeatmapValue $riskColor={riskColor}>{riskScore.toFixed(1)}</HeatmapValue>
                            </HeatmapCell>
                          );
                        })}
                      </HeatmapGrid>
                      
                      {/* Social Section */}
                      <HeatmapHeader>Social</HeatmapHeader>
                      <HeatmapGrid style={{ marginBottom: '2em' }}>
                        {heatmapCategories.Social.map((topic) => {
                          const riskScore = results.risk_heatmap?.[topic] || 0;
                          const riskColor = getRiskColor(riskScore);
                          return (
                            <HeatmapCell key={topic} $riskColor={riskColor} theme={theme}>
                              <HeatmapLabel theme={theme}>{topic}</HeatmapLabel>
                              <HeatmapValue $riskColor={riskColor}>{riskScore.toFixed(1)}</HeatmapValue>
                            </HeatmapCell>
                          );
                        })}
                      </HeatmapGrid>

                      {/* Governance Section */}
                      <HeatmapHeader>Governance</HeatmapHeader>
                      <HeatmapGrid>
                        {heatmapCategories.Governance.map((topic) => {
                          const riskScore = results.risk_heatmap?.[topic] || 0;
                          const riskColor = getRiskColor(riskScore);
                          return (
                            <HeatmapCell key={topic} $riskColor={riskColor} theme={theme}>
                              <HeatmapLabel theme={theme}>{topic}</HeatmapLabel>
                              <HeatmapValue $riskColor={riskColor}>{riskScore.toFixed(1)}</HeatmapValue>
                            </HeatmapCell>
                          );
                        })}
                      </HeatmapGrid>
                   </ChartCard>
                 )}
                 {/* --- END: ESG RISK HEATMAP --- */}

            </ChartsSection>

            {/* --- Key ESG Risk Areas Section (Keep as is) --- */}
            {results.suggestions && results.suggestions.length > 0 && (
                 <RiskAreaSection
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                 >
                     <h3><FiAlertTriangle /> Key ESG Risk Areas Identified</h3>
                     <ul>
                         {results.suggestions.map((riskSummary, index) => (
                             <li key={index}>{riskSummary}</li>
                         ))}
                     </ul>
                 </RiskAreaSection>
            )}

            {/* --- FEEDS SECTION (Keep as is) --- */}
            <FeedsSection>
                {results.modules?.map((module, index) => (
                    <ModuleCard
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    >
                        <h3>{module.module_name} (Overall: {module.sentiment})</h3>
                        {module.feed && module.feed.length > 0 ? (
                            module.feed.map((item, itemIndex) => (
                                <FeedItem key={itemIndex}>
                                    <p><strong>Source:</strong> {item.source}</p>
                                    <p>{item.text}</p>
                                    <p>
                                      <small>
                                        Sentiment: {item.sentiment}
                                        ({item.sentiment_score !== undefined ? item.sentiment_score.toFixed(2) : 'N/A'})
                                         | Category: {item.category?.split(':')[0]}
                                      </small>
                                    </p>
                                    {item.explanation && <p><small><i>Reason: {item.explanation}</i></small></p>}
                                    {item.url && item.url !== '#' &&
                                      <a href={item.url} target="_blank" rel="noopener noreferrer">Read More &rarr;</a>
                                    }
                                </FeedItem>
                            ))
                        ) : (
                           <p style={{color: '#888'}}>No relevant items found for this module.</p>
                        )}
                    </ModuleCard>
                ))}
            </FeedsSection>

          </ResultsSection>
        )}
      </AnimatePresence>
    </DashboardPage>
  );
};

// --- Export the wrapper component as the default ---
export default DashboardPageWrapper;

