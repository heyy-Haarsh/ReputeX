// src/components/aceternity/AuroraBackground.jsx
import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const AuroraWrapper = styled.div`
  position: relative;
  overflow: hidden;
  z-index:0;
  pointer-events: none; 
  background: linear-gradient(135deg, #000000 0%, #001a14 100%);
`;

const AuroraGradient = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 50%;
    height: 50%;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
  }
  
  &::before {
    background: radial-gradient(circle, #00ffaa 0%, transparent 70%);
    top: 0;
    left: 0;
    animation: aurora1 15s ease-in-out infinite;
  }
  
  &::after {
    background: radial-gradient(circle, #00ddbb 0%, transparent 70%);
    bottom: 0;
    right: 0;
    animation: aurora2 20s ease-in-out infinite;
  }
  
  @keyframes aurora1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20%, -20%) scale(1.2); }
  }
  
  @keyframes aurora2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-20%, 20%) scale(1.2); }
  }
`;

const AuroraContent = styled.div`
  position: relative;
  z-index: 0;
`;

export const AuroraBackground = ({ children }) => {
  return (
    <AuroraWrapper>
      <AuroraGradient
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <AuroraContent>{children}</AuroraContent>
    </AuroraWrapper>
  );
};
