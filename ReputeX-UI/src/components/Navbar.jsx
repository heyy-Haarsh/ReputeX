// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiTrendingUp, FiShield, FiFileText } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.2rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: ${props => props.$scrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.7)'};
  backdrop-filter: blur(20px);
  border-bottom: ${props => props.$scrolled ? '1px solid rgba(0, 255, 170, 0.2)' : 'none'};
  box-shadow: ${props => props.$scrolled ? '0 8px 32px rgba(0, 0, 0, 0.4)' : 'none'};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem 3%;
  }
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: 800;
  font-family: ${props => props.theme.fonts.heading};
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease;
  cursor: pointer;
  letter-spacing: -1px;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.6rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: ${props => props.$isOpen ? '0' : '-100%'};
    width: 70%;
    max-width: 350px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.98);
    backdrop-filter: blur(20px);
    border-left: 1px solid ${props => props.theme.colors.border};
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    transition: right 0.3s ease;
    padding: 2rem;
  }
`;

const NavLink = styled(Link)`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.$active ? props.theme.colors.primaryGreen : props.theme.colors.textPrimary};
  position: relative;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background: ${props => props.theme.colors.primaryGreen};
    transition: width 0.3s ease;
    box-shadow: ${props => props.$active ? `0 0 10px ${props.theme.colors.primaryGreen}` : 'none'};
  }
  
  &:hover {
    color: ${props => props.theme.colors.primaryGreen};
    
    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.3rem;
  }
`;

const FeatureDropdown = styled.div`
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const FeatureButton = styled.button`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primaryGreen};
  }
  
  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.3rem;
    width: 100%;
    justify-content: center;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 20px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  background: rgba(0, 0, 0, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 255, 170, 0.2);
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    width: 100%;
    margin-top: 1rem;
  }
`;

const FeatureItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.textPrimary};
  
  &:hover {
    background: rgba(0, 255, 170, 0.1);
    transform: translateX(5px);
  }
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.$color};
  }
  
  div {
    flex: 1;
    
    h4 {
      font-size: 1rem;
      margin-bottom: 0.3rem;
      color: ${props => props.theme.colors.textPrimary};
    }
    
    p {
      font-size: 0.85rem;
      color: ${props => props.theme.colors.textSecondary};
      line-height: 1.4;
    }
  }
`;

const CTAButton = styled(motion.button)`
  padding: 0.9rem 2rem;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  
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
    box-shadow: ${props => props.theme.shadows.glow};
    border-color: transparent;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 1.1rem 2rem;
    font-size: 1.1rem;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  font-size: 2rem;
  z-index: 1001;
  cursor: pointer;
  border: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Overlay = styled.div`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999;
    backdrop-filter: blur(5px);
  }
`;

const features = [
  {
    icon: <FiTrendingUp />,
    title: 'ESG Tracker',
    description: 'Real-time ESG reputation analysis',
    color: '#00ff88',
    path: '/dashboard'
  },
  {
    icon: <FiShield />,
    title: 'Greenwash Detector',
    description: 'Detect misleading ESG claims',
    color: '#00ddbb',
    path: '/greenwash-detector'
  },
  {
    icon: <FiFileText />,
    title: 'Self-Reporting',
    description: 'Generate ESG compliance reports',
    color: '#00bb99',
    path: '/self-reporting'
  }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowFeatures(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <Nav
        $scrolled={scrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo to="/">ReputeX</Logo>
        
        <NavLinks $isOpen={isOpen}>
          <NavLink 
            to="/" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/'}
          >
            Home
          </NavLink>
          
          <FeatureDropdown>
            <FeatureButton
              onClick={() => setShowFeatures(!showFeatures)}
              $isOpen={showFeatures}
            >
              Features
              <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </FeatureButton>
            
            <AnimatePresence>
              {showFeatures && (
                <DropdownMenu
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {features.map((feature, index) => (
                    <FeatureItem
                      key={index}
                      to={feature.path}
                      $color={feature.color}
                      onClick={() => {
                        setShowFeatures(false);
                        setIsOpen(false);
                      }}
                    >
                      {feature.icon}
                      <div>
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                      </div>
                    </FeatureItem>
                  ))}
                </DropdownMenu>
              )}
            </AnimatePresence>
          </FeatureDropdown>
          
          <NavLink 
            to="/leaderboard" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/leaderboard'}
          >
            Leaderboard
          </NavLink>

          <NavLink 
            to="/about" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/about'}
          >
            About
          </NavLink>
          
          <NavLink 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/contact'}
          >
            Contact
          </NavLink>
          
          <CTAButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate('/dashboard');
              setIsOpen(false);
            }}
          >
            Get Started
          </CTAButton>
        </NavLinks>
        
        <MenuToggle onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </MenuToggle>
      </Nav>
      
      <Overlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />
    </>
  );
};

export default Navbar;
