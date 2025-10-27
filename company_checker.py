# This is a new file: company_checker.py
# It contains the logic for the 15-question self-assessment form

from pydantic import BaseModel, Field

# --- 1. NEW DATA MODEL (Self-Assessment Form Input - 15 Questions) ---
class SelfAssessmentData(BaseModel):
    company_name: str = Field(..., description="Name of the company being assessed.")
    
    # E - Environmental (5 questions, Max 33 points)
    ghg_disclosed: bool = Field(..., description="Publicly disclose Scope 1 & 2 GHG emissions?")
    renewable_percent: float = Field(..., ge=0, le=100, description="% of energy consumed from renewables.")
    water_target: bool = Field(..., description="Formal water reduction target exists?")
    waste_reduction_program: bool = Field(..., description="Program to reduce waste generation exists?") 
    biodiversity_policy: bool = Field(..., description="Policy addressing biodiversity impact exists?") 
    
    # S - Social (5 questions, Max 35 points)
    grievance_mechanism: bool = Field(..., description="Independent, anonymous grievance mechanism for employees?")
    gender_pay_gap: float = Field(..., ge=0, le=100, description="Gender pay gap % (0 is best).")
    supplier_audits: bool = Field(..., description="Conduct social compliance audits on key suppliers?")
    employee_training_hours: int = Field(..., ge=0, description="Average hours of employee training per year?") 
    data_privacy_policy: bool = Field(..., description="Publicly available data privacy policy exists?") 
    
    # G - Governance (5 questions, Max 32 points)
    board_esg_committee: bool = Field(..., description="Independent board committee for ESG oversight?")
    board_female_percent: float = Field(..., ge=0, le=100, description="% of board identifying as female.")
    anticorruption_training: bool = Field(..., description="Mandatory annual anti-corruption training?")
    exec_comp_esg_linked: bool = Field(..., description="Executive compensation linked to ESG targets?")
    independent_board_chair: bool = Field(..., description="Is the Board Chair independent (not CEO)?")

# --- 2. SELF-ASSESSMENT SCORING FUNCTION (NEW FEATURE LOGIC) ---
def calculate_sa_score(sa_data: SelfAssessmentData) -> dict:
    """
    Calculates the detailed Self-Assessment (SA) score for E, S, and G pillars (Max Total: 100).
    """
    
    e_score = 0
    s_score = 0
    g_score = 0
    
    # --- E-Pillar Scoring (Max 33 points) ---
    e_score += sa_data.ghg_disclosed * 7
    e_score += min(sa_data.renewable_percent * 0.10, 10) # 10 pts for 100%
    e_score += sa_data.water_target * 5
    e_score += sa_data.waste_reduction_program * 6
    e_score += sa_data.biodiversity_policy * 5
    e_score = max(0, min(e_score, 33)) # Clamp E score
    
    # --- S-Pillar Scoring (Max 35 points) ---
    s_score += sa_data.grievance_mechanism * 7
    s_score += max(0, 7 - (sa_data.gender_pay_gap * 0.7)) # Pay gap penalty (0% gap = 7 pts)
    s_score += sa_data.supplier_audits * 7
    s_score += min(sa_data.employee_training_hours * 0.7, 7) # 7 pts for 10+ hours avg
    s_score += sa_data.data_privacy_policy * 7
    s_score = max(0, min(s_score, 35)) # Clamp S score

    # --- G-Pillar Scoring (Max 32 points) ---
    g_score += sa_data.board_esg_committee * 7
    g_score += min(sa_data.board_female_percent * 0.12, 6) # Max 6 points at 50%
    g_score += sa_data.anticorruption_training * 6
    g_score += sa_data.exec_comp_esg_linked * 7
    g_score += sa_data.independent_board_chair * 6
    g_score = max(0, min(g_score, 32)) # Clamp G score

    # Total Score (Max 100)
    final_sa_score = g_score + s_score + e_score
    final_sa_score = max(0, min(final_sa_score, 100))
    
    print(f"Self-Assessment Score for {sa_data.company_name}: {final_sa_score}")

    return {
        "company_name": sa_data.company_name,
        "base_sa_score": round(final_sa_score, 1),
        "e_score": round(e_score, 1),
        "s_score": round(s_score, 1),
        "g_score": round(g_score, 1),
        "status": "Self-Assessment Complete"
    }

print("company_checker.py loaded. Functions defined.")