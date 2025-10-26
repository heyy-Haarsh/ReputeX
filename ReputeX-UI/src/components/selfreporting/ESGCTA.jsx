import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const CTASection = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: 1100px;
  padding: 4rem 7vw 3.5rem 7vw;
  background: linear-gradient(110deg, #001a14 0%, #20244d 100%);
  border-radius: 32px;
  box-shadow: 0 10px 80px #00ffaa24, 0 1px 100px #ab47bc24 inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 4rem;
`;

const CTATitle = styled(motion.h2)`
  font-size: 2.45rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.2rem;
  text-align: center;
  letter-spacing: .01em;
  span {
    background: linear-gradient(135deg, #00ffaa, #ab47bc 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CTASubtitle = styled.div`
  text-align: center;
  font-size: 1.18rem;
  color: rgba(255,255,255,0.76);
  margin-bottom: 2.1rem;
  max-width: 560px;
  font-weight: 500;
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 1.15rem 3.3rem;
  font-size: 1.26rem;
  font-weight: 800;
  border-radius: 42px;
  background: linear-gradient(135deg, #00ffaa 50%, #ab47bc 100%);
  color: #000 !important;
  text-decoration: none;
  box-shadow: 0 8px 40px #00ffaa35, 0 2px 40px #ab47bc28 inset;
  transition: box-shadow .22s, transform .17s;
  letter-spacing: 0.04em;
  cursor: pointer;
  border: none;
  outline: none;
  &:hover {
    background: linear-gradient(135deg, #00ffaa, #ab47bc 90%);
    box-shadow: 0 16px 60px #00ffaa55, 0 3px 90px #ab47bc30 inset;
    transform: scale(1.045);
  }
`;

const CTADetails = styled.div`
  margin-top: 2.35rem;
  color: #fff;
  opacity: 0.77;
  font-size: 1.02rem;
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
`;

const ESGCTA = () => (
  <CTASection>
    <CTATitle
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      Ready to <span>Lead in ESG?</span>
    </CTATitle>
    <CTASubtitle>
      Discover your company’s full potential. Get transparent scores, track real improvement, and accelerate your ESG journey—no paperwork, no friction.
    </CTASubtitle>
    <CTAButton
      href="#"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 13 }}
    >Start Free ESG Self-Assessment</CTAButton>
    <CTADetails>
      Benchmark yourself instantly against global standards. Receive tailored, actionable improvement tips and share your results with stakeholders—all in one intuitive dashboard.
    </CTADetails>
  </CTASection>
);

export default ESGCTA;
