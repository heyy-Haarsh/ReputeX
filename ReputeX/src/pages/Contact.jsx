// src/pages/Contact.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiGithub, FiSend } from 'react-icons/fi';

const ContactPage = styled.div`
  background: ${props => props.theme.colors.darkBg};
  padding-top: 80px;
  min-height: 100vh;
`;

// Hero Section
const HeroSection = styled.section`
  padding: 4rem 5% 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 70%);
    animation: pulse 6s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

// Main Content
const ContentSection = styled.section`
  padding: 4rem 5%;
  max-width: 1400px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

// Contact Info Side
const InfoSide = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  transition: all 0.4s ease;
  
  &:hover {
    border-color: ${props => props.$color};
    background: rgba(0, 255, 170, 0.08);
    transform: translateX(10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${props => props.$color}30;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const InfoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.$color}15;
  border: 2px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: ${props => props.$color};
  transition: all 0.3s ease;
  
  ${InfoCard}:hover & {
    transform: scale(1.1) rotate(360deg);
    box-shadow: 0 0 30px ${props => props.$color}80;
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin-left: 75px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SocialIcon = styled(motion.a)`
  width: 50px;
  height: 50px;
  background: rgba(0, 255, 170, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.gradientButton};
    border-color: ${props => props.theme.colors.primaryGreen};
    color: ${props => props.theme.colors.darkBg};
    box-shadow: 0 0 30px ${props => props.theme.colors.primaryGreen}60;
    transform: translateY(-5px);
  }
`;

// Form Side
const FormSide = styled(motion.div)`
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 2rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textPrimary};
  
  span {
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 500;
`;

const Input = styled(motion.input)`
  padding: 1rem 1.5rem;
  background: rgba(0, 255, 170, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primaryGreen};
    background: rgba(0, 255, 170, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 170, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled(motion.textarea)`
  padding: 1rem 1.5rem;
  background: rgba(0, 255, 170, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primaryGreen};
    background: rgba(0, 255, 170, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 170, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1.2rem 3rem;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.gradientButton};
    transition: left 0.3s ease;
    z-index: -1;
  }
  
  &:hover::before {
    left: 0;
  }
  
  &:hover {
    color: ${props => props.theme.colors.darkBg};
    box-shadow: ${props => props.theme.shadows.glowStrong};
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const contactInfo = [
  {
    icon: <FiMail />,
    title: 'Email Us',
    text: 'support@esgpulse.com',
    color: '#00ff88'
  },
  {
    icon: <FiPhone />,
    title: 'Call Us',
    text: '+1 (555) 123-4567',
    color: '#00ddbb'
  },
  {
    icon: <FiMapPin />,
    title: 'Visit Us',
    text: '123 ESG Street, San Francisco, CA 94103',
    color: '#00bb99'
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add actual form submission logic
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <ContactPage>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Have questions about ESG-Pulse? We'd love to hear from you. 
          Send us a message and we'll respond as soon as possible.
        </HeroSubtitle>
      </HeroSection>

      {/* Main Content */}
      <ContentSection>
        <ContentGrid>
          {/* Contact Info */}
          <InfoSide
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {contactInfo.map((info, index) => (
              <InfoCard
                key={index}
                $color={info.color}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <InfoHeader>
                  <InfoIcon $color={info.color}>
                    {info.icon}
                  </InfoIcon>
                  <InfoTitle>{info.title}</InfoTitle>
                </InfoHeader>
                <InfoText>{info.text}</InfoText>
              </InfoCard>
            ))}
            
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                color: '#f7f7f7', 
                marginBottom: '1rem',
                marginLeft: '10px'
              }}>
                Follow Us
              </h3>
              <SocialLinks>
                <SocialIcon 
                  href="https://linkedin.com" 
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiLinkedin />
                </SocialIcon>
                <SocialIcon 
                  href="https://twitter.com" 
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTwitter />
                </SocialIcon>
                <SocialIcon 
                  href="https://github.com" 
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiGithub />
                </SocialIcon>
              </SocialLinks>
            </div>
          </InfoSide>

          {/* Contact Form */}
          <FormSide
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FormTitle>
              Send us a <span>Message</span>
            </FormTitle>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <TextArea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </FormGroup>
              
              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
                <FiSend />
              </SubmitButton>
            </Form>
          </FormSide>
        </ContentGrid>
      </ContentSection>
    </ContactPage>
  );
};

export default Contact;
