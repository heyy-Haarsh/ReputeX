import fitz  # PyMuPDF
import praw
import time
from transformers import pipeline
import os # For potentially loading keys from environment later

# --- 1. INITIALIZE ALL YOUR MODELS AND KEYS (GLOBAL) ---
# These are loaded only ONCE when the module is imported (e.g., when FastAPI starts).

# --- Reddit API Keys ---
# TODO: Move these to environment variables or a config file for security
REDDIT_CLIENT_ID = "O1rzwhhnFxVR0v_tm3_fFg" # Your Client ID
REDDIT_CLIENT_SECRET = "BDUR2dgSzOm_Ki29-DEu7QFa7Y2Nkw" # Your Client Secret
REDDIT_USER_AGENT = "ReputeXAnalyzer v1 by u/Overall_Tiger_2319" # Your Reddit Username

# --- AI Model Pipelines ---
# Initialize as None, attempt to load in a try block
classifier = None
sentiment_analyzer = None
reddit = None

print("Attempting to load AI models and connect to Reddit...")
try:
    # Model for classifying topics in the report (Zero-Shot)
    classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli"
    )
    print("Zero-shot classifier loaded.")

    # Model for analyzing sentiment of Reddit posts
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    print("Sentiment analyzer loaded.")

except Exception as e:
    print(f"FATAL ERROR: Could not load AI models: {e}")
    # Consider raising an exception or handling this more gracefully depending on app needs

# --- Reddit PRAW Client ---
try:
    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT,
        # Adding read_only=True as we are only searching, not posting/commenting
        read_only=True
    )
    # Check if connection is valid by trying to access a property
    _ = reddit.user.me() # Accessing this forces authentication check
    print("Successfully connected to Reddit API.")
except Exception as e:
    print(f"FATAL ERROR: Could not connect to Reddit: {e}")
    print("Please check your API keys and user agent string.")
    # Reddit client remains None

# --- 2. DEFINE YOUR HELPER FUNCTIONS ---

def extract_text_from_pdf_bytes(pdf_bytes):
    """
    Extracts all text from a PDF given as bytes from a web upload.
    """
    text = ""
    if not pdf_bytes:
        print("Error: Received empty PDF data.")
        return None
    try:
        # Open the PDF from the byte stream
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            print(f"Reading PDF with {len(doc)} pages...")
            for page_num, page in enumerate(doc):
                text += page.get_text()
            print("Successfully extracted text from PDF.")
        return text
    except Exception as e:
        print(f"Error reading PDF bytes: {e}")
        return None

def get_live_reddit_sentiment(company_name, topic):
    """
    Fetches real Reddit submissions, analyzes sentiment, and returns a score (0.0 to 1.0).
    Uses V3 logic with truncation.
    """
    # Check if Reddit client initialized successfully
    if not reddit:
        print("Reddit client not initialized. Skipping search.")
        return 0.5 # Return neutral

    query = f'{company_name} {topic}'
    print(f"\nSearching Reddit for: {query}...")

    sentiment_scores = []
    posts_found = 0
    analyzed_count = 0

    try:
        search_results = reddit.subreddit("all").search(
            query,
            sort="relevance",
            time_filter="month",
            limit=25 # Limit results to avoid excessive processing
        )

        for submission in search_results:
            posts_found += 1
            text_to_analyze = f"{submission.title}. {submission.selftext}"

            # Skip if text is too short or clearly placeholder/removed
            if len(text_to_analyze) < 20 or submission.selftext == '[removed]' or submission.selftext == '[deleted]':
                continue

            # Ensure sentiment_analyzer loaded correctly
            if not sentiment_analyzer:
                 print("Sentiment analyzer not available. Skipping analysis.")
                 continue # Or return neutral 0.5? Decide on error handling.

            # Analyze sentiment with truncation for long posts
            try:
                result = sentiment_analyzer(text_to_analyze, truncation=True, max_length=512)[0]
                analyzed_count += 1

                if result['label'] == 'POSITIVE':
                    sentiment_scores.append(result['score'])
                else: # 'NEGATIVE'
                    # Convert negative score (e.g., 0.99 NEG) to low positive scale score (e.g., 0.01)
                    sentiment_scores.append(1.0 - result['score'])
            except Exception as analysis_error:
                print(f"Error during sentiment analysis for a post: {analysis_error}")
                # Optionally skip this post or assign a neutral score

        if posts_found == 0:
            print("No Reddit submissions found for this topic.")
            return 0.5 # Return neutral

        if not sentiment_scores:
            print(f"Found {posts_found} posts, but none were suitable for analysis (e.g., too short, removed).")
            return 0.5 # Return neutral

        average_score = sum(sentiment_scores) / len(sentiment_scores)
        print(f"Found {posts_found} posts, analyzed {analyzed_count}. Average sentiment: {average_score:.2f}")
        return average_score

    except praw.exceptions.PRAWException as praw_error:
        print(f"PRAW specific error searching Reddit: {praw_error}")
        return 0.5 # Return neutral on API errors
    except Exception as e:
        print(f"General error searching Reddit or analyzing posts: {e}")
        return 0.5 # Return neutral on other errors

# --- 3. DEFINE YOUR "MASTER" FUNCTION (This is what FastAPI will call) ---

def run_full_analysis(company_name, pdf_file_bytes):
    """
    Runs the entire analysis pipeline: PDF extraction, topic relevance,
    Reddit sentiment search, and comparison.
    Returns a dictionary containing the analysis report.
    """

    # --- Pre-computation Checks ---
    if not classifier or not sentiment_analyzer:
        print("Error: AI models not loaded. Cannot perform analysis.")
        return {"status": "Error", "report": "AI models did not load correctly. Check server logs."}
    if not reddit:
        print("Error: Reddit client not connected. Cannot perform analysis.")
        return {"status": "Error", "report": "Could not connect to Reddit API. Check credentials/server logs."}
    if not company_name or not isinstance(company_name, str) or len(company_name.strip()) == 0:
        return {"status": "Error", "report": "Invalid or missing company name."}
    if not pdf_file_bytes:
         return {"status": "Error", "report": "No PDF file data received."}

    # --- Step 1: Extract text from the PDF ---
    print("\n--- Starting Full Analysis ---")
    print("Step 1: Extracting text from PDF...")
    report_text = extract_text_from_pdf_bytes(pdf_file_bytes)
    if not report_text:
        return {"status": "Error", "report": "Failed to extract text from the uploaded PDF."}

    # --- Step 2: Classify the PDF text for Topic Relevance ---
    print("Step 2: Analyzing report topics (Relevance)...")
    # Use a larger sample for potentially better topic detection, but mindful of performance
    text_sample = report_text[:4000] # Increased sample size

    # Define topics within the function or pass them in - ensures they are always available
    esg_topics = [
        "climate change", "renewable energy", "employee safety",
        "factory conditions", "data privacy", "supply chain",
        "labor practices", "diversity", "business ethics"
    ]

    try:
        report_results = classifier(text_sample, esg_topics, multi_label=True)
        report_scores = {label: score for label, score in zip(report_results['labels'], report_results['scores'])}
        print("Report topic relevance analysis complete.")
    except Exception as e:
        print(f"Error during report topic classification: {e}")
        return {"status": "Error", "report": f"Failed during report analysis: {e}"}


    # --- Step 3 & 4: Loop Topics, Get Reddit Sentiment, Compare ---
    REPORT_RELEVANCE_THRESHOLD = 0.50 # If report relevance > 50%...
    REDDIT_SENTIMENT_THRESHOLD = 0.40 # ...and Reddit sentiment < 40% (negative)... -> Flag it!
    inconsistencies = []

    print("\n" + "="*30)
    print(f"Step 3/4: Starting LIVE Reddit Analysis & Comparison for: {company_name}")
    print("="*30)

    for topic in esg_topics: # Iterate through defined topics
        report_relevance = report_scores.get(topic, 0) # Get relevance, default to 0 if topic missing

        # Get live Reddit sentiment for this topic
        live_reddit_sentiment = get_live_reddit_sentiment(company_name, topic)

        # Apply comparison logic
        if (report_relevance > REPORT_RELEVANCE_THRESHOLD) and (live_reddit_sentiment < REDDIT_SENTIMENT_THRESHOLD):
            flag_message = (
                f"HIGH RISK: Report features '{topic}' prominently (Relevance: {report_relevance*100:.0f}%), "
                f"but public Reddit sentiment is negative (Score: {live_reddit_sentiment*100:.0f}%)."
            )
            inconsistencies.append({
                "topic": topic,
                "flag": flag_message,
                "report_relevance": round(report_relevance, 2), # Store rounded scores
                "reddit_sentiment": round(live_reddit_sentiment, 2)
            })
        # Optional: Add a small delay between Reddit searches if needed, PRAW handles some rate limiting
        # time.sleep(0.5)

    # --- Step 5: Format and Return the Final Report ---
    print("\n--- Analysis Pipeline Complete ---")
    if not inconsistencies:
        final_report = {
            "status": "Consistent",
            "company_name": company_name,
            "report": "No major inconsistencies found between the report's focus and public Reddit sentiment."
        }
    else:
        final_report = {
            "status": "Inconsistent",
            "company_name": company_name,
            "report": inconsistencies # List of flagged issues
        }

    print(f"Final Report Status for {company_name}: {final_report['status']}")
    return final_report

# --- End of ai_core.py ---
print("ai_core.py loaded. Functions defined.")