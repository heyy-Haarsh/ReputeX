# server.py
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import ai_core 
import greenwash_analyzer
import company_checker # <<< 1. IMPORT YOUR NEW FILE
from company_checker import SelfAssessmentData # <<< 2. IMPORT THE DATA MODEL
import uvicorn
import io
import asyncio

app = FastAPI()

# --- CORS Middleware (Keep as is) ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Default Vite port
    # Add your deployed React app's URL here if you have one
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- /api/analyze Endpoint (Keep as is) ---
@app.get("/api/analyze")
async def analyze_company(company: str):
    """
    Endpoint for the main dashboard analysis.
    """
    print(f"API Server: Received request for company: {company}")
    try:
        # --- Run main analysis in a thread to prevent blocking ---
        result_data = await asyncio.to_thread(ai_core.get_combined_analysis, company)
        print("API Server: Analysis complete, sending response.")
        return result_data
    except Exception as e:
        print(f"API Server: Error during analysis: {e}")
        return {"error": str(e), "message": "Failed to analyze company."}

# --- /api/analyze-greenwash Endpoint (Keep as is) ---
@app.post("/api/analyze-greenwash")
async def analyze_greenwash_report(
    company_name: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Endpoint to analyze an uploaded PDF for greenwashing.
    """
    print(f"API Server: Received Greenwash request for company: {company_name}")
    print(f"API Server: Received file: {file.filename}")

    try:
        pdf_bytes = await file.read()
        if not pdf_bytes:
            return {"status": "Error", "report": "Uploaded file is empty."}
        
        print("API Server: Starting Greenwash analysis... (This may take a while)")
        
        # --- RUN THE SLOW, BLOCKING FUNCTION IN A THREAD ---
        result_data = await asyncio.to_thread(
            greenwash_analyzer.run_full_analysis, company_name, pdf_bytes
        )

        print("API Server: Greenwash analysis complete, sending response.")
        return result_data

    except Exception as e:
        print(f"API Server: Error during greenwash analysis: {e}")
        return {"status": "Error", "report": str(e), "message": "Failed to process PDF file."}

# --- 3. ADD NEW ENDPOINT FOR SELF-ASSESSMENT ---
@app.post("/submit_self_assessment/") # <<< Matches your companycheck.jsx
async def run_company_check(data: SelfAssessmentData): # FastAPI uses the Pydantic model
    """
    Endpoint to calculate the 15-question self-assessment score.
    """
    print(f"API Server: Received Company Check request for: {data.company_name}")
    try:
        # Call the calculation function from the separate module
        # This function is fast, no thread needed
        result_data = company_checker.calculate_sa_score(data)
        print("API Server: Self-Assessment calculation complete.")
        return result_data
    except Exception as e:
        print(f"API Server: Error during self-assessment: {e}")
        return {"error": str(e), "message": "Failed to process self-assessment."}

# --- (Optional) Leaderboard Endpoint (Keep as is) ---
@app.get("/api/leaderboard")
async def get_leaderboard_data():
     try:
         print("API Server: Received request for leaderboard")
         # Wrap this in a thread too, as it's very slow
         leaderboard = await asyncio.to_thread(ai_core.get_leaderboard)
         print("API Server: Leaderboard complete, sending response.")
         return leaderboard
     except Exception as e:
         print(f"API Server: Error during leaderboard generation: {e}")
         return {"error": str(e), "message": "Failed to get leaderboard."}

# --- Run the server (Keep as is) ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

