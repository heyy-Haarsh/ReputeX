// src/components/aceternity/CardSpotlight.jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const CardContainer = styled(motion.div)`
  position: relative;
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 170, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(135deg, #00ffaa, #00ddbb);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const Spotlight = styled(motion.div)`
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 255, 170, 0.4) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(40px);
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
`;

export const CardSpotlight = ({ children, className }) => {
  const containerRef = useRef(null);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightPosition({
      x: e.clientX - rect.left - 200,
      y: e.clientY - rect.top - 200,
    });
  };

  return (
    <CardContainer
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Spotlight
        style={{
          left: spotlightPosition.x,
          top: spotlightPosition.y,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};
