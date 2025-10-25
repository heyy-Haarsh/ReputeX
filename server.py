# server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # To allow React to call it
import ai_core # Import your existing AI logic file
import uvicorn

# Initialize the FastAPI app
app = FastAPI()

# --- CORS Middleware ---
# This allows your React app (running on a different port)
# to make requests to this backend server.
# Be more specific with origins in production!
origins = [
    "http://localhost",       # Allow localhost (standard)
    "http://localhost:3000",  # Default React dev server port
    "http://localhost:5173",  # Default Vite dev server port (likely yours)
    # Add the URL of your deployed React app if you deploy it
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# --- API Endpoint Definition ---
@app.get("/api/analyze") # The URL path React will call
async def analyze_company(company: str): # Takes 'company' as a URL parameter (e.g., /api/analyze?company=Tesla)
    """
    Endpoint to trigger the ESG analysis for a given company.
    """
    print(f"API Server: Received request for company: {company}")
    try:
        # Call your main analysis function from ai_core.py
        result_data = ai_core.get_combined_analysis(company)
        print("API Server: Analysis complete, sending response.")
        return result_data # FastAPI automatically converts the dict to JSON
    except Exception as e:
        print(f"API Server: Error during analysis: {e}")
        # Return an error response (optional but good practice)
        return {"error": str(e), "message": "Failed to analyze company."}

# --- (Optional) Add Endpoints for Other Features ---
# Example for Leaderboard:
# @app.get("/api/leaderboard")
# async def get_leaderboard_data():
#     try:
#         leaderboard = ai_core.get_leaderboard() # Assuming you have this function
#         return leaderboard
#     except Exception as e:
#         return {"error": str(e), "message": "Failed to get leaderboard."}

# --- Run the server (for local development) ---
if __name__ == "__main__":
    # Host='0.0.0.0' makes it accessible on your network
    # Port 8000 is a common choice for backend APIs
    uvicorn.run(app, host="0.0.0.0", port=8000)