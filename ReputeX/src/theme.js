// src/theme.js
export const theme = {
  colors: {
    // Background colors - Dark theme
    darkBg: '#000000',
    darkBgSecondary: '#0a0a0a',
    lightBg: '#0d1f1c',
    cardBg: 'rgba(0, 255, 170, 0.05)',
    
    // Primary green colors (from your image)
    primaryGreen: '#00ffaa',
    secondaryGreen: '#00d4aa',
    darkGreen: '#008866',
    accentCyan: '#00ffdd',
    
    // ESG Pillar colors - Green theme variants
    environmental: '#00ff88',
    social: '#00ddbb',
    governance: '#00bb99',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    textAccent: '#00ffaa',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #00ffaa 0%, #00ddbb 50%, #00bb99 100%)',
    gradientHero: 'linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 31, 28, 0.8) 100%)',
    gradientButton: 'linear-gradient(135deg, #00ffaa 0%, #00ddbb 100%)',
    
    // Border and accent
    border: 'rgba(0, 255, 170, 0.2)',
    borderHover: 'rgba(0, 255, 170, 0.5)',
  },
  
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Space Grotesk', 'Inter', sans-serif",
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '2rem',
    lg: '4rem',
    xl: '6rem',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
  
  shadows: {
    glow: '0 0 30px rgba(0, 255, 170, 0.3)',
    glowStrong: '0 0 50px rgba(0, 255, 170, 0.5)',
    card: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
};
