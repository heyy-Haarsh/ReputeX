import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiLayers, FiActivity, FiShield } from "react-icons/fi";
import { sampleQuestions } from "./esgThemes";

const Section = styled.section`
  padding: 5rem 5%;
  background: #000;
`;

const Card = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  background: rgba(0,255,170,0.07);
  backdrop-filter: blur(30px);
  border: 1.5px solid rgba(0,255,170,0.18);
  border-radius: 24px;
  padding: 2.6rem 2.2rem 2.8rem 2.2rem;
  position: relative;
  box-shadow: 0 16px 50px #673ab71a;
  &::before {
    content: "";position:absolute;top:0;left:0;right:0;
    height: 4px;background:linear-gradient(90deg,#00ffaa,#ab47bc);
  }
`;
const SectionTitle = styled(motion.h2)`
  font-size: 2.3rem;
  text-align: center;
  margin-bottom: 1rem;
  span {
    background: linear-gradient(135deg, #00ffaa, #ab47bc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
const Subtitle = styled.p`
  text-align: center;
  font-size: 1.12rem;
  color: rgba(255,255,255,0.7);
  max-width: 700px;
  margin: 0 auto 4rem;
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
  h4 {
    font-size:1.22rem;margin-bottom:1.4rem;color:#00ffaa;
    display: flex;align-items:center;gap:0.72rem;
    svg { font-size:1.35rem; }
  }
`;

const QuestionItem = styled(motion.div)`
  display:flex;align-items:center;gap:1rem;
  padding:1.2rem 1.1rem 1.2rem 1rem;
  background:rgba(0,255,170,0.09);
  border-left:3px solid #00ffaa;
  border-radius:9px;
  margin-bottom: 1rem;
  cursor:pointer;transition:all 0.27s;
  &:hover {
    background:rgba(0,255,170,0.16);
    transform:translateX(11px);
  }
  input[type="checkbox"] {
    width: 23px;height:23px;accent-color:#00ffaa;cursor:pointer;
  }
  label {
    flex:1;
    color:rgba(255,255,255,0.94);
    font-size:1.04rem;
    cursor:pointer;
  }
`;

const FormPreviewSection = () => {
  const [checkedItems, setCheckedItems] = useState(sampleQuestions.map(q => q.checked));
  const toggleCheck = index => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  return (
    <Section>
      <SectionTitle
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.69 }}
      >
        <span>Sample Assessment Questions</span>
      </SectionTitle>
      <Subtitle>
        A preview of interactive questions you'll answer for all E, S, and G pillars.
      </Subtitle>
      <Card
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
      >
        <FormSection>
          <h4><FiLayers /> Environmental</h4>
          {sampleQuestions.slice(0, 2).map((q, index) => (
            <QuestionItem
              key={index}
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.45 }}
              onClick={() => toggleCheck(index)}
            >
              <input
                type="checkbox"
                checked={checkedItems[index]}
                onChange={() => toggleCheck(index)}
              />
              <label>{q.question}</label>
            </QuestionItem>
          ))}
        </FormSection>
        <FormSection>
          <h4><FiActivity /> Social</h4>
          {sampleQuestions.slice(2, 4).map((q, index) => (
            <QuestionItem
              key={index + 2}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 2) * 0.1, duration: 0.45 }}
              onClick={() => toggleCheck(index + 2)}
            >
              <input
                type="checkbox"
                checked={checkedItems[index + 2]}
                onChange={() => toggleCheck(index + 2)}
              />
              <label>{q.question}</label>
            </QuestionItem>
          ))}
        </FormSection>
        <FormSection>
          <h4><FiShield /> Governance</h4>
          {sampleQuestions.slice(4, 6).map((q, index) => (
            <QuestionItem
              key={index + 4}
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 4) * 0.1, duration: 0.45 }}
              onClick={() => toggleCheck(index + 4)}
            >
              <input
                type="checkbox"
                checked={checkedItems[index + 4]}
                onChange={() => toggleCheck(index + 4)}
              />
              <label>{q.question}</label>
            </QuestionItem>
          ))}
        </FormSection>
      </Card>
    </Section>
  );
};

export default FormPreviewSection;
