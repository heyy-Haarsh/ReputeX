import streamlit as st # Use streamlit for secrets
import requests
import fitz  # PyMuPDF
import praw
import prawcore # Import for exceptions
import time
from transformers import pipeline
import os
import io # Import io for byte streams

# --- 1. INITIALIZE ALL YOUR MODELS AND KEYS (GLOBAL) ---
classifier = None
sentiment_analyzer = None
reddit = None

print("Attempting to load AI models and connect to Reddit (Greenwash)...")
try:
    # Model for classifying topics
    device_option = -1 # Default to CPU
    classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
        device=device_option
    )
    print("Zero-shot classifier loaded.")

    # Model for analyzing sentiment
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english",
        device=device_option
    )
    print("Sentiment analyzer loaded.")

except Exception as e:
    print(f"FATAL ERROR: Could not load AI models: {e}")

# --- Reddit PRAW Client ---
try:
    # Use Streamlit secrets to get keys (same as ai_core.py)
    if "REDDIT_CLIENT_ID" in st.secrets and "REDDIT_CLIENT_SECRET" in st.secrets:
        reddit = praw.Reddit(
            client_id=st.secrets["REDDIT_CLIENT_ID"],
            client_secret=st.secrets["REDDIT_CLIENT_SECRET"],
            user_agent="ReputeXGreenwash v1 by u/YourUsername", # Use a unique user agent
            read_only=True
        )
        print("Successfully connected to Reddit API (Greenwash).")
    else:
        print("FATAL ERROR: Reddit credentials not found in secrets.toml.")
except Exception as e:
    print(f"FATAL ERROR: Could not connect to Reddit: {e}")
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
        with fitz.open(stream=io.BytesIO(pdf_bytes), filetype="pdf") as doc: # Use io.BytesIO
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
    """
    if not reddit:
        print("Reddit client not initialized. Skipping search.")
        return 0.5 # Return neutral

    query = f'"{company_name}" {topic}' # Use quotes for company name
    print(f"\nSearching Reddit for: {query}...")

    sentiment_scores = []
    posts_found = 0
    analyzed_count = 0

    try:
        search_results = reddit.subreddit("all").search(
            query,
            sort="relevance",
            time_filter="month",
            limit=25
        )

        for submission in search_results:
            posts_found += 1
            text_to_analyze = f"{submission.title}. {submission.selftext}"

            if len(text_to_analyze) < 20 or submission.selftext == '[removed]' or submission.selftext == '[deleted]':
                continue

            if not sentiment_analyzer:
                print("Sentiment analyzer not available. Skipping analysis.")
                continue

            try:
                result = sentiment_analyzer(text_to_analyze, truncation=True, max_length=512)[0]
                analyzed_count += 1

                if result['label'] == 'POSITIVE':
                    sentiment_scores.append(result['score'])
                else: # 'NEGATIVE'
                    sentiment_scores.append(1.0 - result['score'])
            except Exception as analysis_error:
                print(f"Error during sentiment analysis for a post: {analysis_error}")

        if posts_found == 0:
            print("No Reddit submissions found for this topic.")
            return 0.5

        if not sentiment_scores:
            print(f"Found {posts_found} posts, but none were suitable for analysis.")
            return 0.5

        average_score = sum(sentiment_scores) / len(sentiment_scores)
        print(f"Found {posts_found} posts, analyzed {analyzed_count}. Average sentiment: {average_score:.2f}")
        return average_score

    except (praw.exceptions.PRAWException, prawcore.exceptions.PrawcoreException) as praw_error:
        print(f"PRAW specific error searching Reddit: {praw_error}")
        return 0.5
    except Exception as e:
        print(f"General error searching Reddit or analyzing posts: {e}")
        return 0.5

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
    
    # Simple keyword check for Greenwashing (vague vs. concrete)
    weasel_words = ["aim to", "strive", "target", "plan to", "potential", "hope to", "intend to", "may", "could", "believe", "commit to", "should"]
    concrete_words = ["achieved", "reduced", "increased", "implemented", "completed", "verified", "certified", "quantified", "%"]
    
    weasel_count = 0
    concrete_count = 0
    vague_flags = [] # <<< CHANGED: Store vague flags here
    text_lower = report_text.lower()
    for word in weasel_words:
        count = text_lower.count(word)
        if count > 0:
            weasel_count += count
            try:
                index = text_lower.index(word)
                snippet = "..." + report_text[max(0, index-30):min(len(report_text), index+len(word)+30)].replace("\n", " ") + "..."
                vague_flags.append(f"Vague term found: {snippet}") # <<< CHANGED
            except ValueError: pass
    for word in concrete_words:
        concrete_count += text_lower.count(word)
    
    total_relevant = weasel_count + concrete_count
    if total_relevant == 0:
        credibility_score = 50
    else:
        credibility_score = round((concrete_count / total_relevant) * 100)
    
    credibility_score = max(0, min(100, credibility_score)) # Clamp score

    # --- Step 2: Classify the PDF text for Topic Relevance ---
    print("Step 2: Analyzing report topics (Relevance)...")
    text_sample = report_text[:4000] # Use a large sample

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
        return {"status": "Error", "report": [f"Failed during report analysis: {e}"]} # Return error in list

    # --- Step 3 & 4: Loop Topics, Get Reddit Sentiment, Compare ---
    REPORT_RELEVANCE_THRESHOLD = 0.50 # If report relevance > 50%...
    REDDIT_SENTIMENT_THRESHOLD = 0.40 # ...and Reddit sentiment < 40% (negative)... -> Flag it!
    inconsistencies = [] # <<< CHANGED: Store inconsistency flags here

    print("\n" + "="*30)
    print(f"Step 3/4: Starting LIVE Reddit Analysis & Comparison for: {company_name}")
    print("="*30)

    for topic in esg_topics:
        report_relevance = report_scores.get(topic, 0)
        # Skip Reddit search if topic isn't prominent in report
        if (report_relevance < REPORT_RELEVANCE_THRESHOLD):
            print(f"  - Skipping Reddit search for '{topic}' (Report Relevance: {report_relevance*100:.0f}%)")
            continue

        live_reddit_sentiment = get_live_reddit_sentiment(company_name, topic)

        if (live_reddit_sentiment < REDDIT_SENTIMENT_THRESHOLD):
            flag_message = (
                f"HIGH RISK: Report features '{topic}' prominently (Relevance: {report_relevance*100:.0f}%), "
                f"but public Reddit sentiment is negative (Score: {live_reddit_sentiment*100:.0f}%)."
            )
            # Store the full inconsistency object
            inconsistencies.append({
                "topic": topic,
                "flag": flag_message,
                "report_relevance": round(report_relevance, 2),
                "reddit_sentiment": round(live_reddit_sentiment, 2)
            })

    # --- Step 5: Format and Return the Final Report ---
    print("\n--- Analysis Pipeline Complete ---")
    
    # --- MODIFICATION: Return structured report ---
    final_report = {
        "company_name": company_name,
        "credibility_score": credibility_score,
        "vague_flags": vague_flags[:3], # Show top 3 vague flags
        "inconsistencies": inconsistencies # Show all found inconsistencies
    }
    
    # Set final status based on findings
    if not vague_flags and not inconsistencies:
        final_report["status"] = "Consistent"
        # Add a default report message if both lists are empty
        final_report["vague_flags"] = ["No vague language flags found."]
        final_report["inconsistencies"] = [{"flag": "No major inconsistencies found between report and public sentiment."}]
    else:
        final_report["status"] = "Inconsistent / Vague"
        if not vague_flags: final_flags["vague_flags"] = ["No vague language flags found."]
        if not inconsistencies: inconsistencies.append({"flag": "No major inconsistencies found."})
    # --- END MODIFICATION ---

    print(f"Final Report Status for {company_name}: {final_report['status']}")
    return final_report

print("greenwash_analyzer.py loaded. Functions defined.")

