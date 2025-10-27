// src/pages/GreenwashDetection.jsx
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/aceternity/AuroraBackground";
import { CardSpotlight } from "../components/aceternity/CardSpotlight";
import { FiFileText, FiCheckCircle, FiTrendingUp, FiShield, FiZap, FiLayers, FiBarChart2, FiActivity, FiAward } from "react-icons/fi";

const PageWrapper = styled.div`
  background: #000;
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
    width: 100%;
    min-height: fit-content;
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
  margin: 4rem;
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

const GreenwashDetectionPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cardsRef = useRef([]);

  const steps = [
    "Upload Report",
    "NLP Analysis",
    "Compare With Public Data",
    "Flag Greenwashing",
  ];

  const cardDetails = [
    {
      title: "Upload Report",
      description: "Upload your company’s Sustainability or ESG Report in PDF to start analysis.",
    },
    {
      title: "NLP Analysis",
      description: "Our NLP engine identifies vague claims and extract meaningful data.",
    },
    {
      title: "Compare With Public Data",
      description: "Cross-reference claims with real-time public sentiment and media reports.",
    },
    {
      title: "Flag Greenwashing",
      description: "Automatically detect discrepancies and highlight potential greenwashing instances.",
    },
  ];
useEffect(() => {
  const onScroll = () => {
    if (!cardsRef.current) return;

    const scrollMiddle = window.innerHeight / 2;
    let newActiveStep = activeStep;

    for (let i = 0; i < cardsRef.current.length; i++) {
      const el = cardsRef.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        // Check if middle of viewport is inside card area
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
  onScroll(); // Initial check

  return () => window.removeEventListener("scroll", onScroll);
}, [activeStep]);


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
      <AuroraBackground>
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
            >
              Try Greenwash Detection
            </HeroButton>
          </HeroContent>
        </HeroSection>
      </AuroraBackground>

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
            <CardSpotlight key={idx}>
              <FeatureIcon $color={feature.color}>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </CardSpotlight>
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
            {cardDetails.map((card, idx) => (
              <Card
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <CardTitle>
                  Step {idx + 1}: <span>{card.title}</span>
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            ))}
          </ContentCards>
        </StickyContent>
      </StickyWrapper>

      {/* Custom CTA Section */}
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
        >
          Get Started Now
        </HeroButton>
      </CTASection>
    </PageWrapper>
  );
};

export default GreenwashDetectionPage;
