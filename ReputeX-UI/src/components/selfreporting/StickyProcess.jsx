import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 4rem;
  padding: 6rem 8%;
  background: #000;
  min-height: 150vh;
`;

const Sidebar = styled.div`
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  width: 320px;
  min-height: 460px;
  box-shadow: 0 10px 30px rgba(0, 255, 170, 0.05);
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  cursor: pointer;
`;

const StepNum = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(p) =>
    p.active
      ? "linear-gradient(135deg, #00ffaa, #ab47bc)"
      : "rgba(255,255,255,0.08)"};
  border: 2px solid
    ${(p) => (p.active ? "#00ffaa" : "rgba(255,255,255,0.15)")};
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease;
  box-shadow: ${(p) =>
    p.active ? "0 0 15px #00ffaa66, 0 0 35px #ab47bc33" : "none"};
`;

const StepText = styled.div`
  color: ${(p) => (p.active ? "#00ffaa" : "rgba(255,255,255,0.75)")};
  font-weight: ${(p) => (p.active ? "700" : "500")};
  font-size: 1.05rem;
  transition: 0.3s ease;
`;

const CardList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Card = styled(motion.div)`
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  height:350px;
  padding: 2.5rem;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 255, 170, 0.05);
  scroll-margin-top: 140px; /* Padding to align step with top when scrolling */
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  span {
    background: linear-gradient(135deg, #00ffaa, #ab47bc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Desc = styled.p`
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.05rem;
  line-height: 1.6;
`;

const steps = [
  "Complete Assessment",
  "AI Analysis",
  "Verification & Scoring",
  "Get Insights",
];

const cardContent = [
  {
    title: "Complete Assessment",
    desc: "Answer ESG-focused questions tailored to your industry. This forms the base for intelligent evaluation.",
  },
  {
    title: "AI Analysis",
    desc: "Our AI engine scans through public data, sentiment, and sustainability reports to verify your responses.",
  },
  {
    title: "Verification & Scoring",
    desc: "It compares data against reliable public sources to assign a transparent and unbiased ESG score.",
  },
  {
    title: "Get Insights",
    desc: "You instantly receive actionable recommendations and performance visuals to strengthen your ESG profile.",
  },
];

// Scroll spy + card refs
const StickyProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef([]);

  // Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const offsets = cardRefs.current.map(ref =>
        ref ? ref.getBoundingClientRect().top : Infinity
      );
      const inViewIndex = offsets.findIndex(
        offset => offset > 80 && offset < (window.innerHeight * 0.7)
      );
      if (inViewIndex !== -1 && inViewIndex !== activeStep) {
        setActiveStep(inViewIndex);
      } else if (inViewIndex === -1) {
        // Special handling for last card in scroll
        const last = offsets.length - 1;
        if (
          offsets[last] <= window.innerHeight * 0.9 &&
          offsets[last] > -window.innerHeight * 0.5
        )
          setActiveStep(last);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () =>
      window.removeEventListener("scroll", handleScroll, { passive: true });
  }, [activeStep]);

  // Scroll to card on sidebar click
  const handleSidebarClick = (i) => {
    setActiveStep(i);
    cardRefs.current[i].scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Wrapper>
      {/* Left Sticky Sidebar */}
      <Sidebar>
        {steps.map((label, i) => (
          <Step key={i} onClick={() => handleSidebarClick(i)}>
            <StepNum active={i === activeStep}>{i + 1}</StepNum>
            <StepText active={i === activeStep}>{label}</StepText>
          </Step>
        ))}
      </Sidebar>

      {/* Scrollable Cards */}
      <CardList>
        {cardContent.map((card, i) => (
          <Card
            key={i}
            ref={el => (cardRefs.current[i] = el)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Title>
              Step {i + 1}: <span>{card.title}</span>
            </Title>
            <Desc>{card.desc}</Desc>
          </Card>
        ))}
      </CardList>
    </Wrapper>
  );
};

export default StickyProcess;
