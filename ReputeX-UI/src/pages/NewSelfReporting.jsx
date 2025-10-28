// src/pages/SelfReporting.jsx
import React, { useState } from 'react';
import axios from 'axios'; // <-- Make sure axios is installed (npm install axios)
import styled, { ThemeProvider } from 'styled-components'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiLoader, FiXCircle, FiCheckSquare, FiSquare, FiCheck } from 'react-icons/fi';
import { theme } from '../theme.js'; // Import your theme

// --- 1. Component Styling (Matches ReputeX Theme) ---
const PageContainer = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  padding: 120px 5% 4rem; /* Add margin to clear the navbar */
  color: ${props => props.theme.colors.textPrimary};
`;

const FormTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

const FormSubtitle = styled(motion.p)`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 3rem;
  font-size: 1.1em;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const QuestionGroup = styled(motion.div)`
  padding: 2rem 2.5rem;
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primaryGreen}80;
    box-shadow: 0 0 30px ${props => props.$color || 'rgba(0, 255, 170, 0.1)'};
  }
`;

const GroupTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.$color};
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 1rem;
`;

const QuestionBlock = styled.div`
  margin-bottom: 1.75rem;
`;

const QuestionLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: ${props => props.theme.colors.textPrimary};
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

// Custom Radio Button
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  transition: color 0.2s ease;

  input[type="radio"] {
    display: none; 
  }

  .icon {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.border};
    transition: color 0.2s ease, transform 0.2s ease;
    margin-right: 0.5rem;
  }
  
  input[type="radio"]:checked + .icon {
    color: ${props => props.$color || props.theme.colors.primaryGreen};
    transform: scale(1.1);
  }

  &:hover .icon {
     color: ${props => props.$color || props.theme.colors.primaryGreen}80;
  }
   
  input[type="radio"]:disabled + .icon,
  input[type="radio"]:disabled ~ span {
     opacity: 0.5;
     cursor: not-allowed;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box; /* Add this */

  &:focus {
    border-color: ${props => props.$color || props.theme.colors.primaryGreen};
    box-shadow: 0 0 15px ${props => props.$color || 'rgba(0, 255, 170, 0.3)'};
    outline: none;
  }
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: ${props => props.theme.colors.gradientButton};
  color: ${props => props.theme.colors.darkBg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(motion.div)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ResultsArea = styled(motion.div)`
  margin-top: 3rem;
  padding: 2.5rem;
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 5px solid ${props => props.theme.colors.primaryGreen};
`;

const ScoreText = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  
  span {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primaryGreen};
  }
`;

const PillarScore = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed ${props => props.theme.colors.borderFaint};
  font-size: 1.1em;
  
  span:first-child {
    font-weight: 600;
    color: ${props => props.theme.colors.textPrimary};
  }
  span:last-child {
    font-weight: 700;
    color: ${props => props.theme.colors.primaryGreen};
  }
`;

const SuggestionsList = styled.ul`
    padding-left: 20px;
    font-size: 1rem;
    line-height: 1.6;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 1.5rem;

    li {
        margin-bottom: 0.5rem;
    }
    strong {
        color: ${props => props.theme.colors.textPrimary};
    }
`;

const ErrorText = styled(motion.p)`
    color: #ff6b6b;
    text-align: center;
    margin: 1rem 0;
    font-weight: 600;
    font-size: 1.1rem;
`;
const LoadingText = styled(motion.p)`
    color: ${props => props.theme.colors.primaryGreen};
    text-align: center;
    margin: 1rem 0;
    font-size: 1.1rem;
`;

// --- 2. The Component Logic (from companycheck.jsx) ---
function CompanyCheck() {
  const [formData, setFormData] = useState({
    company_name: '',
    ghg_disclosed: 'no',
    renewable_percent: '', // Use empty string for number placeholders
    water_target: 'no',
    waste_reduction_program: 'no',
    biodiversity_policy: 'no',
    grievance_mechanism: 'no',
    gender_pay_gap: '',
    supplier_audits: 'no',
    employee_training_hours: '',
    data_privacy_policy: 'no',
    board_esg_committee: 'no',
    board_female_percent: '',
    anticorruption_training: 'no',
    exec_comp_esg_linked: 'no',
    independent_board_chair: 'no',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // For number inputs, allow empty string
    if (type === 'number') {
         setFormData(prev => ({
            ...prev,
            [name]: value
         }));
    } else {
         setFormData(prev => ({
            ...prev,
            [name]: value,
         }));
    }
  };

  // Handle blur for number inputs to default empty to 0
  const handleBlur = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number' && value === '') {
        setFormData(prev => ({
            ...prev,
            [name]: 0
        }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const dataToSend = {
      company_name: formData.company_name.trim(),
      ghg_disclosed: formData.ghg_disclosed === 'yes',
      renewable_percent: parseFloat(formData.renewable_percent) || 0,
      water_target: formData.water_target === 'yes',
      waste_reduction_program: formData.waste_reduction_program === 'yes',
      biodiversity_policy: formData.biodiversity_policy === 'yes',
      grievance_mechanism: formData.grievance_mechanism === 'yes',
      gender_pay_gap: parseFloat(formData.gender_pay_gap) || 0,
      supplier_audits: formData.supplier_audits === 'yes',
      employee_training_hours: parseInt(formData.employee_training_hours, 10) || 0,
      data_privacy_policy: formData.data_privacy_policy === 'yes',
      board_esg_committee: formData.board_esg_committee === 'yes',
      board_female_percent: parseFloat(formData.board_female_percent) || 0,
      anticorruption_training: formData.anticorruption_training === 'yes',
      exec_comp_esg_linked: formData.exec_comp_esg_linked === 'yes',
      independent_board_chair: formData.independent_board_chair === 'yes',
    };
    
    // --- FIX: Use the correct endpoint from server.py ---
    const API_URL = 'http://localhost:8000/submit_self_assessment/'; 
    
    try {
      const response = await axios.post(API_URL, dataToSend);
      setAnalysisResult(response.data);
    } catch (err) {
      console.error('Self-Assessment API Error:', err.response || err);
      let backendError = err.message || 'Could not connect to server or process data.';
      if (err.response?.data?.detail) {
          try {
              const errors = err.response.data.detail;
              if (Array.isArray(errors)) {
                backendError = errors.map(er => `${er.loc[1]}: ${er.msg}`).join(', ');
              } else {
                backendError = err.response.data.detail;
              }
          } catch(e) {
              backendError = 'An unknown error occurred on the server.';
          }
      }
      setError(`Error: ${backendError}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderReport = () => {
    if (!analysisResult) return null;
    return (
      <ResultsArea
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ScoreText>Your Internal Score: <span>{analysisResult.base_sa_score}/100</span></ScoreText>
        <p style={{textAlign: 'center', color: '#fff'}}>Status: {analysisResult.status}</p>
        <p style={{textAlign: 'center', color: '#aaa', marginTop: '20px', fontWeight: 'bold'}}>PILLAR BREAKDOWN</p>
        
        <PillarScore><span>E: Environmental</span> <span>{analysisResult.e_score} / 33</span></PillarScore>
        <PillarScore><span>S: Social</span> <span>{analysisResult.s_score} / 35</span></PillarScore>
        <PillarScore><span>G: Governance</span> <span>{analysisResult.g_score} / 32</span></PillarScore>
        
        <h3 style={{color: '#aaa', marginTop: '25px'}}>Suggestions:</h3>
        <SuggestionsList>
          {/* Using <li> tags for proper list structure */}
          <li><strong>Environmental:</strong> Focus on implementing a <strong>waste reduction program</strong> and enhancing <strong>biodiversity</strong> protection efforts.</li>
          <li><strong>Social:</strong> Reduce the <strong>gender pay gap</strong> percentage and formalize <strong>employee training programs</strong> (hours).</li>
          <li><strong>Governance:</strong> Ensure the <strong>Board Chair is formally independent</strong> and executive compensation is tied to <strong>ESG performance</strong>.</li>
        </SuggestionsList>
      </ResultsArea>
    );
  };

  // --- Animation Variants ---
  const animVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <FormTitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        Quick ESG Self-Assessment
      </FormTitle>
      <FormSubtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        Answer these 15 questions to generate a preliminary internal score based on common framework metrics.
      </FormSubtitle>
      <StyledForm onSubmit={handleSubmit}>

        {/* --- Company Name --- */}
        <QuestionGroup custom={1} initial="hidden" animate="visible" variants={animVariants} $color="#00ffaa">
          <QuestionLabel htmlFor="company_name">Company Name:</QuestionLabel>
          <FormInput $color="#00ffaa" type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required />
        </QuestionGroup>

        {/* --- E: Environmental Questions (5) --- */}
        <QuestionGroup custom={2} initial="hidden" animate="visible" variants={animVariants} $color="#00ffaa">
          <GroupTitle $color="#00ffaa">E: Environmental Metrics (Max 33 pts)</GroupTitle>
          
          <QuestionBlock>
            <QuestionLabel>1. Publicly disclose Scope 1 & 2 GHG emissions?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa"><input type="radio" name="ghg_disclosed" value="yes" checked={formData.ghg_disclosed === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="ghg_disclosed" value="no" checked={formData.ghg_disclosed === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel htmlFor="renewable_percent">2. What % of energy consumed is renewable (0-100)?</QuestionLabel>
            <FormInput $color="#00ffaa" type="number" id="renewable_percent" name="renewable_percent" value={formData.renewable_percent} onChange={handleChange} onBlur={handleBlur} min="0" max="100" step="0.1" required placeholder="Enter a value from 0 to 100"/>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>3. Is there a formal water reduction target?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa"><input type="radio" name="water_target" value="yes" checked={formData.water_target === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="water_target" value="no" checked={formData.water_target === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>

          <QuestionBlock>
            <QuestionLabel>4. Is there a program to reduce waste generation?</QuestionLabel> 
            <RadioContainer>
              <RadioLabel $color="#00ffaa"><input type="radio" name="waste_reduction_program" value="yes" checked={formData.waste_reduction_program === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="waste_reduction_program" value="no" checked={formData.waste_reduction_program === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>5. Do you have a policy addressing biodiversity impact?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa"><input type="radio" name="biodiversity_policy" value="yes" checked={formData.biodiversity_policy === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="biodiversity_policy" value="no" checked={formData.biodiversity_policy === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
        </QuestionGroup>

        {/* --- S: Social Questions (5) --- */}
        <QuestionGroup custom={3} initial="hidden" animate="visible" variants={animVariants} $color="#00ddbb">
          <GroupTitle $color="#00ddbb">S: Social Metrics (Max 35 pts)</GroupTitle>
          
          <QuestionBlock>
            <QuestionLabel>6. Is there an independent, anonymous grievance mechanism for employees?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ddbb"><input type="radio" name="grievance_mechanism" value="yes" checked={formData.grievance_mechanism === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="grievance_mechanism" value="no" checked={formData.grievance_mechanism === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>

          <QuestionBlock>
            <QuestionLabel htmlFor="gender_pay_gap">7. What is the gender pay gap percentage (0-100)?</QuestionLabel>
            <FormInput $color="#00ddbb" type="number" id="gender_pay_gap" name="gender_pay_gap" value={formData.gender_pay_gap} onChange={handleChange} onBlur={handleBlur} min="0" max="100" step="0.1" required placeholder="Enter a value from 0 to 100"/>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>8. Do you conduct social compliance audits on key suppliers?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ddbb"><input type="radio" name="supplier_audits" value="yes" checked={formData.supplier_audits === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="supplier_audits" value="no" checked={formData.supplier_audits === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel htmlFor="employee_training_hours">9. Average hours of employee training per year?</QuestionLabel>
            <FormInput $color="#00ddbb" type="number" id="employee_training_hours" name="employee_training_hours" value={formData.employee_training_hours} onChange={handleChange} onBlur={handleBlur} min="0" required placeholder="Enter average hours"/>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>10. Is there a publicly available data privacy policy?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ddbb"><input type="radio" name="data_privacy_policy" value="yes" checked={formData.data_privacy_policy === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="data_privacy_policy" value="no" checked={formData.data_privacy_policy === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
        </QuestionGroup>

        {/* --- G: Governance Questions (5) --- */}
        <QuestionGroup custom={4} initial="hidden" animate="visible" variants={animVariants} $color="#673ab7">
          <GroupTitle $color="#673ab7">G: Governance Metrics (Max 32 pts)</GroupTitle>
          
          <QuestionBlock>
            <QuestionLabel>11. Is there an independent board committee for ESG oversight?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7"><input type="radio" name="board_esg_committee" value="yes" checked={formData.board_esg_committee === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="board_esg_committee" value="no" checked={formData.board_esg_committee === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel htmlFor="board_female_percent">12. What % of the board identifies as female (0-100)?</QuestionLabel>
            <FormInput $color="#673ab7" type="number" id="board_female_percent" name="board_female_percent" value={formData.board_female_percent} onChange={handleChange} onBlur={handleBlur} min="0" max="100" step="0.1" required placeholder="Enter a value from 0 to 100"/>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>13. Is annual anti-corruption training mandatory?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7"><input type="radio" name="anticorruption_training" value="yes" checked={formData.anticorruption_training === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="anticorruption_training" value="no" checked={formData.anticorruption_training === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>14. Is executive compensation explicitly linked to ESG targets?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7"><input type="radio" name="exec_comp_esg_linked" value="yes" checked={formData.exec_comp_esg_linked === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="exec_comp_esg_linked" value="no" checked={formData.exec_comp_esg_linked === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          
          <QuestionBlock>
            <QuestionLabel>15. Is the Board Chair independent (not also CEO)?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7"><input type="radio" name="independent_board_chair" value="yes" checked={formData.independent_board_chair === 'yes'} onChange={handleChange} required /> <span className="icon"><FiCheckSquare /></span> Yes</RadioLabel>
              <RadioLabel $color="#ff6b6b"><input type="radio" name="independent_board_chair" value="no" checked={formData.independent_board_chair === 'no'} onChange={handleChange} required /> <span className="icon"><FiXCircle /></span> No</RadioLabel>
            </RadioContainer>
          </QuestionBlock>
        </QuestionGroup>
        
        <AnimatePresence>
            {error && <ErrorText initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{error}</ErrorText>}
        </AnimatePresence>
        
        {isLoading && <LoadingText>Calculating... Please wait...</LoadingText>}
        
        <SubmitButton 
          type="submit" 
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <><LoadingSpinner><FiLoader /></LoadingSpinner> Calculating...</>
          ) : (
            <><FiSend /> Calculate Score & Get Tips</>
          )}
        </SubmitButton>
      </StyledForm>
      
      {/* --- Conditional Results Area --- */}
      <AnimatePresence>
        {analysisResult && renderReport()}
      </AnimatePresence>
    </PageContainer>
  );
}

// --- Wrapper Component to provide theme ---
const newSelfReporting = () => (
  <ThemeProvider theme={theme}>
    <CompanyCheck />
  </ThemeProvider>
);

export default newSelfReporting;

