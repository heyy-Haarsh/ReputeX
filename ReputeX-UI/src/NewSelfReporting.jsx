import React, { useState } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiLoader, FiXCircle, FiCheckSquare } from 'react-icons/fi';
import { theme } from './theme.js';

// --- Styled Components definitions (same as before, omitted for brevity)... ---
// (You can keep your existing styled-components)

const PageContainer = styled(motion.div)`
  max-width: 960px;
  margin: 0 auto;
  padding: 100px 3% 4rem;
  color: ${props => props.theme.colors.textPrimary};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const FormTitle = styled(motion.h1)`
  font-size: 3.6rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.25em;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.6rem;
  }
`;
const FormSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 680px;
  margin: 0 auto 3rem;
  text-align: center;
  font-weight: 500;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;
const QuestionGroup = styled(motion.div)`
  background: rgba(0, 255, 170, 0.06);
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.8rem 3.2rem;
  box-shadow: 0 8px 20px rgba(0, 255, 170, 0.1);
  transition: border-color 0.3s ease;
  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primaryGreen}AA;
    box-shadow: 0 10px 28px ${props => props.$color || 'rgba(0, 255, 170, 0.15)'};
  }
`;
const GroupTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 700;
  color: ${props => props.$color};
  margin-bottom: 1.8rem;
  border-bottom: 2px solid ${props => props.theme.colors.borderFaint};
  padding-bottom: 1rem;
`;
const QuestionBlock = styled.div`
  margin-bottom: 2rem;
`;
const QuestionLabel = styled.label`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  display: block;
`;
const RadioContainer = styled.div`
  display: flex;
  gap: 1.8rem;
  margin-top: 0.6rem;
`;
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.06rem;
  color: ${props => props.theme.colors.textSecondary};
  user-select: none;
  input[type="radio"] {
    display: none;
  }
  .icon {
    font-size: 1.6rem;
    color: ${props => props.theme.colors.border};
    transition: color 0.3s ease, transform 0.2s ease;
  }
  input[type="radio"]:checked + .icon {
    color: ${props => props.$color || props.theme.colors.primaryGreen};
    transform: scale(1.3);
  }
  &:hover .icon {
    color: ${props => props.$color || props.theme.colors.primaryGreen}CC;
  }
  input[type="radio"]:disabled + .icon,
  input[type="radio"]:disabled ~ span {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const FormInput = styled.input`
  width: 100%;
  font-size: 1.05rem;
  padding: 0.85rem 1.2rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1.3px solid ${props => props.theme.colors.border};
  background: rgba(255, 255, 255, 0.06);
  color: ${props => props.theme.colors.textPrimary};
  transition: border-color 0.3s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  &:focus {
    border-color: ${props => props.$color || props.theme.colors.primaryGreen};
    box-shadow: 0 0 16px ${props => props.$color || 'rgba(0, 255, 170, 0.35)'};
    outline: none;
  }
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;
const SubmitButton = styled(motion.button)`
  margin-top: 2.5rem;
  padding: 1.3rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.theme.colors.darkBg};
  background: ${props => props.theme.colors.gradientButton};
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 0 40px ${props => props.theme.colors.primaryGreen}7f;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  transition: all 0.35s ease;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
  &:hover:not(:disabled) {
    box-shadow: 0 0 65px ${props => props.theme.colors.primaryGreen}aa;
    transform: translateY(-4px);
  }
`;
const LoadingSpinner = styled(motion.div)`
  animation: spin 1.5s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const ErrorText = styled(motion.p)`
  color: #ff6b6b;
  text-align: center;
  font-weight: 700;
  margin: 1.2rem 0 0;
  font-size: 1.1rem;
`;
const LoadingText = styled(motion.p)`
  color: ${props => props.theme.colors.primaryGreen};
  text-align: center;
  margin: 1.5rem 0 0;
  font-weight: 600;
  font-size: 1.1rem;
`;
const ResultsArea = styled(motion.div)`
  margin-top: 3.5rem;
  padding: 2.5rem 3rem;
  background: rgba(0, 255, 170, 0.05);
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 6px solid ${props => props.theme.colors.primaryGreen};
  color: ${props => props.theme.colors.textPrimary};
`;
const ScoreText = styled.h2`
  font-weight: 800;
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.textPrimary};
  span {
    font-size: 3rem;
    color: ${props => props.theme.colors.primaryGreen};
  }
`;
const PillarScore = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px dashed ${props => props.theme.colors.borderFaint};
  font-size: 1.15rem;
  span:first-child {
    font-weight: 700;
    color: ${props => props.theme.colors.textPrimary};
  }
  span:last-child {
    font-weight: 900;
    color: ${props => props.theme.colors.primaryGreen};
  }
`;
const SuggestionsList = styled.ul`
  margin-top: 1.8rem;
  padding-left: 20px;
  font-size: 1.05rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
  li {
    margin-bottom: 0.75rem;
  }
  strong {
    font-weight: 700;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

// --- Form logic and rendering ---

function CompanyCheck() {
  const [formData, setFormData] = useState({
    company_name: '',
    ghg_disclosed: 'no',
    renewable_percent: '',
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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

    try {
      const API_URL = 'http://localhost:8000/submit_self_assessment/';
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
        } catch {
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
        <p style={{ textAlign: 'center', color: '#ccc', fontWeight: '600' }}>
          Status: {analysisResult.status}
        </p>
        <PillarScore><span>E: Environmental</span> <span>{analysisResult.e_score} / 33</span></PillarScore>
        <PillarScore><span>S: Social</span> <span>{analysisResult.s_score} / 35</span></PillarScore>
        <PillarScore><span>G: Governance</span> <span>{analysisResult.g_score} / 32</span></PillarScore>

        <h3 style={{ marginTop: '2rem', color: '#aaa' }}>Suggestions:</h3>
        <SuggestionsList>
          <li><strong>Environmental:</strong> Focus on implementing a <strong>waste reduction program</strong> and enhancing <strong>biodiversity</strong> protection efforts.</li>
          <li><strong>Social:</strong> Reduce the <strong>gender pay gap</strong> percentage and formalize <strong>employee training programs</strong> (hours).</li>
          <li><strong>Governance:</strong> Ensure the <strong>Board Chair is independent</strong> and executive compensation tied to <strong>ESG performance</strong>.</li>
        </SuggestionsList>
      </ResultsArea>
    );
  };

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <FormTitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        Quick ESG Self-Assessment
      </FormTitle>
      <FormSubtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        Answer 15 questions for a preliminary ESG score based on common framework metrics.
      </FormSubtitle>
      <StyledForm onSubmit={handleSubmit}>
        
        {/* Environmental */}
        <QuestionGroup custom={1} initial="hidden" animate="visible" variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } }
        }} $color="#00ffaa">
          <GroupTitle $color="#00ffaa">E: Environmental Metrics (Max 33 pts)</GroupTitle>
          <QuestionBlock>
            <QuestionLabel>1. Publicly disclose Scope 1 & 2 GHG emissions?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa">
                <input type="radio" name="ghg_disclosed" value="yes" checked={formData.ghg_disclosed === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="ghg_disclosed" value="no" checked={formData.ghg_disclosed === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel htmlFor="renewable_percent">2. What % of energy consumed is renewable (0-100)?</QuestionLabel>
            <FormInput $color="#00ffaa" type="number" id="renewable_percent" name="renewable_percent" value={formData.renewable_percent} onChange={handleChange} onBlur={handleBlur} min="0" max="100" step="0.1" required placeholder="Enter a value from 0 to 100"/>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>3. Is there a formal water reduction target?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa">
                <input type="radio" name="water_target" value="yes" checked={formData.water_target === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="water_target" value="no" checked={formData.water_target === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>4. Is there a program to reduce waste generation?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa">
                <input type="radio" name="waste_reduction_program" value="yes" checked={formData.waste_reduction_program === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="waste_reduction_program" value="no" checked={formData.waste_reduction_program === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>5. Do you have a policy addressing biodiversity impact?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ffaa">
                <input type="radio" name="biodiversity_policy" value="yes" checked={formData.biodiversity_policy === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="biodiversity_policy" value="no" checked={formData.biodiversity_policy === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
        </QuestionGroup>

        {/* Social */}
        <QuestionGroup custom={2} initial="hidden" animate="visible" variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }
        }} $color="#00ddbb">
          <GroupTitle $color="#00ddbb">S: Social Metrics (Max 35 pts)</GroupTitle>
          <QuestionBlock>
            <QuestionLabel>6. Is there an independent, anonymous grievance mechanism for employees?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ddbb">
                <input type="radio" name="grievance_mechanism" value="yes" checked={formData.grievance_mechanism === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="grievance_mechanism" value="no" checked={formData.grievance_mechanism === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel htmlFor="gender_pay_gap">7. What is the gender pay gap percentage (0-100)?</QuestionLabel>
            <FormInput $color="#00ddbb" type="number" id="gender_pay_gap" name="gender_pay_gap" value={formData.gender_pay_gap} onChange={handleChange} onBlur={handleBlur} min="0" max="100" step="0.1" required placeholder="Enter a value from 0 to 100"/>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>8. Do you conduct social compliance audits on key suppliers?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ddbb">
                <input type="radio" name="supplier_audits" value="yes" checked={formData.supplier_audits === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="supplier_audits" value="no" checked={formData.supplier_audits === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel htmlFor="employee_training_hours">9. Average hours of employee training per year?</QuestionLabel>
            <FormInput $color="#00ddbb" type="number" id="employee_training_hours" name="employee_training_hours" value={formData.employee_training_hours} onChange={handleChange} onBlur={handleBlur} min="0" required placeholder="Enter average hours"/>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>10. Is there a publicly available data privacy policy?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#00ddbb">
                <input type="radio" name="data_privacy_policy" value="yes" checked={formData.data_privacy_policy === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="data_privacy_policy" value="no" checked={formData.data_privacy_policy === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
        </QuestionGroup>

        {/* Governance */}
        <QuestionGroup custom={3} initial="hidden" animate="visible" variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }
        }} $color="#673ab7">
          <GroupTitle $color="#673ab7">G: Governance Metrics (Max 32 pts)</GroupTitle>
          <QuestionBlock>
            <QuestionLabel>11. Is there an independent board committee for ESG oversight?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7">
                <input type="radio" name="board_esg_committee" value="yes" checked={formData.board_esg_committee === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="board_esg_committee" value="no" checked={formData.board_esg_committee === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel htmlFor="board_female_percent">12. What % of the board identifies as female (0-100)?</QuestionLabel>
            <FormInput $color="#673ab7" type="number" id="board_female_percent" name="board_female_percent" value={formData.board_female_percent} onChange={handleChange} onBlur={handleBlur} min="0" max="100" step="0.1" required placeholder="Enter a value from 0 to 100"/>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>13. Is annual anti-corruption training mandatory?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7">
                <input type="radio" name="anticorruption_training" value="yes" checked={formData.anticorruption_training === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="anticorruption_training" value="no" checked={formData.anticorruption_training === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>14. Is executive compensation explicitly linked to ESG targets?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7">
                <input type="radio" name="exec_comp_esg_linked" value="yes" checked={formData.exec_comp_esg_linked === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="exec_comp_esg_linked" value="no" checked={formData.exec_comp_esg_linked === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
          <QuestionBlock>
            <QuestionLabel>15. Is the Board Chair independent (not also CEO)?</QuestionLabel>
            <RadioContainer>
              <RadioLabel $color="#673ab7">
                <input type="radio" name="independent_board_chair" value="yes" checked={formData.independent_board_chair === 'yes'} onChange={handleChange} required />
                <span className="icon"><FiCheckSquare /></span> Yes
              </RadioLabel>
              <RadioLabel $color="#ff6b6b">
                <input type="radio" name="independent_board_chair" value="no" checked={formData.independent_board_chair === 'no'} onChange={handleChange} required />
                <span className="icon"><FiXCircle /></span> No
              </RadioLabel>
            </RadioContainer>
          </QuestionBlock>
        </QuestionGroup>

        {error && <ErrorText initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{error}</ErrorText>}
        {isLoading && <LoadingText>Calculating... Please wait...</LoadingText>}
        <SubmitButton
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? (
            <>
              <LoadingSpinner><FiLoader /></LoadingSpinner> Calculating...
            </>
          ) : (
            <>
              <FiSend /> Calculate Score & Get Tips
            </>
          )}
        </SubmitButton>
      </StyledForm>
      <AnimatePresence>
        {analysisResult && renderReport()}
      </AnimatePresence>
    </PageContainer>
  );
}

// Wrapper component for theme
const NewSelfReporting = () => (
  <ThemeProvider theme={theme}>
    <CompanyCheck />
  </ThemeProvider>
);

export default NewSelfReporting;
