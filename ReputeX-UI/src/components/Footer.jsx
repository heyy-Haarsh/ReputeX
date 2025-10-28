// src/components/Footer.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiGithub, FiMail, FiArrowUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #000000;
  color: ${props => props.theme.colors.textSecondary};
  padding: 4rem 5% 2rem;
  position: relative;
  border-top: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 3% 2rem;
  }
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primaryGreen}, transparent);
  box-shadow: 0 0 20px ${props => props.theme.colors.primaryGreen};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const BrandSection = styled(motion.div)`
  h3 {
    font-size: 2rem;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.7;
    max-width: 350px;
    margin-bottom: 1.5rem;
  }
`;

const LinkSection = styled(motion.div)`
  h4 {
    color: ${props => props.theme.colors.textPrimary};
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
    
    &::before {
      content: '→';
      position: absolute;
      left: -15px;
      opacity: 0;
      color: ${props => props.theme.colors.primaryGreen};
      transition: all 0.3s ease;
    }
    
    &:hover {
      color: ${props => props.theme.colors.primaryGreen};
      padding-left: 15px;
      
      &::before {
        opacity: 1;
        left: 0;
      }
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialIcon = styled(motion.a)`
  width: 45px;
  height: 45px;
  background: rgba(0, 255, 170, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.gradientButton};
    border-color: ${props => props.theme.colors.primaryGreen};
    color: ${props => props.theme.colors.darkBg};
    box-shadow: 0 0 30px ${props => props.theme.colors.primaryGreen}60;
    transform: translateY(-5px) rotate(360deg);
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primaryGreen};
    }
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: ${props => props.theme.colors.gradientButton};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.darkBg};
  cursor: pointer;
  box-shadow: 0 5px 25px rgba(0, 255, 170, 0.5);
  z-index: 999;
  
  &:hover {
    box-shadow: 0 8px 35px rgba(0, 255, 170, 0.7);
  }
`;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <FooterContainer>
        <GlowLine />
        
        <FooterContent>
          <BrandSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>ReputeX</h3>
            <p>
              Real-time ESG reputation tracking powered by AI-driven news and social sentiment analysis. 
              Make informed, data-driven ESG decisions with confidence.
            </p>
            <SocialIcons>
              <SocialIcon 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiLinkedin />
              </SocialIcon>
              <SocialIcon 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTwitter />
              </SocialIcon>
              <SocialIcon 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiGithub />
              </SocialIcon>
              <SocialIcon 
                href="mailto:contact@esgpulse.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiMail />
              </SocialIcon>
            </SocialIcons>
          </BrandSection>
          
          <LinkSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h4>Product</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/greenwash-detector">Greenwash Detector</Link></li>
              <li><Link to="/api">API Access</Link></li>
            </ul>
          </LinkSection>
          
          <LinkSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </LinkSection>
          
          <LinkSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4>Resources</h4>
            <ul>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </LinkSection>
        </FooterContent>
        

        <FooterBottom>
          <Copyright>© 2025 ReputeX. All rights reserved.</Copyright>
          <LegalLinks>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </LegalLinks>
        </FooterBottom>
      </FooterContainer>
      
      <ScrollToTop
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, rotate: -360 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FiArrowUp />
      </ScrollToTop>
    </>
  );
};

export default Footer;
