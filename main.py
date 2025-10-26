# main.py (FastAPI Server)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import greenwash_analyzer # <-- IMPORTS THE USER'S AI LOGIC
import uvicorn

app = FastAPI()

# --- CORS Configuration ---
# *** FIX: ADDED PORT 5173 FOR VITE FRONTEND ***
origins = [
    "http://localhost:5173",  # VITE FRONTEND (USER'S APP)
    "http://localhost:3000",  # Standard React development port
    "http://localhost:3001",  # Another common React port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (POST, GET, etc.)
    allow_headers=["*"], # Allow all headers
)

# --- API Endpoint for Greenwashing Analysis ---
@app.post("/analyze_company/")
async def handle_analysis_request(
    company_name: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Receives company name and PDF file from the frontend,
    calls the greenwash analyzer, and returns the report.
    """
    print(f"Received request for company: {company_name}, file: {file.filename}")

    # Basic check for PDF file type
    if file.content_type != "application/pdf":
        print("Error: Invalid file type.")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        # Read the entire file content as bytes
        pdf_bytes = await file.read()

        # Call your master analysis function
        print("Calling AI core (greenwash_analyzer) for analysis...")
        final_report = greenwash_analyzer.run_full_analysis(company_name, pdf_bytes)
        print("Analysis complete. Sending report back to frontend.")

        # Return the resulting dictionary
        return final_report

    except Exception as e:
        # Catch potential errors during analysis
        print(f"Error during analysis: {e}")
        # Return a server error response to the frontend
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")


# --- Run the Server Directly (for testing) ---
if __name__ == "__main__":
    print("Checking if backend components are ready...")
    
    # Check if the necessary components from greenwash_analyzer.py are loaded
    if greenwash_analyzer.classifier and greenwash_analyzer.sentiment_analyzer and greenwash_analyzer.reddit:
        print("Starting FastAPI server using Uvicorn on http://localhost:8000")
        # Added reload=False to the final run to avoid issues with multiprocessing, 
        # but kept it in the initial call to simplify the user's workflow
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 
    else:
        print("Error: Could not start server.")
        print("One or more components (AI models, Reddit client) failed to load. Check console for errors.")