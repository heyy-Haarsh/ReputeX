# main.py (FastAPI Server)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Needed for React connection
import greenwash_analyzer # <-- IMPORT YOUR FILE HERE
import uvicorn # For running the server

app = FastAPI()

# --- CORS Configuration ---
# Allows your React app (running on localhost:3000) to talk to this server (localhost:8000)
origins = [
    "http://localhost:3000",  # Default React development port
    "http://localhost:3001",  # Another common React port
    # Add other origins if your React app runs elsewhere
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
    company_name: str = Form(...), # Get company name from form data
    file: UploadFile = File(...)   # Get file upload from form data
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

        # Call your master analysis function from greenwash_analyzer.py
        print("Calling AI core (greenwash_analyzer) for analysis...")
        # Make sure the function name matches exactly what's in your file
        final_report = greenwash_analyzer.run_full_analysis(company_name, pdf_bytes)
        print("Analysis complete. Sending report back to frontend.")

        # Return the resulting dictionary (FastAPI converts it to JSON)
        return final_report

    except Exception as e:
        # Catch potential errors during analysis
        print(f"Error during analysis: {e}")
        # Return a server error response to the frontend
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")

# --- (Optional) Add other endpoints for your friend's features below ---
# Example:
# @app.get("/some_other_feature/")
# async def get_other_data():
#     # import ai_core (friend's file)
#     # result = ai_core.some_function()
#     return {"message": "Data from other feature"}


# --- Run the Server Directly (for testing) ---
# This block allows you to run 'python main.py' to start the server
if __name__ == "__main__":
    print("Checking if backend components are ready...")
    # Basic check to see if the imported module has the necessary components loaded
    # You might need to adjust this check based on how greenwash_analyzer handles errors
    if greenwash_analyzer.classifier and greenwash_analyzer.sentiment_analyzer and greenwash_analyzer.reddit:
        print("Starting FastAPI server using Uvicorn on http://localhost:8000")
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    else:
        print("Error: Could not start server.")
        print("One or more components (AI models, Reddit client) failed to load in greenwash_analyzer.py.")
        print("Please check the console output when greenwash_analyzer.py was imported for specific errors.")