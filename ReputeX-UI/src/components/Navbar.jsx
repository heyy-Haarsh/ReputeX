// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: ${props => props.$scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'none'};
  border-bottom: ${props => props.$scrolled ? '1px solid rgba(0, 255, 170, 0.2)' : 'none'};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem 3%;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  font-family: ${props => props.theme.fonts.heading};
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: ${props => props.$isOpen ? '0' : '-100%'};
    width: 70%;
    max-width: 300px;
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
    bottom: -5px;
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

const CTAButton = styled(motion.button)`
  padding: 0.8rem 1.8rem;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  border: 2px solid ${props => props.theme.colors.primaryGreen};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
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
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: transparent;
  color: ${props => props.theme.colors.primaryGreen};
  font-size: 1.8rem;
  z-index: 1001;
  cursor: pointer;
  
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
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    backdrop-filter: blur(5px);
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
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
          <NavLink 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/dashboard'}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/leaderboard" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/leaderboard'}
          >
            Leaderboard
          </NavLink>
          <NavLink 
            to="/greenwash-detector" 
            onClick={() => setIsOpen(false)}
            $active={location.pathname === '/greenwash-detector'}
          >
            Greenwash Detector
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
