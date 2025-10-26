# server.py
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import ai_core
import greenwash_analyzer
import uvicorn
import io
import asyncio # <<< 1. IMPORT asyncio

app = FastAPI()

# --- CORS Middleware (Keep as is) ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
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
    print(f"API Server: Received request for company: {company}")
    try:
        # --- Run main analysis in a thread to prevent blocking ---
        result_data = await asyncio.to_thread(ai_core.get_combined_analysis, company)
        print("API Server: Analysis complete, sending response.")
        return result_data
    except Exception as e:
        print(f"API Server: Error during analysis: {e}")
        return {"error": str(e), "message": "Failed to analyze company."}


# --- /api/analyze-greenwash Endpoint ---
@app.post("/api/analyze-greenwash")
async def analyze_greenwash_report( # <<< 2. Make sure this is 'async def'
    company_name: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Endpoint to analyze an uploaded PDF for greenwashing.
    """
    print(f"API Server: Received Greenwash request for company: {company_name}")
    print(f"API Server: Received file: {file.filename}")

    try:
        pdf_bytes = await file.read() # This part must be async
        if not pdf_bytes:
            return {"status": "Error", "report": "Uploaded file is empty."}
        
        print("API Server: Starting Greenwash analysis... (This may take a while)")

        # --- 3. RUN THE SLOW, BLOCKING FUNCTION IN A THREAD ---
        result_data = await asyncio.to_thread(
            greenwash_analyzer.run_full_analysis, company_name, pdf_bytes
        )
        # --- End of Fix ---

        print("API Server: Greenwash analysis complete, sending response.")
        return result_data

    except Exception as e:
        print(f"API Server: Error during greenwash analysis: {e}")
        return {"status": "Error", "report": str(e), "message": "Failed to process PDF file."}

# --- (Optional) Leaderboard Endpoint ---
# (If you have this, wrap its logic in 'await asyncio.to_thread' too)

# --- Run the server (Keep as is) ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

