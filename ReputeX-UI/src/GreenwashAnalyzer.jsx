// src/pages/GreenwashAnalyzer.jsx
import React, { useRef, useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components"; // <-- Import ThemeProvider
import { motion, AnimatePresence } from "framer-motion";
// import { AuroraBackground } from "../components/aceternity/AuroraBackground"; // <-- REMOVED (File Missing)
// import { CardSpotlight } from "../components/aceternity/CardSpotlight"; // <-- REMOVED (File Missing)
import { FiFileText, FiCheckCircle, FiTrendingUp, FiShield, FiZap, FiUpload, FiLoader, FiXCircle } from "react-icons/fi";
import { theme } from "../theme.js"; // <-- FIX: Added .js extension to the import path

// --- STYLED COMPONENTS (Keep all from your original code) ---
const PageWrapper = styled.div`
  background: ${props => props.theme.colors.darkBg};
  min-height: 100vh;
  padding-top: 80px;
`;

// Hero Section styles
const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 5%;
  position: relative;
  /* Simple fallback background since AuroraBackground is missing */
  background: radial-gradient(circle, rgba(0, 255, 170, 0.1) 0%, #000 70%);
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  span {
    background: linear-gradient(135deg, #00ffaa, #673ab7 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroButton = styled(motion.button)`
  padding: 1.2rem 3rem;
  background: linear-gradient(135deg, #00ffaa, #ab47bc 90%);
  color: #000000;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 255, 170, 0.3);
  transition: 0.2s;
  &:hover {
    box-shadow: 0 15px 60px #00ffaa88;
    background: linear-gradient(135deg, #00ffaa 60%, #ab47bc 100%);
  }
`;

// Features Section styles
const FeaturesSection = styled.section`
  padding: 5rem 5%;
  background: linear-gradient(180deg, #000 0%, #001a14 100%);
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.2rem;
  text-align: center;
  margin-bottom: 1rem;
  span {
    background: linear-gradient(135deg, #00ffaa, #673ab7 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.18rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 700px;
  margin: 0 auto 4rem;
`;

const FeaturesGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2.4rem;
`;

// --- Standard FeatureCard as a fallback for CardSpotlight ---
const FeatureCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  /* Use theme if available, else fallback */
  border: 1px solid ${props => props.theme.colors ? props.theme.colors.border : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius ? props.theme.borderRadius.lg : '12px'};
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s ease;
  $color: ${props => props.$color || '#00ffaa'};

  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.$color};
    background: rgba(0, 255, 170, 0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px ${props => props.$color}40;
  }
`;


const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  background: ${(p) => p.$color}22;
  border: 2.5px solid ${(p) => p.$color};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  color: ${(p) => p.$color};
  margin-bottom: 1.3rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.32rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.76);
`;

// Sticky Scroll Section styles
const StickyWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 5%;
`;

const StickyContent = styled.div`
  display: flex;
  gap: 4rem;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  position: sticky;
  top: 120px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 2rem;
  width: 320px;
  max-height: 370px;
  background: #000;
  box-shadow: 0 10px 30px rgba(0, 255, 170, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  @media (max-width: 992px) {
    position: relative;
    top: 0; /* Unset sticky */
    width: 100%;
    max-height: none; /* Unset max-height */
  }
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 6px 10px;
  border-radius: 8px;
  background: ${(p) => (p.active ? "rgba(0, 255, 170, 0.15)" : "transparent")};
  border-left: 4px solid
    ${(p) => (p.active ? "#00ffaa" : "transparent")};
  color: ${(p) => (p.active ? "#00ffaa" : "rgba(255,255,255,0.8)")};

  &:hover {
    background: rgba(0, 255, 170, 0.1);
  }

  @media (max-width: 992px) {
    justify-content: center;
    padding: 12px 0;
  }
`;

const StepNum = styled.div`
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) =>
    p.active
      ? "linear-gradient(135deg, #00ffaa, #ab47bc)"
      : "rgba(255,255,255,0.08)"};
  border: 1.5px solid
    ${(p) => (p.active ? "#00ffaa" : "rgba(255,255,255,0.15)")};
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) =>
    p.active ? "0 0 12px #00ffaa90, 0 0 36px #ab47bc55" : "none"};
`;

const StepText = styled.div`
  font-weight: 600;
  font-size: 1.05rem;
`;

const ContentCards = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  color: #fff;
  @media (max-width: 992px) {
    padding-top: 3rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 170, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  min-height: 320px;
  scroll-margin-top: 140px; /* offset sticky header */
`;


const CardTitle = styled.h3`
  font-weight: 700;
  font-size: 1.7rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #00ffaa, #673ab7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

// Call to Action Section Styling
const CTASection = styled.section`
  margin-top: 8rem;
  background: linear-gradient(135deg, #004d40, #00ffaa99);
  padding: 5rem 2rem;
  border-radius: 28px;
  text-align: center;
  color: #000;
  box-shadow: 0 0 30px #00ffaa55;
`;

const CTAHeader = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 900;

  background: linear-gradient(135deg, #00ffaa, #673ab7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  margin-bottom: 1rem;
`;

const CTASubtext = styled(motion.p)`
  font-size: 1.3rem;
  max-width: 620px;
  margin: 0 auto 3rem;
  font-weight: 600;
`;

const CTAButton = styled(motion.button)`
  background-color: #00ffaa;
  background-image: linear-gradient(135deg, #00ffaa, #ab47bc);
  box-shadow: 0 0 16px #00ffaa, 0 0 36px #ab47bc;
  border-radius: 60px;
  padding: 1.2rem 3rem;
  font-weight: 900;
  font-size: 1.25rem;
  border: none;
  color: #000;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 0 40px #00ffaa, 0 0 60px #ab47bc;
  }
`;

// --- NEW STYLED COMPONENTS FOR UPLOADER & RESULTS ---
const UploaderForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 170, 0.3);
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primaryGreen};
    box-shadow: 0 0 15px rgba(0, 255, 170, 0.3);
  }
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primaryGreen};
    color: ${props => props.theme.colors.primaryGreen};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AnalyzeButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: ${props => props.theme.colors.gradientButton};
  color: ${props => props.theme.colors.darkBg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled(motion.div)`
  margin-top: 2rem;
  background: rgba(0, 255, 170, 0.05);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
`;

const ResultsTitle = styled.h4`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 1rem;
`;

const ResultStatus = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => (props.status === 'Consistent' ? props.theme.colors.primaryGreen : '#ff6b6b')};
  margin-bottom: 1rem;
`;

const ResultScore = styled.p`
    font-size: 1.1rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 1.5rem;
    span {
        font-weight: 700;
        font-size: 1.3rem;
        color: ${props => (props.score >= 50 ? props.theme.colors.primaryGreen : '#ffc107')};
    }
`;

const ResultList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const ResultItem = styled(motion.li)`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderFaint};
  line-height: 1.6;

  &:last-child {
    border-bottom: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: #ff6b6b;
  text-align: center;
`;
// --- END NEW STYLED COMPONENTS ---


// --- Main Component Wrapper ---
// Wrap the page in ThemeProvider to ensure styled-components have access to theme props
const GreenwashDetectionPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <GreenwashAnalyzer />
    </ThemeProvider>
  )
}


const GreenwashAnalyzer = () => { // Renamed from GreenwashDetectionPage
  const [activeStep, setActiveStep] = useState(0);
  const cardsRef = useRef([]);

  // --- NEW STATE FOR FUNCTIONALITY ---
  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Click to select a PDF file");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  // --- END NEW STATE ---


  const steps = [
    "Upload Report",
    "NLP Analysis",
    "Compare With Public Data",
    "Flag Greenwashing",
  ];
  
  // --- MODIFIED CARD DETAILS ---
  const cardDetails = [
    {
      title: "Upload Report",
      description: "Upload your company’s Sustainability or ESG Report in PDF to start analysis. We also need the company's common name for cross-referencing.",
    },
    {
      title: "NLP Analysis",
      description: "Our NLP engine identifies vague claims ('weasel words') vs. concrete claims and extracts key ESG topics mentioned in the report.",
    },
    {
      title: "Compare With Public Data",
      description: "We cross-reference the report's topics with real-time public sentiment from Reddit, searching for what people *really* think.",
    },
    {
      title: "Flag Greenwashing",
      description: "Discrepancies are flagged as risks. E.g., if the report boasts about 'labor practices' but public sentiment on Reddit is highly negative, we flag it.",
    },
  ];
  // --- END MODIFIED CARD DETAILS ---

  // --- NEW FILE HANDLER FUNCTIONS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFileName(file.name);
      setError(null);
    } else {
      setSelectedFile(null);
      setFileName("Please select a PDF file");
      setError("Invalid file type. Please upload a PDF.");
    }
  };

  const handleSubmitAnalysis = async (e) => {
    e.preventDefault();
    if (!companyName || !selectedFile) {
      setError("Please provide a company name and select a PDF file.");
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("file", selectedFile);

    // Call your FastAPI backend endpoint
    const apiUrl = "http://localhost:8000/api/analyze-greenwash";

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try { const errorData = await response.json(); errorMsg = errorData.message || errorData.detail || errorMsg; }
        catch (jsonError) { errorMsg = response.statusText || errorMsg; }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("Analysis results:", data);
      
      if (data.status === "Error") {
        throw new Error(data.report || "Analysis failed on the backend.");
      }

      setResults(data); // Set the full result object

    } catch (err) {
      console.error("Error submitting analysis:", err);
      setError(err.message || "An error occurred. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };
  // --- END NEW FILE HANDLER FUNCTIONS ---


  // --- Scroll Logic (Keep as is) ---
  useEffect(() => {
    const onScroll = () => {
      if (!cardsRef.current) return;
      const scrollMiddle = window.innerHeight / 2;
      let newActiveStep = activeStep;
      for (let i = 0; i < cardsRef.current.length; i++) {
        const el = cardsRef.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= scrollMiddle && rect.bottom >= scrollMiddle) {
            newActiveStep = i; break;
          }
        }
      }
      if (newActiveStep !== activeStep) {
        setActiveStep(newActiveStep);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial check
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeStep]);

  const scrollToCard = (idx) => {
      const cardEl = cardsRef.current[idx];
      if (cardEl) {
           const top = cardEl.getBoundingClientRect().top + window.pageYOffset - 110;
           window.scrollTo({ top, behavior: "smooth" });
      }
  };
  // --- End Scroll Logic ---

  const features = [
    {
      icon: <FiFileText />,
      title: "Automated PDF Parsing",
      description:
        "Extracts key info and claims from sustainability reports fast and accurately.",
      color: "#00ffaa",
    },
    {
      icon: <FiShield />,
      title: "Trustworthy Verification",
      description:
        "Combines NLP findings with trusted news and public data for reliable scoring.",
      color: "#673ab7",
    },
    {
      icon: <FiZap />,
      title: "Real-Time Monitoring",
      description:
        "Continuous checks for emerging greenwashing risks supported by live media feeds.",
      color: "#00ffaa",
    },
    {
      icon: <FiTrendingUp />,
      title: "Actionable Insights",
      description:
        "Clear flags and recommendations encourage transparency and leadership in sustainability.",
      color: "#673ab7",
    },
  ];

  return (
    <PageWrapper>
      {/* Use HeroSection as fallback for AuroraBackground */}
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Enhanced <span>Greenwash Detection</span>
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Reveal gaps between what companies claim and what public data shows.
            <br />
            Upload reports, get AI-powered verification and transparent flags.
          </HeroSubtitle>
          <HeroButton
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToCard(0)} // Scroll to first card on click
          >
            Try Greenwash Detection
          </HeroButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Why Choose <span>Our Solution?</span>
        </SectionTitle>
        <SectionSubtitle>
          A trusted tool to identify and flag misleading sustainability claims.
        </SectionSubtitle>
        <FeaturesGrid>
          {features.map((feature, idx) => (
            // Use FeatureCard as fallback for CardSpotlight
            <FeatureCard 
              key={idx} 
              $color={feature.color}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              theme={theme} // Pass theme to FeatureCard
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

      <StickyWrapper>
        <StickyContent>
          <Sidebar>
            {steps.map((step, idx) => (
              <Step
                key={idx}
                active={idx === activeStep}
                onClick={() => scrollToCard(idx)}
                tabIndex={0}
              >
                <StepNum active={idx === activeStep}>{idx + 1}</StepNum>
                <StepText active={idx === activeStep}>{step}</StepText>
              </Step>
            ))}
          </Sidebar>

          <ContentCards>
            {/* --- MODIFIED Card 1 (Uploader) --- */}
            <Card
              key={0}
              ref={(el) => (cardsRef.current[0] = el)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <CardTitle>
                Step 1: <span>{cardDetails[0].title}</span>
              </CardTitle>
              <CardDescription>{cardDetails[0].description}</CardDescription>
              
              {/* --- ADDED UPLOADER FORM --- */}
              <UploaderForm onSubmit={handleSubmitAnalysis}>
                <FormInput
                  type="text"
                  placeholder="Enter Company Name (e.g., Tesla, Apple)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  theme={theme} // Pass theme
                />
                <HiddenFileInput
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <FileInputLabel 
                  htmlFor="pdf-upload"
                  theme={theme} // Pass theme
                >
                  <FiUpload />
                  {fileName}
                </FileInputLabel>
                
                <AnalyzeButton 
                  type="submit" 
                  disabled={loading}
                  theme={theme} // Pass theme
                >
                  {loading ? (
                    <><LoadingSpinner as="span"><FiLoader /></LoadingSpinner> Analyzing Report...</>
                  ) : (
                    "Analyze Now"
                  )}
                </AnalyzeButton>
              </UploaderForm>

              {/* Display Errors Here */}
              <AnimatePresence>
                {error && (
                    <ErrorMessage
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ margin: "1.5rem 0 0 0" }} // Reset margins
                        theme={theme} // Pass theme
                    >
                        <FiXCircle style={{ fontSize: '2rem', color: '#ff6b6b', marginBottom: '0.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Analysis Error</h3>
                        <p style={{ color: '#aaa' }}>{error}</p>
                    </ErrorMessage>
                )}
              </AnimatePresence>

              {/* Display Results Here */}
              <AnimatePresence>
                {results && !error && (
                    <ResultsContainer
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        theme={theme} // Pass theme
                    >
                        <ResultsTitle theme={theme}>Analysis Results for {results.company_name}</ResultsTitle>
                        <ResultStatus 
                            status={results.status} 
                            theme={theme}
                        >
                            Status: <strong>{results.status}</strong>
                        </ResultStatus>
                        <ResultScore 
                            score={results.credibility_score}
                            theme={theme}
                        >
                            Report Credibility Score: <span>{results.credibility_score}/100</span>
                            <br/>
                            <small>(Based on vague vs. concrete language)</small>
                        </ResultScore>
                        
                        <ResultList>
                            {/* Ensure results.report is an array before mapping */}
                            {Array.isArray(results.report) && results.report.map((flag, index) => (
                                <ResultItem 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    theme={theme}
                                >
                                    {flag}
                                </ResultItem>
                            ))}
                        </ResultList>
                    </ResultsContainer>
                )}
              </AnimatePresence>
            </Card>
            {/* --- END MODIFIED Card 1 --- */}

            {/* --- Static Cards 2, 3, 4 (Keep as is) --- */}
            {cardDetails.slice(1).map((card, idx) => (
              <Card
                key={idx + 1}
                ref={(el) => (cardsRef.current[idx + 1] = el)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <CardTitle>Step {idx + 2}: <span>{card.title}</span></CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            ))}
            {/* --- END Static Cards --- */}

          </ContentCards>
        </StickyContent>
      </StickyWrapper>

      {/* ... (Keep CTASection as is) ... */}
      <CTASection>
          <CTAHeader
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            Take Control of Your <span>ESG Transparency</span>
          </CTAHeader>
          <CTASubtext
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Upload your ESG reports and discover any inconsistencies flagged by AI-powered greenwash analysis.
            Trust, transparency, and accountability start here.
          </CTASubtext>
          <HeroButton
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            as="button"
            style={{ padding: "1.2rem 3.8rem", fontSize: "1.22rem" }}
            onClick={() => scrollToCard(0)} // Also scroll to first card
          >
            Get Started Now
          </HeroButton>
      </CTASection>
    </PageWrapper>
  );
};

export default GreenwashDetectionPage;

