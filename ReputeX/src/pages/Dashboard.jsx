// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiLoader, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// --- STYLED COMPONENTS (Keep all from your original code) ---
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
  margin-bottom: 4rem; /* Added margin */

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
// --- ADD STYLED COMPONENTS FOR FEEDS ---
const FeedsSection = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns for News and Reddit */
  gap: 2rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ModuleCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  max-height: 600px; /* Limit height and allow scrolling */
  overflow-y: auto;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.textPrimary};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 0.8rem;
  }
`;

const FeedItem = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderFaint};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  p strong {
     color: ${props => props.theme.colors.textPrimary};
  }
  small {
    color: ${props => props.theme.colors.textMuted};
    font-size: 0.9em;
  }
  a {
    color: ${props => props.theme.colors.primaryGreen};
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9em;
    word-break: break-all; /* Prevent long URLs from breaking layout */
    &:hover {
      text-decoration: underline;
    }
  }
`;
// --- END STYLED COMPONENTS ---


const features = [
  { icon: <FiSearch />, title: 'Real-Time Data', description: 'Fetches latest news & Reddit discussions.', color: '#00ff88' },
  { icon: <FiTrendingUp />, title: 'AI Classification', description: 'Classifies content into E, S, G categories.', color: '#00ddbb' },
  { icon: <FiAlertCircle />, title: 'Sentiment Analysis', description: 'Analyzes public sentiment for scores.', color: '#00bb99' },
  { icon: <FiCheckCircle />, title: 'Overall Scoring', description: 'Generates overall ESG reputation score.', color: '#00ffaa' }
];

// --- === MAIN COMPONENT === ---
const Dashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // Will store the full JSON from backend
  const [error, setError] = useState(null);

  // --- MODIFIED handleSearch function ---
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!companyName.trim()) {
      setError('Please enter a company name');
      setResults(null); // Clear results on empty search
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null); // Clear previous results

    // API URL for your FastAPI backend (running on port 8000)
    const apiUrl = `http://localhost:8000/api/analyze?company=${encodeURIComponent(companyName)}`;

    try {
      console.log(`Fetching: ${apiUrl}`); // Log URL
      const response = await fetch(apiUrl, {
        method: 'GET', // Use GET
        headers: { 'Accept': 'application/json' },
      });
      console.log(`Response Status: ${response.status}`); // Log Status

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.detail || errorMsg; // Check for backend error messages
        } catch (jsonError) {
             errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("Data received:", data); // Log Data

      // Check for application-level errors returned in the JSON
      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setResults(data); // Store the entire successful result object

    } catch (err) {
      console.error("Error fetching analysis:", err); // Log the full error to console
      setError(err.message || 'Failed to fetch ESG data. Is the backend server running?'); // Show user-friendly error
    } finally {
      setLoading(false); // Ensure loading stops
    }
  };
  // --- END handleSearch function ---


  // Helper to safely get score, defaulting to 0 for charts/progress bars if N/A
  const getScoreValue = (score) => {
    // Check for "N/A", null, undefined before converting to Number
    return (score === "N/A" || score === null || score === undefined) ? 0 : Number(score);
  };

  // Helper function to get color based on score
  const getScoreColor = (scoreValue) => {
    const numericScore = getScoreValue(scoreValue); // Use helper here too
    if (numericScore === 0 && scoreValue === "N/A") return 'grey'; // Color for N/A
    if (numericScore >= 75) return '#00ff88'; // Bright Green
    if (numericScore >= 50) return '#00ddbb'; // Teal
    if (numericScore >= 25) return '#ffc107'; // Yellow/Orange
    return '#ff6b6b'; // Red
  };

  // --- Data preparation for charts using helper function ---
  const overallScoreValue = results ? getScoreValue(results.overall_score) : 0;
  const envScoreValue = results?.scores ? getScoreValue(results.scores.environmental) : 0;
  const socScoreValue = results?.scores ? getScoreValue(results.scores.social) : 0;
  const govScoreValue = results?.scores ? getScoreValue(results.scores.governance) : 0;

  const radarData = results ? [
    { subject: 'Environmental', score: envScoreValue, fullMark: 100 },
    { subject: 'Social', score: socScoreValue, fullMark: 100 },
    { subject: 'Governance', score: govScoreValue, fullMark: 100 }
  ] : [];

  const barData = results ? [
    { name: 'Env.', score: envScoreValue },
    { name: 'Soc.', score: socScoreValue },
    { name: 'Gov.', score: govScoreValue }
  ] : [];
  // --- End data preparation ---


  return (
    <DashboardPage>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
           <HeroTitle /* ... */ >ReputeX ESG Tracker</HeroTitle> {/* Updated Name */}
           <HeroSubtitle /* ... */ >
             Analyze any company's Environmental, Social, and Governance performance
             in real-time using AI-powered analysis from news and social media.
           </HeroSubtitle>

          {/* Search Bar */}
          <SearchSection /* ... */ >
            <form onSubmit={handleSearch}>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Enter company name (e.g., Tesla, Apple, Tata)..."
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
                    <><LoadingSpinner><FiLoader /></LoadingSpinner>Analyzing...</>
                  ) : (
                    <><FiSearch />Analyze</>
                  )}
                </SearchButton>
              </SearchContainer>
            </form>
          </SearchSection>
        </HeroContent>
      </HeroSection>

      {/* Features Section (Show only if no results/loading/error) */}
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

      {/* Error Message */}
      <AnimatePresence>
        {error && (
            <ErrorMessage /* ... */ >
                <FiXCircle />
                <h3>Error Analyzing Company</h3>
                <p>{error}</p>
            </ErrorMessage>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {results && !error && ( // Only show results if results exist AND there's no error
          <ResultsSection /* ... */ >
            <ResultsHeader>
              <h2>ESG Analysis: {results.company_name}</h2> {/* Use correct key */}
              <p>Analysis based on data fetched on {new Date().toLocaleDateString()}</p>
            </ResultsHeader>

            {/* Score Overview */}
            <ScoreOverview>
              {/* Overall Score */}
              <ScoreCard
                $color={getScoreColor(results.overall_score)} // Use original score for color logic
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
              >
                <ScoreCircle>
                  <CircularProgressbar
                    value={overallScoreValue} // Use numeric value for bar
                    text={`${results.overall_score}`} // Display original ("N/A" or number)
                    styles={buildStyles({
                      textColor: getScoreColor(results.overall_score), pathColor: getScoreColor(results.overall_score),
                      trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px',
                    })}
                  />
                </ScoreCircle>
                <ScoreLabel>Overall Score</ScoreLabel>
                <ScoreValue $color={getScoreColor(results.overall_score)}>
                  {results.overall_score}{typeof results.overall_score === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>

              {/* Environmental Score */}
              <ScoreCard $color="#00ff88" /* ... */ >
                <ScoreCircle>
                   <CircularProgressbar
                     value={envScoreValue}
                     text={`${results.scores?.environmental ?? 'N/A'}`}
                     styles={buildStyles({ textColor: '#00ff88', pathColor: '#00ff88', trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px' })}
                   />
                </ScoreCircle>
                <ScoreLabel>Environmental</ScoreLabel>
                <ScoreValue $color="#00ff88">
                  {results.scores?.environmental ?? 'N/A'}{typeof results.scores?.environmental === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>

              {/* Social Score */}
              <ScoreCard $color="#00ddbb" /* ... */ >
                 <ScoreCircle>
                   <CircularProgressbar
                     value={socScoreValue}
                     text={`${results.scores?.social ?? 'N/A'}`}
                     styles={buildStyles({ textColor: '#00ddbb', pathColor: '#00ddbb', trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px' })}
                   />
                 </ScoreCircle>
                <ScoreLabel>Social</ScoreLabel>
                <ScoreValue $color="#00ddbb">
                  {results.scores?.social ?? 'N/A'}{typeof results.scores?.social === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>

              {/* Governance Score */}
              <ScoreCard $color="#00bb99" /* ... */ >
                 <ScoreCircle>
                   <CircularProgressbar
                     value={govScoreValue}
                     text={`${results.scores?.governance ?? 'N/A'}`}
                     styles={buildStyles({ textColor: '#00bb99', pathColor: '#00bb99', trailColor: 'rgba(255, 255, 255, 0.1)', textSize: '24px' })}
                   />
                 </ScoreCircle>
                <ScoreLabel>Governance</ScoreLabel>
                <ScoreValue $color="#00bb99">
                  {results.scores?.governance ?? 'N/A'}{typeof results.scores?.governance === 'number' ? '/100' : ''}
                </ScoreValue>
              </ScoreCard>
            </ScoreOverview>

            {/* Charts */}
            <ChartsSection>
                 <ChartCard /* ... */ >
                     <h3>ESG Pillars Comparison</h3>
                     <ResponsiveContainer width="100%" height={350}>
                         <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                             <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                             <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} domain={[0, 100]}/>
                             <Tooltip contentStyle={{ background: 'rgba(0, 0, 0, 0.95)', border: '1px solid rgba(0, 255, 170, 0.3)', borderRadius: '8px', color: '#fff' }} />
                             <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                 {/* Assign colors based on index/name if needed, otherwise default */}
                                 {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#00ff88', '#00ddbb', '#00bb99'][index % 3]} />
                                 ))}
                             </Bar>
                         </BarChart>
                     </ResponsiveContainer>
                 </ChartCard>

                 <ChartCard /* ... */ >
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
            </ChartsSection>

            {/* --- FEEDS SECTION --- */}
            <FeedsSection>
                {results.modules?.map((module, index) => (
                    <ModuleCard
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    >
                        <h3>{module.module_name} (Overall: {module.sentiment})</h3>
                        {module.feed && module.feed.length > 0 ? (
                            module.feed.map((item, itemIndex) => (
                                <FeedItem key={itemIndex}>
                                    <p><strong>Source:</strong> {item.source}</p>
                                    <p>{item.text}</p>
                                    <p><small>Sentiment: {item.sentiment} ({item.sentiment_score}) | Category: {item.category?.split(':')[0]}</small></p>
                                    {item.explanation && <p><small><i>Reason: {item.explanation}</i></small></p>}
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">Read More &rarr;</a>
                                </FeedItem>
                            ))
                        ) : (
                           <p style={{color: '#888'}}>No relevant items found for this module.</p>
                        )}
                    </ModuleCard>
                ))}
            </FeedsSection>
            {/* --- END FEEDS SECTION --- */}

          </ResultsSection>
        )}
      </AnimatePresence>
    </DashboardPage>
  );
};

export default Dashboard;
