import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CardSpotlight } from "../aceternity/CardSpotlight";
import { features } from "./esgThemes";

const Section = styled.section`
  padding: 5rem 5%;
  background: linear-gradient(180deg, #000 0%, #001a14 100%);
`;
const Title = styled(motion.h2)`
  font-size: 3.2rem;
  text-align: center;
  margin-bottom: 1rem;
  span {
    background: linear-gradient(135deg, #00ffaa, #673ab7 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.18rem;
  color: rgba(255,255,255,0.6);
  max-width: 700px;
  margin: 0 auto 4rem;
`;

const FeaturesGrid = styled.div`
  max-width: 1400px; margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(340px,1fr));
  gap: 2.4rem;
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  background: ${(p) => p.$color}22;
  border: 2.5px solid ${(p) => p.$color};
  border-radius: 16px;
  display: flex;align-items: center;justify-content: center;
  font-size: 2.4rem;
  color: ${(p) => p.$color};
  margin-bottom: 1.3rem;
`;

const FeatureTitle = styled.h3`
  font-size:1.32rem;
  margin-bottom:1rem;
  color:#fff;
`;

const FeatureDescription = styled.p`
  font-size:1rem;
  line-height:1.7;
  color:rgba(255,255,255,0.76);
`;

const FeaturesSection = () => (
  <Section>
    <Title
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}>
      Why Use <span>Self-Reporting?</span>
    </Title>
    <Subtitle>
      An all-in-one ESG suite, bridging your efforts with real-world perception.
    </Subtitle>
    <FeaturesGrid>
      {features.map((feature, index) => (
        <CardSpotlight key={index}>
          <FeatureIcon $color={feature.color}>{feature.icon}</FeatureIcon>
          <FeatureTitle>{feature.title}</FeatureTitle>
          <FeatureDescription>{feature.description}</FeatureDescription>
        </CardSpotlight>
      ))}
    </FeaturesGrid>
  </Section>
);

export default FeaturesSection;
