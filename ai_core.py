# This is your file: ai_core.py
# This is your *entire* backend logic.

import streamlit as st
import requests
import praw
import pandas as pd
from transformers import pipeline

# --- 1. AI MODEL LOADING ---
# Use cache_resource to only load these models ONCE.
@st.cache_resource
def load_analyzers():
    """
    Load and return the AI models.
    This function is cached so models are not reloaded on every run.
    """
    print("AI Core: Loading AI models...")
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        # device=0  # Keep your device setting if you added it
    )
    esg_classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
        # device=0  # Keep your device setting if you added it
    )
    print("AI Core: AI models loaded.")
    return sentiment_analyzer, esg_classifier

# --- 2. DATA FETCHING FUNCTIONS ---

@st.cache_data(ttl=3600) # Cache data for 1 hour
def get_news(company_name: str) -> list:
    """
    Fetches news articles from GNews.
    """
    print(f"AI Core: Fetching news for {company_name}")
    try:
        api_key = st.secrets["GNEWS_API_KEY"]
        query = f'"{company_name}" AND (ESG OR environmental OR social OR governance)'
        
        url = "https://gnews.io/api/v4/search"
        params = {
            "q": query, "lang": "en", "max": 10, "apikey": api_key, "in": "title,description"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        articles = response.json().get('articles', [])
        
        news_list = []
        for article in articles:
            news_list.append({
                "source": article['source']['name'],
                "text": article['title'],
                "url": article['url']
            })
        return news_list
    except Exception as e:
        print(f"Error fetching GNews: {e}")
        return []

@st.cache_data(ttl=3600) # Cache data for 1 hour
def get_reddit_posts(company_name: str) -> list:
    """
    Fetches relevant Reddit posts using PRAW.
    """
    print(f"AI Core: Fetching Reddit posts for {company_name}")
    try:
        reddit = praw.Reddit(
            client_id=st.secrets["REDDIT_CLIENT_ID"],
            client_secret=st.secrets["REDDIT_CLIENT_SECRET"],
            user_agent="ReputeX analysis script by /u/your_reddit_username" # Optional: change username
        )
        
        # Search in relevant subreddits
        subreddits_to_search = ["investing", "wallstreetbets", "antiwork", "employees", "stocks"]
        # subreddits_to_search = ["investing"]
        query = f'"{company_name}"'
        
        posts_list = []
        for sub in subreddits_to_search:
            subreddit = reddit.subreddit(sub)
            for submission in subreddit.search(query, sort="hot", limit=3):
                posts_list.append({
                    "source": f"r/{sub}",
                    "text": submission.title,
                    "url": submission.permalink
                })
        return posts_list
    except Exception as e:
        print(f"Error fetching Reddit: {e}")
        return []

# --- 3. THE MAIN FUNCTION (Samarth calls this) ---

def get_combined_analysis(company_name: str) -> dict:
    """
    Main function Samarth will call.
    It fetches all data, runs AI analysis, and returns the final dict.
    """
    print(f"AI Core: Starting combined analysis for {company_name}...")
    
    # --- Step 1: Load AI Models ---
    sentiment_analyzer, esg_classifier = load_analyzers()
    
    # --- Step 2: Fetch Data (in parallel) ---
    news_data = get_news(company_name)
    reddit_data = get_reddit_posts(company_name)
    
    # --- Step 3: Analyze Data ---
    esg_labels = ["Environmental", "Social", "Governance", "Other"]
    
    analyzed_news_feed = []
    for item in news_data:
        text = item['text']
        sentiment_result = sentiment_analyzer(text)[0]
        esg_result = esg_classifier(text, esg_labels)
        
        analyzed_news_feed.append({
            "source": item['source'],
            "text": text,
            "url": item['url'],
            "sentiment": sentiment_result['label'], # 'Positive', 'Negative', 'Neutral'
            "sentiment_score": round(sentiment_result['score'], 2),
            "category": esg_result['labels'][0] # The top-scoring ESG label
        })
        
    analyzed_reddit_feed = []
    for item in reddit_data:
        text = item['text']
        sentiment_result = sentiment_analyzer(text)[0]
        
        analyzed_reddit_feed.append({
            "source": item['source'],
            "text": text,
            "url": "https://www.reddit.com" + item['url'], # Need to add base URL
            "sentiment": sentiment_result['label'],
            "sentiment_score": round(sentiment_result['score'], 2),
            "category": "Social" # Assume all Reddit posts are 'Social' for simplicity
        })

    # --- Step 4: Calculate Scores ---
    
    # Combine all feeds for scoring
    all_analyzed_items = analyzed_news_feed + analyzed_reddit_feed
    
    if not all_analyzed_items:
        # No data found, return an empty-but-valid structure
        return {
            "company_name": company_name, "overall_score": 0,
            "scores": {"environmental": 0, "social": 0, "governance": 0},
            "modules": [
                {"module_name": "Official News", "sentiment": "Neutral", "feed": []},
                {"module_name": "Social (Reddit)", "sentiment": "Neutral", "feed": []}
            ]
        }
    
    df = pd.DataFrame(all_analyzed_items)
    
    # Map sentiment to a number: Positive=1, Neutral=0, Negative=-1
    sentiment_map = {'Positive': 1, 'Neutral': 0, 'Negative': -1}
    df['sentiment_num'] = df['sentiment'].map(sentiment_map).fillna(0)
    
    # Calculate Overall Score (as a percentage, 0-100)
    # (Total Positive - Total Negative) / Total Items, rescaled to 0-100
    overall_score = round(((df['sentiment_num'].sum() / len(df)) + 1) / 2 * 100)

    # Calculate E, S, G Scores (0-100)
    def calculate_category_score(category_name):
        category_df = df[df['category'] == category_name]
        if len(category_df) == 0:
            return 50 # Default score if no articles found
        score = ((category_df['sentiment_num'].sum() / len(category_df)) + 1) / 2 * 100
        return round(score)

    env_score = calculate_category_score("Environmental")
    soc_score = calculate_category_score("Social")
    gov_score = calculate_category_score("Governance")
    
    # Get overall sentiment for each module
    news_sentiment = "Neutral"
    if not pd.DataFrame(analyzed_news_feed).empty:
        news_sentiment_num = pd.DataFrame(analyzed_news_feed)['sentiment'].map(sentiment_map).mean()
        if news_sentiment_num > 0.1: news_sentiment = "Positive"
        elif news_sentiment_num < -0.1: news_sentiment = "Negative"
        
    reddit_sentiment = "Neutral"
    if not pd.DataFrame(analyzed_reddit_feed).empty:
        reddit_sentiment_num = pd.DataFrame(analyzed_reddit_feed)['sentiment'].map(sentiment_map).mean()
        if reddit_sentiment_num > 0.1: reddit_sentiment = "Positive"
        elif reddit_sentiment_num < -0.1: reddit_sentiment = "Negative"

    # --- Step 5: Assemble Final Dictionary ---
    # This must match the "Function Contract" you gave Samarth
    
    final_data = {
      "company_name": company_name,
      "overall_score": overall_score,
      "scores": {
        "environmental": env_score,
        "social": soc_score,
        "governance": gov_score
      },
      "modules": [
        {
          "module_name": "Official News",
          "sentiment": news_sentiment,
          "feed": analyzed_news_feed
        },
        {
          "module_name": "Social (Reddit)",
          "sentiment": reddit_sentiment,
          "feed": analyzed_reddit_feed
        }
      ]
    }
    
    print("AI Core: Analysis complete.")
    return final_data