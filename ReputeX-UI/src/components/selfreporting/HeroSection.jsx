import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 5%;
  position: relative;
  background: linear-gradient(135deg, #000000 0%, #001a14 100%);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
`;

const Title = styled(motion.h1)`
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

const Subtitle = styled(motion.p)`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Button = styled(motion.button)`
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

const SplineBg = styled.div`
  position: absolute;
  left: 50%;
  top: 60%;
  width: 80vw;
  height: 70vh;
  z-index: 1;
  pointer-events: none;
  transform: translate(-50%, -55%);
  opacity: 0.47;
`;

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>

      <Content>
        <Title
          initial={{ opacity: 0, y: 52 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ESG <span>Self-Reporting Engine</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.8 }}
        >
          Instantly evaluate your company's ESG performance with our{" "}
          <span style={{ color: "#00ffaa" }}>AI-powered</span> tool. Get
          transparent, accurate scores—blending your data and public insights.
        </Subtitle>

        <Button
          whileHover={{ scale: 1.065 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.79 }}
          onClick={() => {
            console.log("✅ Button clicked");
            navigate("/newSelfReporting");
          }}
        >
          Start Your Assessment
        </Button>
      </Content>
    </Wrapper>
  );
};

export default HeroSection;
