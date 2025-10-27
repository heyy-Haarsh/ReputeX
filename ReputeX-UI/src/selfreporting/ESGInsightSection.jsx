import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  padding: 4rem 6vw 2.5rem 6vw;
  background: linear-gradient(120deg, black 0, black 100%);
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h2)`
  font-size: 2.3rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  text-align: center;
  color: #fff;
  span {
    background: linear-gradient(135deg, #21efaa, #a57cea 95%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.74);
  margin-bottom: 2.6rem;
`;

const List = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Row = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.45rem;
  padding: 1.3rem 1.6rem;
  background: rgba(21, 239, 170, 0.06);
  border-radius: 18px;
  box-shadow: 0 2px 24px #21efaa14;
  @media(max-width:600px){
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
  }
`;

// This wrapper positions the score at the center of the PillarBar
const PillarBarWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PillarBar = styled(motion.svg)`
  width: 80px;
  height: 80px;
  display: block;
`;

const Score = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(99deg,#21efaa,#a57cea 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  text-shadow: 0 1px 8px #161f33cc;
  letter-spacing: 0.02em;
`;

const PillarMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media(max-width:600px){ align-items: center;}
`;

const Label = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${p=>p.color};
  margin-bottom: 0.2rem;
`;

const Description = styled.div`
  font-size: 1.03rem;
  color: rgba(255,255,255,0.77);
  margin-top: 0.1rem;
`;

const insights = [
  {
    label: "Environmental",
    score: 88,
    color: "#21efaa",
    desc: "Carbon tracking and energy policies are industry leading."
  },
  {
    label: "Social",
    score: 74,
    color: "#a57cea",
    desc: "Diversity & inclusion is strong. Focus more on equal pay."
  },
  {
    label: "Governance",
    score: 81,
    color: "#ffa951",
    desc: "Board diversity is solid; connect incentives to ESG impact."
  }
];

function getCircleProps(score) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score/100) * circumference;
  return { radius, circumference, offset };
}

const ESGInsightSection = () => (
  <Section>
    <Title
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      ESG <span>Insights</span>
    </Title>
    <Subtitle>
      Each pillar score and key highlight is shown below.
    </Subtitle>
    <List>
      {insights.map((pillar, idx) => {
        const {radius, circumference, offset} = getCircleProps(pillar.score);
        return (
          <Row
            key={pillar.label}
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * idx, duration: 0.45 + 0.09 * idx }}
          >
            <PillarBarWrapper>
              <PillarBar viewBox="0 0 80 80">
                ircle
                  cx="40" cy="40" r={radius}
                  fill="none"
                  stroke="#222"
                  strokeWidth="7"7"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={pillar.color}
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  initial={{strokeDashoffset: circumference}}
                  animate={{strokeDashoffset: offset}}
                  transition={{ duration: 1.3, delay: 0.09 * idx }}
                  strokeLinecap="round"
                />
              </PillarBar>
              <Score>{pillar.score}</Score>
            </PillarBarWrapper>
            <PillarMain>
              <Label color={pillar.color}>{pillar.label}</Label>
              <Description>{pillar.desc}</Description>
            </PillarMain>
          </Row>
        );
      })}
    </List>
  </Section>
);

export default ESGInsightSection;
