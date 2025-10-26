// src/components/aceternity/StickyScroll.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styled from "styled-components";

const StickySection = styled.section`
  position: relative;
  padding: 5rem 5%;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StickyContent = styled(motion.div)`
  position: sticky;
  top: 100px;
  height: fit-content;
  
  @media (max-width: 1024px) {
    position: relative;
    top: 0;
  }
`;

const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
`;

const ContentCard = styled(motion.div)`
  min-height: 400px;
  background: rgba(0, 255, 170, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 170, 0.2);
  border-radius: 20px;
  padding: 3rem;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #ffffff;
    
    span {
      background: linear-gradient(135deg, #00ffaa, #00ddbb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const StickyScroll = ({ content, stickyContent }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <StickySection ref={containerRef}>
      <ContentWrapper>
        <StickyContent>
          {stickyContent}
        </StickyContent>
        
        <ScrollContent>
          {content.map((item, index) => (
            <ContentCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </ContentCard>
          ))}
        </ScrollContent>
      </ContentWrapper>
    </StickySection>
  );
};
