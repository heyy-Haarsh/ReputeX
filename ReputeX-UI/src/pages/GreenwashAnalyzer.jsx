
// GreenwashAnalyzer.jsx - Enhanced Interactive UI
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiFileText, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiShield, 
  FiZap, 
  FiUpload, 
  FiLoader, 
  FiXCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiArrowRight
} from "react-icons/fi";

// Theme configuration
const theme = {
  colors: {
    darkBg: "#000000",
    primaryGreen: "#00ffaa",
    primaryPurple: "#673ab7",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    border: "rgba(255, 255, 255, 0.1)",
    borderFaint: "rgba(255, 255, 255, 0.05)",
    gradientButton: "linear-gradient(135deg, #00ffaa, #ab47bc 90%)",
    success: "#00ffaa",
    warning: "#ffc107",
    danger: "#ff6b6b",
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },
};

// Styled Components
const PageWrapper = styled.div`
  background: ${props => props.theme.colors.darkBg};
  min-height: 100vh;
  padding-top: 80px;
`;

const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 5%;
  position: relative;
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

const FeatureCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
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
  margin: 0 auto 1.3rem;
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
    top: 0;
    width: 100%;
    max-height: none;
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
  background: ${(p) => (p.$active ? "rgba(0, 255, 170, 0.15)" : "transparent")};
  border-left: 4px solid ${(p) => (p.$active ? "#00ffaa" : "transparent")};
  color: ${(p) => (p.$active ? "#00ffaa" : "rgba(255,255,255,0.8)")};

  &:hover {
    background: rgba(0, 255, 170, 0.1);
  }
`;

const StepNum = styled.div`
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active
      ? "linear-gradient(135deg, #00ffaa, #ab47bc)"
      : "rgba(255,255,255,0.08)"};
  border: 1.5px solid ${(p) => (p.$active ? "#00ffaa" : "rgba(255,255,255,0.15)")};
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) =>
    p.$active ? "0 0 12px #00ffaa90, 0 0 36px #ab47bc55" : "none"};
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
`;

const Card = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 170, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  min-height: ${props => props.$isStatic ? 'auto' : '320px'};
  scroll-margin-top: 140px;
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

const UploaderForm = styled.div`
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
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #00ffaa;
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
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ffaa;
    color: #00ffaa;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AnalyzeButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #00ffaa, #ab47bc 90%);
  color: #000;
  border: none;
  border-radius: 8px;
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

const LoadingSpinner = styled(motion.div)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled(motion.div)`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid #ff6b6b;
  border-radius: 12px;
  color: #ff6b6b;
  text-align: center;
`;

const ResultsContainer = styled(motion.div)`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ResultHeaderCard = styled.div`
  background: linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(103, 58, 183, 0.15));
  border: 1px solid rgba(0, 255, 170, 0.3);
  border-radius: 16px;
  padding: 2rem;
`;

const ResultHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const ResultTitle = styled.h4`
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const ResultStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.$isConsistent ? '#00ffaa' : '#ff6b6b'};
`;

const ScoreBadge = styled.div`
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const ScoreLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: ${props => 
    props.$score >= 70 ? '#00ffaa' :
    props.$score >= 40 ? '#ffc107' :
    '#ff6b6b'
  };
  
  span {
    font-size: 1.5rem;
  }
`;

const ScoreSubtext = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
`;

const ScoreBar = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  height: 12px;
  overflow: hidden;
`;

const ScoreBarFill = styled(motion.div)`
  height: 100%;
  border-radius: 50px;
  background: ${props => 
    props.$score >= 70 ? 'linear-gradient(90deg, #00ffaa, #00cc88)' :
    props.$score >= 40 ? 'linear-gradient(90deg, #ffc107, #ff9800)' :
    'linear-gradient(90deg, #ff6b6b, #f44336)'
  };
`;

const InconsistenciesSection = styled.div`
  background: rgba(255, 107, 107, 0.05);
  border: 2px solid #ff6b6b;
  border-radius: 16px;
  padding: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 107, 107, 0.3);
`;

const SectionIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.$color || '#ff6b6b'};
  flex-shrink: 0;
`;

const SectionHeaderText = styled.div`
  flex: 1;
`;

const SectionHeaderTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
`;

const SectionHeaderSubtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
`;

const InconsistencyItem = styled(motion.div)`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff6b6b;
  }
`;

const InconsistencyFlag = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const FlagIcon = styled.div`
  color: #ff6b6b;
  font-size: 1.2rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
`;

const FlagText = styled.p`
  color: #ff6b6b;
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const InconsistencyDetails = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TopicBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  span:first-child {
    color: rgba(255, 255, 255, 0.5);
  }
  
  span:last-child {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    color: #fff;
    font-weight: 500;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const MetricCard = styled.div`
  background: ${props => props.$bg};
  border: 1px solid ${props => props.$border};
  border-radius: 8px;
  padding: 0.75rem;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.$color};
`;

const VagueFlagsSection = styled.div`
  background: rgba(255, 193, 7, 0.05);
  border: 2px solid #ffc107;
  border-radius: 16px;
  padding: 2rem;
`;

const VagueFlagItem = styled(motion.div)`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ffc107;
  }
`;

const VagueFlagContent = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
`;

const VagueFlagIcon = styled.div`
  color: #ffc107;
  margin-top: 0.2rem;
  flex-shrink: 0;
`;

const VagueFlagText = styled.p`
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  font-size: 0.95rem;
  
  strong {
    color: #ffc107;
    font-weight: 700;
    background: rgba(255, 193, 7, 0.15);
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CTASection = styled.section`
  margin: 8rem 5% 5rem;
  background: linear-gradient(135deg, #004d40, rgba(0, 255, 170, 0.6));
  padding: 5rem 2rem;
  border-radius: 28px;
  text-align: center;
  box-shadow: 0 0 60px rgba(0, 255, 170, 0.3);
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
  color: #000;
`;

// Main Component
const GreenwashAnalyzer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cardsRef = useRef([]);
  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Click to select a PDF file");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    "Upload Report",
    "NLP Analysis",
    "Compare With Public Data",
    "Flag Greenwashing",
  ];

  const cardDetails = [
    {
      title: "Upload Report",
      description: "Provide the company name and its latest Sustainability/ESG Report (PDF) to begin.",
    },
    {
      title: "NLP Analysis",
      description: "Our AI extracts key topics and scans the report for 'weasel words' (vague claims) vs. 'concrete' data-backed claims.",
    },
    {
      title: "Compare With Public Data",
      description: "We cross-reference the report's prominent topics with live Reddit sentiment for that exact topic.",
    },
    {
      title: "Flag Greenwashing",
      description: "If the report boasts about a topic but public sentiment is negative, we flag it as a HIGH RISK inconsistency.",
    },
  ];

  const features = [
    {
      icon: <FiFileText />,
      title: "Automated PDF Parsing",
      description: "Extracts key info and claims from sustainability reports fast and accurately.",
      color: "#00ffaa",
    },
    {
      icon: <FiShield />,
      title: "Trustworthy Verification",
      description: "Combines NLP findings with trusted news and public data for reliable scoring.",
      color: "#673ab7",
    },
    {
      icon: <FiZap />,
      title: "Real-Time Monitoring",
      description: "Continuous checks for emerging greenwashing risks supported by live media feeds.",
      color: "#00ffaa",
    },
    {
      icon: <FiTrendingUp />,
      title: "Actionable Insights",
      description: "Clear flags and recommendations encourage transparency and leadership in sustainability.",
      color: "#673ab7",
    },
  ];

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

    const apiUrl = "http://localhost:8000/api/analyze-greenwash";

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try { 
          const errorData = await response.json(); 
          errorMsg = errorData.message || errorData.detail || errorMsg; 
        } catch (jsonError) { 
          errorMsg = response.statusText || errorMsg; 
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.status === "Error") {
        throw new Error(data.report || "Analysis failed on the backend.");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "An error occurred. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

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
            newActiveStep = i;
            break;
          }
        }
      }
      if (newActiveStep !== activeStep) {
        setActiveStep(newActiveStep);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeStep]);

  const scrollToCard = (idx) => {
    const cardEl = cardsRef.current[idx];
    if (cardEl) {
      const top = cardEl.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <PageWrapper theme={theme}>
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
            onClick={() => scrollToCard(0)}
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
            <FeatureCard 
              key={idx} 
              $color={feature.color}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
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
                $active={idx === activeStep}
                onClick={() => scrollToCard(idx)}
              >
                <StepNum $active={idx === activeStep}>{idx + 1}</StepNum>
                <StepText>{step}</StepText>
              </Step>
            ))}
          </Sidebar>

          <ContentCards>
            {/* Card 1: Upload & Results */}
            <Card
              ref={(el) => (cardsRef.current[0] = el)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              $isStatic={false}
            >
              <CardTitle>Step 1: {cardDetails[0].title}</CardTitle>
              <CardDescription>{cardDetails[0].description}</CardDescription>
              
              <UploaderForm>
                <FormInput
                  type="text"
                  placeholder="Enter Company Name (e.g., Tesla, Apple)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
                
                <HiddenFileInput
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <FileInputLabel htmlFor="pdf-upload">
                  <FiUpload />
                  {fileName}
                </FileInputLabel>
                
                <AnalyzeButton 
                  onClick={handleSubmitAnalysis}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner>
                        <FiLoader />
                      </LoadingSpinner>
                      Analyzing Report...
                    </>
                  ) : (
                    "Analyze Now"
                  )}
                </AnalyzeButton>
              </UploaderForm>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <ErrorMessage
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <FiXCircle style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Analysis Error</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{error}</p>
                  </ErrorMessage>
                )}
              </AnimatePresence>

              {/* Results Display */}
              <AnimatePresence>
                {results && !error && (
                  <ResultsContainer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Header Card with Score */}
                    <ResultHeaderCard>
                      <ResultHeaderTop>
                        <div>
                          <ResultTitle>Analysis Results: {results.company_name}</ResultTitle>
                          <ResultStatus $isConsistent={results.status === 'Consistent'}>
                            {results.status === 'Consistent' ? (
                              <FiCheckCircle style={{ fontSize: '1.5rem' }} />
                            ) : (
                              <FiAlertTriangle style={{ fontSize: '1.5rem' }} />
                            )}
                            <span>{results.status}</span>
                          </ResultStatus>
                        </div>
                        
                        <ScoreBadge>
                          <ScoreLabel>Credibility Score</ScoreLabel>
                          <ScoreValue $score={results.credibility_score}>
                            {results.credibility_score}
                            <span>/100</span>
                          </ScoreValue>
                          <ScoreSubtext>Concrete vs Vague Language</ScoreSubtext>
                        </ScoreBadge>
                      </ResultHeaderTop>

                      <ScoreBar>
                        <ScoreBarFill
                          $score={results.credibility_score}
                          initial={{ width: 0 }}
                          animate={{ width: `${results.credibility_score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </ScoreBar>
                    </ResultHeaderCard>

                    {/* Inconsistencies Section */}
                    {results.inconsistencies && results.inconsistencies.length > 0 && (
                      <InconsistenciesSection>
                        <SectionHeader>
                          <SectionIcon $color="#ff6b6b">
                            <FiAlertCircle />
                          </SectionIcon>
                          <SectionHeaderText>
                            <SectionHeaderTitle>Public Sentiment Inconsistencies</SectionHeaderTitle>
                            <SectionHeaderSubtitle>
                              High-risk discrepancies detected between claims and public perception
                            </SectionHeaderSubtitle>
                          </SectionHeaderText>
                        </SectionHeader>

                        <ItemsList>
                          {results.inconsistencies.map((item, index) => (
                            <InconsistencyItem
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <InconsistencyFlag>
                                <FlagIcon>
                                  <FiAlertTriangle />
                                </FlagIcon>
                                <FlagText>{item.flag}</FlagText>
                              </InconsistencyFlag>
                              
                              <InconsistencyDetails>
                                <TopicBadge>
                                  <span>Topic:</span>
                                  <span>{item.topic}</span>
                                </TopicBadge>
                                
                                <MetricsGrid>
                                  <MetricCard 
                                    $bg="rgba(0, 255, 170, 0.1)" 
                                    $border="rgba(0, 255, 170, 0.3)"
                                  >
                                    <MetricLabel>Report Prominence</MetricLabel>
                                    <MetricValue $color="#00ffaa">
                                      {(item.report_relevance * 100).toFixed(0)}%
                                    </MetricValue>
                                  </MetricCard>
                                  
                                  <MetricCard 
                                    $bg="rgba(255, 107, 107, 0.1)" 
                                    $border="rgba(255, 107, 107, 0.3)"
                                  >
                                    <MetricLabel>Public Sentiment</MetricLabel>
                                    <MetricValue $color="#ff6b6b">
                                      {(item.reddit_sentiment * 100).toFixed(0)}%
                                    </MetricValue>
                                  </MetricCard>
                                </MetricsGrid>
                              </InconsistencyDetails>
                            </InconsistencyItem>
                          ))}
                        </ItemsList>
                      </InconsistenciesSection>
                    )}

                    {/* Vague Language Flags */}
                    {results.vague_flags && results.vague_flags.length > 0 && (
                      <VagueFlagsSection>
                        <SectionHeader>
                          <SectionIcon $color="#ffc107">
                            <FiInfo />
                          </SectionIcon>
                          <SectionHeaderText>
                            <SectionHeaderTitle>Vague Language Detected</SectionHeaderTitle>
                            <SectionHeaderSubtitle>
                              Statements lacking concrete data or commitments
                            </SectionHeaderSubtitle>
                          </SectionHeaderText>
                        </SectionHeader>

                        <ItemsList>
                          {results.vague_flags.map((flag, index) => (
                            <VagueFlagItem
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <VagueFlagContent>
                                <VagueFlagIcon>
                                  <FiArrowRight />
                                </VagueFlagIcon>
                                <VagueFlagText>{flag}</VagueFlagText>
                              </VagueFlagContent>
                            </VagueFlagItem>
                          ))}
                        </ItemsList>
                      </VagueFlagsSection>
                    )}
                  </ResultsContainer>
                )}
              </AnimatePresence>
            </Card>

            {/* Static Cards 2-4 */}
            {cardDetails.slice(1).map((card, idx) => (
              <Card
                key={idx + 1}
                ref={(el) => (cardsRef.current[idx + 1] = el)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                $isStatic={true}
              >
                <CardTitle>Step {idx + 2}: {card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            ))}
          </ContentCards>
        </StickyContent>
      </StickyWrapper>

      <CTASection>
        <CTAHeader
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          Take Control of Your ESG Transparency
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
          style={{ padding: "1.2rem 3.8rem", fontSize: "1.22rem" }}
          onClick={() => scrollToCard(0)}
        >
          Get Started Now
        </HeroButton>
      </CTASection>
    </PageWrapper>
  );
};

export default GreenwashAnalyzer;