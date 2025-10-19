# This is your file: ai_core.py
# Combines all logic: data fetching, AI analysis, scoring

import streamlit as st
import requests
import praw
import pandas as pd
from transformers import pipeline

# --- 1. AI MODEL LOADING ---
@st.cache_resource
def load_analyzers():
    """ Load and return the AI models. Cached """
    print("AI Core: Loading AI models...")
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest"
        # Add device=0 here if GPU is confirmed working and torch.cuda.is_available() is True
    )
    esg_classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli"
        # Add device=0 here if GPU is confirmed working and torch.cuda.is_available() is True
    )
    print("AI Core: AI models loaded.")
    return sentiment_analyzer, esg_classifier

# --- 2. DATA FETCHING FUNCTIONS ---

@st.cache_data(ttl=3600) # Cache data for 1 hour
def get_news(company_name: str) -> list:
    """ Fetches general ESG news articles for the company from GNews. """
    print(f"AI Core: Fetching general ESG news for {company_name}")
    try:
        api_key = st.secrets["GNEWS_API_KEY"]

        # Broader Query - Company name AND general ESG terms + Identifiers
        esg_terms = [
            "ESG", "environmental", "social", "governance", "sustainability",
            "ethics", "carbon", "climate", "labor", "community", "diversity",
            "pollution", "emissions", "renewable" # Added more env terms
        ]
        esg_or_query = " OR ".join(esg_terms)

        # Include common company structures/names, adjust for specific companies if needed
        # Example for "Tata": Include "Tata Group", "Tata Motors", etc.
        # This part might need adjustment based on the company being searched.
        # Keeping it broader for now.
        identifier_terms = ["stock", "shares", "Inc.", "Corp.", "Ltd.", "Group"]
        identifier_query = " OR ".join([f'"{company_name} {term}"' for term in identifier_terms])

        # Combine: Exact Name OR (Name + Identifier) AND (ESG Terms)
        # Check GNews docs for optimal syntax, parentheses might be important
        query = f'("{company_name}" OR ({identifier_query})) AND ({esg_or_query})'
        # Fallback simpler query if needed:
        # query = f'"{company_name}" AND ({esg_or_query})'
        # Fallback simplest query:
        # query = f'"{company_name}"'

        url = "https://gnews.io/api/v4/search"
        params = {
            "q": query,
            "lang": "en",
            "max": 30, # Fetch more to increase chances after filtering
            "apikey": api_key,
            "in": "title,description",
            "sortby": "relevance"
        }

        # Debugging: Print the request URL
        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"\n--- GNews Request URL ---\n{prepared_request.url}\n-------------------------\n")
        print(f"GNews Query Used: {query}")

        response = requests.get(url, params=params)
        print(f"GNews Status Code: {response.status_code}")
        response.raise_for_status()
        articles = response.json().get('articles', [])
        print(f"GNews returned {len(articles)} articles initially.")

        # Filtering
        filtered_articles = []
        exclude_keywords = ["forest", "river", "rainforest", "jungle", "amazonas", "dorabji", "recipe"] # Add more irrelevant terms
        # Stronger check: must contain company name Variations
        company_variants = [company_name.lower()]
        # Add variations like "tata group", "tcs" if company_name is "Tata"
        if company_name.lower() == "tata":
             company_variants.extend(["tata group", "tata motors", "tata steel", "tcs"])

        for article in articles:
            title_lower = article['title'].lower()
            desc_lower = article.get('description', '').lower()
            content_lower = title_lower + " " + desc_lower

            # Check if relevant company variant is present
            if not any(variant in content_lower for variant in company_variants):
                continue

            # Check for exclusion keywords
            if any(keyword in content_lower for keyword in exclude_keywords):
                continue

            filtered_articles.append({
                "source": article['source']['name'],
                "text": article['title'],
                "url": article['url']
            })

        print(f"Found {len(filtered_articles)} relevant articles after filtering for {company_name}")
        return filtered_articles[:15] # Return top 15 relevant after filtering

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GNews (Network/HTTP Error): {e}")
        # Optional: Log response text for debugging API errors
        # if 'response' in locals(): print(f"Response content: {response.text[:500]}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_news: {e}")
        return []
# Add this function to ai_core.py

@st.cache_data(ttl=3600) # Cache for 1 hour
def get_mediastack_news(company_name: str) -> list:
    """ Fetches general ESG news articles from Mediastack. """
    print(f"AI Core: Fetching Mediastack news for {company_name}")
    response = None # Initialize response to None
    try:
        api_key = st.secrets["MEDIASTACK_API_KEY"]

        esg_terms = ["ESG", "environmental", "social", "governance", "sustainability", "ethics"]
        # Mediastack uses 'keywords', check documentation for exact AND/OR syntax
        keywords = f'{company_name} ( { " OR ".join(esg_terms) } )' # Simple AND/OR guess

        url = "http://api.mediastack.com/v1/news" # Free plan might be HTTP only
        params = {
            'access_key': api_key,
            'keywords': keywords,
            'languages': 'en',
            'limit': 25, # <<< INCREASED LIMIT (Check free tier allowance)
            'sort': 'published_desc'
        }

        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"\n--- Mediastack Request URL ---\n{prepared_request.url}\n----------------------------\n")

        response = requests.get(url, params=params)
        print(f"Mediastack Status Code: {response.status_code}")
        response.raise_for_status()
        articles_data = response.json().get('data', [])
        print(f"Mediastack returned {len(articles_data)} articles initially.")

        news_list = []
        for article in articles_data:
            if article.get('title') and article.get('url'): # Check essential fields
                 # Filter common irrelevant terms if needed
                title_lower = article['title'].lower()
                if not any(kw in title_lower for kw in ["recipe", "horoscope"]):
                    news_list.append({
                        "source": article.get('source', 'Mediastack'),
                        "text": article['title'],
                        "url": article['url']
                    })

        print(f"Found {len(news_list)} relevant Mediastack articles for {company_name}")
        return news_list

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Mediastack news: {e}")
        if response is not None:
             print(f"Mediastack Response Status: {response.status_code}")
             # print(f"Mediastack Response Body: {response.text[:500]}") # Uncomment to debug API errors
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_mediastack_news: {e}")
        return []

# Add this function too
@st.cache_data(ttl=3600) # Cache for 1 hour
def get_newsdata_news(company_name: str) -> list:
    """ Fetches general ESG news articles from Newsdata.io. """
    print(f"AI Core: Fetching Newsdata.io news for {company_name}")
    response = None # Initialize response to None
    try:
        api_key = st.secrets["NEWSDATA_API_KEY"]

        esg_terms = ["ESG", "environmental", "social", "governance", "sustainability", "ethics"]
        # Newsdata.io often uses 'q' with AND/OR/NOT - check docs
        query = f'"{company_name}" AND ({ " OR ".join(esg_terms) })'

        url = "https://newsdata.io/api/1/news"
        params = {
            'apikey': api_key,
            'q': query,
            'language': 'en',
            # 'size': 10 # Default for free is often 10. Let's try requesting more.
            # Free tier might ignore this or cap it. Check dashboard/docs.
            # We will fetch default and rely on combining sources.
        }

        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"\n--- Newsdata.io Request URL ---\n{prepared_request.url}\n---------------------------\n")

        response = requests.get(url, params=params)
        print(f"Newsdata.io Status Code: {response.status_code}")
        response.raise_for_status()
        articles_data = response.json().get('results', [])
        print(f"Newsdata.io returned {len(articles_data)} articles initially.")


        news_list = []
        for article in articles_data:
             if article.get('title') and article.get('link'):
                title_lower = article['title'].lower()
                if not any(kw in title_lower for kw in ["recipe", "horoscope"]):
                    news_list.append({
                        "source": article.get('source_id', 'Newsdata.io'),
                        "text": article['title'],
                        "url": article['link']
                    })

        print(f"Found {len(news_list)} relevant Newsdata.io articles for {company_name}")
        return news_list

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Newsdata.io news: {e}")
        if response is not None:
             print(f"Newsdata.io Response Status: {response.status_code}")
             # print(f"Newsdata.io Response Body: {response.text[:500]}") # Uncomment to debug API errors
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_newsdata_news: {e}")
        return []
    
# --- REDDIT FETCHING FUNCTION ---
@st.cache_data(ttl=3600)
def get_reddit_posts(company_name: str) -> list:
    """ Fetches relevant Reddit posts using PRAW. """
    print(f"AI Core: Fetching Reddit posts for {company_name}")
    try:
        reddit = praw.Reddit(
            client_id=st.secrets["REDDIT_CLIENT_ID"],
            client_secret=st.secrets["REDDIT_CLIENT_SECRET"],
            user_agent="ReputeX analysis script v1.0 (by /u/YourUsername)" # Be specific
        )

        subreddits_to_search = ["investing", "stocks", "wallstreetbets", "antiwork", "recruitinghell", "environment"] # Added environment, recruitinghell
        query = f'"{company_name}"'

        posts_list = []
        # Limit total posts fetched across all subreddits
        total_posts_limit = 15
        posts_found = 0

        for sub in subreddits_to_search:
            if posts_found >= total_posts_limit:
                break # Stop searching if we hit the total limit
            try:
                subreddit = reddit.subreddit(sub)
                # Fetch slightly more per sub, limit later
                for submission in subreddit.search(query, sort="relevance", limit=5):
                    if posts_found < total_posts_limit:
                        posts_list.append({
                            "source": f"r/{sub}",
                            "text": submission.title,
                            "url": submission.permalink
                        })
                        posts_found += 1
                    else:
                        break # Stop inner loop too
            except Exception as sub_e:
                print(f"  - Error searching subreddit r/{sub}: {sub_e}")
                continue # Skip to next subreddit if one fails

        print(f"Found {len(posts_list)} relevant Reddit posts for {company_name}")
        return posts_list # Return whatever was found up to the limit

    except Exception as e:
        print(f"Error fetching Reddit: {e}")
        return []


# --- MAIN ANALYSIS FUNCTION ---
def get_combined_analysis(company_name: str) -> dict:
    """
    Main function. Fetches general news, Reddit posts, runs AI analysis,
    calculates scores, and returns the final dict.
    """
    print(f"AI Core: Starting combined analysis for {company_name}...")

    # --- Step 1: Load AI Models ---
    sentiment_analyzer, esg_classifier = load_analyzers()

    # Inside get_combined_analysis function in ai_core.py

    # --- Step 2: Fetch Data from ALL Sources ---
    gnews_data = get_news(company_name) # Your existing function
    mediastack_data = get_mediastack_news(company_name) # Call the new function
    newsdata_data = get_newsdata_news(company_name) # Call the new function
    reddit_data = get_reddit_posts(company_name)

    # --- Step 2b: Combine and De-duplicate News ---
    all_fetched_news = gnews_data + mediastack_data + newsdata_data # Combine all three lists
    deduplicated_news = []
    seen_urls = set()

    print(f"AI Core: Total news articles fetched before deduplication: {len(all_fetched_news)}")

    for article in all_fetched_news:
        url = article.get("url")
        if url and url not in seen_urls:
            # Add simple title check for near duplicates if needed
            is_similar = False
            # simple similarity check (optional)
            # for existing in deduplicated_news:
            #     if fuzz.partial_ratio(article.get('text','').lower(), existing.get('text','').lower()) > 85: # Requires fuzzywuzzy
            #         is_similar = True
            #         break
            # if not is_similar:
            deduplicated_news.append(article)
            seen_urls.add(url)

    all_news_data = deduplicated_news[:50] # Keep up to 50 unique articles
    print(f"AI Core: News articles after deduplication (max 50): {len(all_news_data)}")

    # --- Step 3: Analyze Data ---
    # ... (rest of the analysis logic uses all_news_data) ...

    # --- Step 3: Analyze Data ---

    # Stricter Labels and Template
    esg_labels = [
        "Environmental topics: company's impact on nature, climate change, pollution, sustainability efforts, resource use (water, energy), conservation",
        "Social topics: employee relations (layoffs, strikes, safety, diversity), human rights, community impact, customer welfare, product safety",
        "Governance topics: corporate leadership, board structure, executive pay, shareholder issues, business ethics, transparency, lawsuits, regulatory compliance, financial reporting",
        "Other topics: General business news, stock performance, product launches, partnerships, personnel changes (unless related to governance/social issues)"
    ]
    hypothesis_template = "This news article discusses {}."
    confidence_threshold = 0.5 # Minimum confidence for classification

    analyzed_news_feed = []
    print(f"AI Core: Analyzing {len(all_news_data)} news items...")
    if all_news_data: # Only loop if there's news data
        for item in all_news_data:
            text = item.get('text', '') # Use .get() for safety
            if not text: continue # Skip if text is empty

            try:
                # Analyze Sentiment
                sentiment_result = sentiment_analyzer(text)[0]
                # Classify ESG Topic
                esg_result = esg_classifier(text, esg_labels, hypothesis_template=hypothesis_template)

                top_label = esg_result['labels'][0]
                top_score = esg_result['scores'][0]

                # Check Confidence Score
                if top_score < confidence_threshold:
                    final_category = esg_labels[3] # Assign to "Other topics..." label
                    explanation = f"Low confidence ({top_score:.1%}) for AI classification. Defaulted to Other."
                    print(f"  - Low confidence ({top_score:.2f}) for news '{text[:50]}...'. Classified as Other.")
                else:
                    final_category = top_label
                    explanation = f"Classified as '{final_category.split(':')[0]}' with {top_score:.1%} confidence." # Shorten label

                analyzed_news_feed.append({
                    "source": item.get('source', 'Unknown Source'), # Use .get()
                    "text": text,
                    "url": item.get('url', '#'), # Use .get()
                    "sentiment": sentiment_result.get('label', 'neutral').lower(), # Use .get() and default
                    "sentiment_score": round(sentiment_result.get('score', 0.5), 2), # Use .get() and default
                    "category": final_category,
                    "explanation": explanation
                })
            except Exception as e:
                print(f"  - Error analyzing news item '{text[:50]}...': {e}")
                continue # Skip this item if analysis fails
    else:
        print("AI Core: No news items to analyze.")


    analyzed_reddit_feed = []
    print(f"AI Core: Analyzing {len(reddit_data)} Reddit items...")
    social_label_string = esg_labels[1] # Reference the defined social label
    if reddit_data: # Only loop if there's reddit data
        for item in reddit_data:
            text = item.get('text', '')
            if not text: continue

            try:
                # Analyze Sentiment
                sentiment_result = sentiment_analyzer(text)[0]
                analyzed_reddit_feed.append({
                    "source": item.get('source', 'Unknown Subreddit'),
                    "text": text,
                    "url": "https://www.reddit.com" + item.get('url', ''),
                    "sentiment": sentiment_result.get('label', 'neutral').lower(),
                    "sentiment_score": round(sentiment_result.get('score', 0.5), 2),
                    "category": social_label_string # Assign specific Social label
                })
            except Exception as e:
                 print(f"  - Error analyzing reddit item '{text[:50]}...': {e}")
                 continue # Skip this item
    else:
         print("AI Core: No Reddit items to analyze.")


    # --- Step 4: Calculate Scores ---
    all_analyzed_items = analyzed_news_feed + analyzed_reddit_feed

    if not all_analyzed_items:
        print("AI Core: No data available for scoring.")
        # ... (keep your existing 'no data' return block) ...
        return {
            "company_name": company_name, "overall_score": "N/A",
            "scores": {"environmental": "N/A", "social": "N/A", "governance": "N/A"},
            "modules": [
                {"module_name": "Official News (ESG)", "sentiment": "Neutral", "feed": []},
                {"module_name": "Social (Reddit)", "sentiment": "Neutral", "feed": []}
            ]
        }

    df = pd.DataFrame(all_analyzed_items)

    # --- REVISED BALANCED SCORING LOGIC START ---

    # Map sentiments to numbers: Positive=1, Neutral=0, Negative=-1
    sentiment_map = {'positive': 1, 'neutral': 0, 'negative': -1}
    # Apply the map, fill any errors/missing with 0 (neutral)
    df['sentiment_num'] = df['sentiment'].map(sentiment_map).fillna(0)

    # Calculate Overall Score (Scaled Average)
    average_sentiment_overall = df['sentiment_num'].mean()
    overall_score = round(((average_sentiment_overall + 1) / 2) * 100)
    print(f"AI Core: Overall Avg Sentiment: {average_sentiment_overall:.2f}, Scaled Score: {overall_score}")


    # Inner function to calculate category scores (Scaled Average)
    def calculate_category_score(category_name):
        category_df = df[df['category'] == category_name]
        if category_df.empty:
            return None # No data for this category

        # Calculate average sentiment for this category
        average_sentiment_category = category_df['sentiment_num'].mean()
        # Scale the average score to 0-100
        score = round(((average_sentiment_category + 1) / 2) * 100)
        print(f"AI Core: Category '{category_name.split(':')[0]}' Avg Sentiment: {average_sentiment_category:.2f}, Scaled Score: {score}")
        return score

    # Use the full, exact label strings when calling the function
    env_label = esg_labels[0]
    soc_label = esg_labels[1]
    gov_label = esg_labels[2]

    env_score = calculate_category_score(env_label)
    soc_score = calculate_category_score(soc_label)
    gov_score = calculate_category_score(gov_label)

    # --- REVISED BALANCED SCORING LOGIC END ---


    # Calculate overall sentiment label for each feed type (Still use average for display)
    news_sentiment_df = pd.DataFrame(analyzed_news_feed)
    # ... (keep existing news_sentiment calculation using the same sentiment_map) ...
    news_sentiment = "Neutral"
    if not news_sentiment_df.empty:
        news_sentiment_num = news_sentiment_df['sentiment'].map(sentiment_map).fillna(0).mean()
        if news_sentiment_num > 0.15: news_sentiment = "Positive"
        elif news_sentiment_num < -0.15: news_sentiment = "Negative"


    reddit_sentiment_df = pd.DataFrame(analyzed_reddit_feed)
    # ... (keep existing reddit_sentiment calculation using the same sentiment_map) ...
    reddit_sentiment = "Neutral"
    if not reddit_sentiment_df.empty:
        reddit_sentiment_num = reddit_sentiment_df['sentiment'].map(sentiment_map).fillna(0).mean()
        if reddit_sentiment_num > 0.15: reddit_sentiment = "Positive"
        elif reddit_sentiment_num < -0.15: reddit_sentiment = "Negative"


    # --- Step 5: Assemble Final Dictionary ---
    # (This part remains the same, using the new overall_score, env_score, soc_score, gov_score)
    final_data = {
      "company_name": company_name,
      "overall_score": overall_score, # Uses the new scaled average score
      "scores": {
        "environmental": env_score if env_score is not None else "N/A",
        "social": soc_score if soc_score is not None else "N/A",
        "governance": gov_score if gov_score is not None else "N/A"
      },
      "modules": [
        {
          "module_name": "Official News (ESG)",
          "sentiment": news_sentiment, # Still based on average for display label
          "feed": analyzed_news_feed
        },
        {
          "module_name": "Social (Reddit)",
          "sentiment": reddit_sentiment, # Still based on average for display label
          "feed": analyzed_reddit_feed
        }
      ]
    }

    print("AI Core: Analysis complete.")
    return final_data