# This is your file: ai_core.py
# Combines all logic: multi-API data fetching, executive search, AI analysis, weighted scoring, and heatmap

import streamlit as st
import requests
import praw
import prawcore # Import specifically for exception handling
import pandas as pd
from transformers import pipeline
import torch # Needed for checking CUDA availability
import io # Needed for reading bytes from PDF

# --- CONFIGURATION: Trusted Sources ---
TRUSTED_NEWS_SOURCES = [
    # Major News Agencies
    "reuters", "associated press", "ap", "bloomberg", "afp",
    # Major Financial News
    "financial times", "wall street journal", "wsj", "cnbc", "forbes", "fortune", "reuters finance",
    # Reputable Broad News
    "bbc news", "the guardian", "the new york times", "nyt", "washington post",
    "le monde", "der spiegel",
    # India-specific
    "the times of india", "the hindu", "business standard", "economic times", "ndtv profit", "livemint",
    # Tech News
    "techcrunch", "wired", "the verge",
    # Environmental News
    "reuters environment", "guardian environment", "national geographic", "inside climate news"
]
TRUSTED_NEWS_SOURCES_LOWER = [source.lower() for source in TRUSTED_NEWS_SOURCES]

# --- CONFIGURATION: Sub-Topic Keywords (Expanded) ---
SUB_TOPIC_KEYWORDS = {
    # Environmental
    "Climate & Emissions": ["climate", "emission", "ghg", "greenhouse", "carbon", "decarbonization", "net-zero", "fossil fuel", "pollution"],
    "Waste & Pollution": ["waste", "pollution", "spill", "landfill", "toxic", "plastic", "recycling", "hazardous", "effluent"],
    "Resources & Biodiversity": ["water", "resource", "biodiversity", "conservation", "deforestation", "eco-friendly", "wildlife", "habitat", "forestry"],
    
    # Social
    "Labor & Safety": ["labor", "employee safety", "wages", "union", "strike", "conditions", "layoff", "workplace", "injury", "overtime"],
    "Diversity & Inclusion": ["diversity", "inclusion", "equality", "discrimination", "harassment", "pay gap", "minority", "lgbtq+", "gender"],
    "Product & Data": ["product safety", "data privacy", "customer", "recall", "security", "privacy breach", "defect", "vulnerability"],
    
    # Governance
    "Ethics & Compliance": ["ethics", "compliance", "lawsuit", "corruption", "bribery", "fraud", "scandal", "investigation", "misconduct", "antitrust"],
    "Board & Executive": ["board", "executive pay", "ceo", "compensation", "shareholder", "proxy vote", "c-suite", "governance", "insider trading"],
    "Transparency & Reporting": ["transparency", "reporting", "audit", "disclosure", "accounting", "misleading", "fraudulent"]
}

# Define the labels used in the heatmap in order
HEATMAP_LABELS = [
    "Climate & Emissions", "Waste & Pollution", "Resources & Biodiversity",
    "Labor & Safety", "Diversity & Inclusion", "Product & Data",
    "Ethics & Compliance", "Board & Executive", "Transparency & Reporting"
]


# --- 1. AI MODEL LOADING ---
@st.cache_resource
def load_analyzers():
    """ Load and return the AI models. Cached """
    print("AI Core: Loading AI models...")
    device_option = -1 # Defaulting to CPU
    try:
        if torch.cuda.is_available():
            device_option = 0 # Use GPU 0 if available
            print("AI Core: CUDA GPU detected. Setting pipeline device to GPU 0.")
        else:
            device_option = -1 # Use CPU
            print("AI Core: No CUDA GPU detected. Setting pipeline device to CPU.")
    except Exception as e:
        print(f"AI Core: Error checking CUDA availability ({e}). Defaulting to CPU.")
        device_option = -1

    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        device=device_option
    )
    esg_classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
        device=device_option
    )
    print("AI Core: AI models loaded.")
    return sentiment_analyzer, esg_classifier

# --- 2. DATA FETCHING FUNCTIONS ---

# --- GNews ---
@st.cache_data(ttl=3600)
def get_news(company_name: str, query_override: str = None) -> list:
    """ Fetches news articles for the company from GNews. Can use a specific query. """
    fetch_type = "general" if query_override is None else "specific"
    print(f"AI Core: Fetching {fetch_type} news from GNews for '{company_name}'...")
    response = None
    try:
        api_key = st.secrets.get("GNEWS_API_KEY")
        if not api_key:
             print("AI Core: GNews API Key not found in secrets.")
             return []

        if query_override:
            query = query_override
            max_results = 7
        else:
            query = f'"{company_name}"' # Broad query
            max_results = 30

        url = "https://gnews.io/api/v4/search"
        params = {"q": query, "lang": "en", "max": max_results, "apikey": api_key, "in": "title,description", "sortby": "relevance"}

        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"\n--- GNews Request URL ---\n{prepared_request.url}\n-------------------------\n")
        print(f"GNews Query Used: {query}")

        response = requests.get(url, params=params, timeout=15)
        print(f"GNews Status Code: {response.status_code}")
        response.raise_for_status()

        response_data = response.json()
        if 'articles' not in response_data:
            print(f"GNews API response missing 'articles' key. Response: {response_data}")
            return []
        articles = response_data.get('articles', [])
        print(f"GNews returned {len(articles)} articles initially for query.")

        # Filtering
        filtered_articles = []
        exclude_keywords = ["forest", "river", "rainforest", "jungle", "amazonas", "dorabji", "recipe", "horoscope", "obituary", "death anniversary", "sports", "cricket", "match", "score", "prediction", "chart"]
        company_variants = [company_name.lower().strip()]
        if company_name.lower().strip() == "tata": company_variants.extend(["tata group", "tata motors", "tata steel", "tcs", "tata power"])

        for article in articles:
            if not article or not article.get('title') or not article.get('source') or not article.get('source', {}).get('name'): continue

            title_lower = article['title'].lower()
            desc_lower = article.get('description', '').lower()
            content_lower = title_lower + " " + desc_lower
            source_name = article['source']['name'].lower()

            if query_override is None and not any(variant in content_lower for variant in company_variants): continue
            if any(keyword in content_lower for keyword in exclude_keywords): continue

            trust_score = 0.5
            if any(trusted in source_name for trusted in TRUSTED_NEWS_SOURCES_LOWER):
                trust_score = 1.0

            filtered_articles.append({
                "source": article['source']['name'],
                "text": article['title'],
                "url": article.get('url'),
                "trust_score": trust_score
            })

        print(f"Found {len(filtered_articles)} relevant GNews articles after filtering.")
        limit = 20 if query_override is None else 7
        return filtered_articles[:limit]

    except requests.exceptions.Timeout:
        print("Error fetching GNews: Request timed out.")
        return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching GNews (Network/HTTP Error): {e}")
        if response is not None: print(f"Response content: {response.text[:500]}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_news: {e}")
        return []


# --- Mediastack ---
@st.cache_data(ttl=3600)
def get_mediastack_news(company_name: str, query_override: str = None) -> list:
    """ Fetches news articles from Mediastack. Can use a specific query. """
    fetch_type = "general" if query_override is None else "specific"
    print(f"AI Core: Fetching {fetch_type} Mediastack news for {company_name}")
    response = None
    try:
        api_key = st.secrets.get("MEDIASTACK_API_KEY")
        if not api_key:
             print("AI Core: Mediastack API Key not found in secrets.")
             return []

        if query_override:
            keywords = query_override
        else:
            keywords = f'"{company_name}"'

        url = "http://api.mediastack.com/v1/news"
        max_results = 30 if query_override is None else 7
        params = {'access_key': api_key, 'keywords': keywords, 'languages': 'en', 'limit': max_results, 'sort': 'published_desc'}

        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"\n--- Mediastack Request URL ---\n{prepared_request.url}\n----------------------------\n")
        print(f"Mediastack Query Used: {keywords}")

        response = requests.get(url, params=params, timeout=15)
        print(f"Mediastack Status Code: {response.status_code}")
        response.raise_for_status()
        articles_data = response.json().get('data', [])
        print(f"Mediastack returned {len(articles_data)} articles initially.")

        news_list = []
        exclude_keywords = ["recipe", "horoscope", "obituary", "sports", "match", "score", "prediction", "chart"]
        for article in articles_data:
            if not article or not article.get('title') or not article.get('url'): continue

            title_lower = article['title'].lower()
            source_name = article.get('source', '').lower()
            desc_lower = article.get('description', '').lower()
            content_lower = title_lower + " " + desc_lower

            if any(kw in title_lower for kw in exclude_keywords): continue
            if query_override is None and company_name.lower() not in content_lower: continue

            trust_score = 0.5
            if any(trusted in source_name for trusted in TRUSTED_NEWS_SOURCES_LOWER):
                trust_score = 1.0
            news_list.append({
                "source": article.get('source', 'Mediastack'),
                "text": article['title'],
                "url": article['url'],
                "trust_score": trust_score
            })

        print(f"Found {len(news_list)} relevant Mediastack articles after filtering.")
        return news_list[:20]

    except requests.exceptions.Timeout:
        print("Error fetching Mediastack: Request timed out.")
        return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Mediastack news: {e}")
        if response is not None:
             print(f"Mediastack Response Status: {response.status_code}")
             print(f"Mediastack Response Body: {response.text[:500]}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_mediastack_news: {e}")
        return []

# --- Newsdata.io ---
@st.cache_data(ttl=3600)
def get_newsdata_news(company_name: str, query_override: str = None) -> list:
    """ Fetches news articles from Newsdata.io. Can use a specific query. """
    fetch_type = "general" if query_override is None else "specific"
    print(f"AI Core: Fetching {fetch_type} Newsdata.io news for {company_name}")
    response = None
    try:
        api_key = st.secrets.get("NEWSDATA_API_KEY")
        if not api_key:
             print("AI Core: Newsdata.io API Key not found in secrets.")
             return []

        if query_override:
            query = query_override
        else:
            query = f'"{company_name}"'

        url = "https://newsdata.io/api/1/news"
        params = {'apikey': api_key, 'q': query, 'language': 'en'}

        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"\n--- Newsdata.io Request URL ---\n{prepared_request.url}\n---------------------------\n")
        print(f"Newsdata.io Query Used: {query}")

        response = requests.get(url, params=params, timeout=15)
        print(f"Newsdata.io Status Code: {response.status_code}")
        response.raise_for_status()
        articles_data = response.json().get('results', [])
        print(f"Newsdata.io returned {len(articles_data)} articles initially.")

        news_list = []
        exclude_keywords = ["recipe", "horoscope", "obituary", "sports", "match", "score", "prediction", "chart"]
        for article in articles_data:
            if not article or not article.get('title') or not article.get('link'): continue

            title_lower = article['title'].lower()
            source_name = article.get('source_id', '').lower()
            desc_lower = article.get('description', '').lower()
            content_lower = title_lower + " " + desc_lower

            if any(kw in title_lower for kw in exclude_keywords): continue
            if query_override is None and company_name.lower() not in content_lower: continue

            trust_score = 0.5
            if any(trusted.replace(" ", "") in source_name for trusted in TRUSTED_NEWS_SOURCES_LOWER):
                 trust_score = 1.0
            news_list.append({
                "source": article.get('source_id', 'Newsdata.io'),
                "text": article['title'],
                "url": article['link'],
                "trust_score": trust_score
            })

        print(f"Found {len(news_list)} relevant Newsdata.io articles after filtering.")
        limit = 10 if query_override is None else 5
        return news_list[:limit]

    except requests.exceptions.Timeout:
        print("Error fetching Newsdata.io: Request timed out.")
        return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Newsdata.io news: {e}")
        if response is not None:
             print(f"Newsdata.io Response Status: {response.status_code}")
             print(f"Newsdata.io Response Body: {response.text[:500]}")
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
        if "REDDIT_CLIENT_ID" not in st.secrets or "REDDIT_CLIENT_SECRET" not in st.secrets:
             print("AI Core: Reddit API credentials not found in secrets.")
             return []

        reddit = praw.Reddit(
            client_id=st.secrets["REDDIT_CLIENT_ID"],
            client_secret=st.secrets["REDDIT_CLIENT_SECRET"],
            user_agent="ReputeX analysis script v1.2 (Contact: YourEmail@example.com)"
        )
        
        subreddits_to_search = [
            "investing", "stocks", "wallstreetbets", "antiwork",
            "recruitinghell", "environment", "sustainability",
            company_name.lower().replace(" ", ""),
            "IndiaInvestments", "IndianStockMarket"
        ]

        query_terms = [f'"{company_name}"']
        if company_name.lower() == "tata":
            query_terms.extend(['"Tata Motors"', '"Tata Steel"', '"TCS"', '"Tata Group"', '"Tata Power"'])
        
        query = " OR ".join(query_terms)
        posts_list = []
        total_posts_limit = 15
        posts_found = 0

        print(f"  - Reddit Search Query: {query}")

        for sub in subreddits_to_search:
            if posts_found >= total_posts_limit: break
            try:
                print(f"  - Searching r/{sub}...")
                subreddit = reddit.subreddit(sub)
                for submission in subreddit.search(query, sort="relevance", time_filter="month", limit=7):
                    title_lower = submission.title.lower()
                    exclude_reddit = ["moon", "yolo", "squeeze", "$", "earn", "dividend", "alert", "promotion", "free", "giveaway", "job posting", "hiring", "mega thread", "daily discussion", "prediction", "chart", "technical analysis"]
                    if any(keyword in title_lower for keyword in exclude_reddit): continue

                    found_term = False
                    for term in query_terms:
                        if term.strip('"').lower() in title_lower:
                            found_term = True; break
                    if not found_term and company_name.lower() not in title_lower:
                        continue

                    if posts_found < total_posts_limit:
                        posts_list.append({
                            "source": f"r/{sub}",
                            "text": submission.title,
                            "url": submission.permalink,
                            "trust_score": 0.6
                        })
                        posts_found += 1
                    else: break
            except (prawcore.exceptions.Forbidden, prawcore.exceptions.NotFound, praw.exceptions.PRAWException) as praw_e:
                 print(f"  - PRAW Error searching subreddit r/{sub}: {praw_e}")
                 continue
            except Exception as sub_e:
                print(f"  - General Error searching subreddit r/{sub}: {sub_e}")
                continue

        print(f"Found {len(posts_list)} relevant Reddit posts for {company_name}")
        return posts_list

    except Exception as e:
        print(f"Error initializing or fetching Reddit: {e}")
        return []

# --- EXECUTIVE SEARCH FUNCTIONS ---
@st.cache_data(ttl=86400)
def find_key_executives(company_name: str) -> list:
    """ Queries Google Knowledge Graph to find key executives (CEO, Founder). """
    print(f"AI Core: Searching Knowledge Graph for executives of {company_name}")
    api_key = st.secrets.get("GOOGLE_KG_API_KEY")
    if not api_key:
        print("AI Core: Google Knowledge Graph API Key not found in secrets.")
        return []

    service_url = 'https://kgsearch.googleapis.com/v1/entities:search'
    params = {'query': f"{company_name} company", 'key': api_key, 'limit': 1, 'types': 'Organization'}
    executives = []
    response = None
    
    company_variants = [company_name.lower().strip()]
    if company_name.lower().strip() == "tata": company_variants.extend(["tata group", "tata motors", "tata steel", "tcs", "tata power"])

    try:
        response = requests.get(service_url, params=params, timeout=10)
        print(f"Knowledge Graph Status Code: {response.status_code}")
        response.raise_for_status()
        result = response.json()

        if result.get('itemListElement'):
            top_result = result['itemListElement'][0].get('result', {})
            result_name = top_result.get('name', '').lower()
            
            if not any(variant in result_name for variant in company_variants) and company_name.lower() not in result_name:
                 print(f"Knowledge Graph top result '{result_name}' might not match '{company_name}'. Skipping executives.")
                 return []

            detailed_data = top_result.get('detailedDescription') or top_result
            if detailed_data and isinstance(detailed_data, dict):
                potential_props = ['founder', 'ceo', 'chairperson', 'director', 'keyPeople']

                for prop in potential_props:
                    people = detailed_data.get(prop)
                    if people:
                        if not isinstance(people, list): people = [people]
                        for person in people:
                            if isinstance(person, dict) and person.get('name') and person['name'] not in [e['name'] for e in executives]:
                                executives.append({"name": person['name'], "role": prop})
            else:
                 print("Knowledge Graph result format not as expected or missing detailed data.")

        print(f"AI Core: Found executives: {executives}")
        return executives[:2]
    except requests.exceptions.Timeout:
        print("Error calling Knowledge Graph API: Request timed out.")
        return []
    except requests.exceptions.RequestException as e:
        print(f"Error calling Knowledge Graph API: {e}")
        if response is not None: print(f"KG Response: {response.text[:500]}")
        return []
    except Exception as e:
        print(f"Error processing Knowledge Graph result: {e}")
        return []

def get_executive_news(executives: list, company_name: str) -> list:
    """ Fetches news mentioning key executives + company using existing news functions. """
    if not executives: return []
    all_executive_news = []
    print(f"AI Core: Fetching news for executives: {[e['name'] for e in executives]}")

    for person in executives:
        person_name = person['name']
        print(f"  - Searching news for {person_name} ({company_name})...")
        person_query = f'"{person_name}" AND "{company_name}"'

        try: all_executive_news.extend(get_news(company_name, query_override=person_query))
        except Exception as e_gn: print(f"Error in exec news fetch (GNews): {e_gn}")
        try: all_executive_news.extend(get_mediastack_news(company_name, query_override=person_query))
        except Exception as e_ms: print(f"Error in exec news fetch (Mediastack): {e_ms}")
        try: all_executive_news.extend(get_newsdata_news(company_name, query_override=person_query))
        except Exception as e_nd: print(f"Error in exec news fetch (Newsdata): {e_nd}")

    print(f"AI Core: Found {len(all_executive_news)} total articles related to executives before dedupe.")
    deduped_exec_news = []
    exec_seen_urls = set()
    for article in all_executive_news:
         url = article.get("url")
         if url and url not in exec_seen_urls:
             article["related_person"] = person['name']
             deduped_exec_news.append(article)
             exec_seen_urls.add(url)

    print(f"Found {len(deduped_exec_news)} unique articles related to executives.")
    return deduped_exec_news[:10]


# --- MAIN ANALYSIS FUNCTION ---
def get_combined_analysis(company_name: str) -> dict:
    """
    Main function. Fetches company & exec news, Reddit, analyzes, scores, returns dict.
    """
    print(f"AI Core: Starting combined analysis for {company_name}...")
    sentiment_analyzer, esg_classifier = load_analyzers()

    # --- Step 2: Fetch Data ---
    gnews_data = get_news(company_name)
    mediastack_data = get_mediastack_news(company_name)
    newsdata_data = get_newsdata_news(company_name)
    reddit_data = get_reddit_posts(company_name)
    executives = find_key_executives(company_name)
    executive_news = get_executive_news(executives, company_name)

    # --- Step 2b: Combine and De-duplicate News ---
    all_fetched_news = gnews_data + mediastack_data + newsdata_data
    deduplicated_company_news = []
    seen_urls = set()
    print(f"AI Core: Total COMPANY news fetched before deduplication: {len(all_fetched_news)}")
    for article in all_fetched_news:
        url = article.get("url")
        if url and url not in seen_urls:
            deduplicated_company_news.append(article)
            seen_urls.add(url)

    unique_executive_news = [exec_art for exec_art in executive_news if exec_art.get("url") not in seen_urls]
    all_news_data = deduplicated_company_news[:40] + unique_executive_news[:10]
    print(f"AI Core: Total unique news items (Company + Exec) for analysis (max 50): {len(all_news_data)}")

    # --- Step 3: Analyze Data ---
    esg_labels = [ # Simpler labels
        "Environmental Impact",
        "Social & Employee Issues",
        "Corporate Governance & Ethics",
        "General Business/Financial News" # Simple 'Other'
    ]
    confidence_threshold = 0.35 # Lowered threshold
    executive_news_weight_factor = 0.8 # Weight executive news slightly less

    analyzed_news_feed = []
    print(f"AI Core: Analyzing {len(all_news_data)} combined news items...")
    if all_news_data:
        for item in all_news_data:
            text = item.get('text', '')
            if not text: continue
            try:
                sentiment_result = sentiment_analyzer(text)[0]
                esg_result = esg_classifier(text, esg_labels) # Removed hypothesis_template
                top_label = esg_result['labels'][0]; top_score = esg_result['scores'][0]
                is_exec_news = "related_person" in item

                if top_score < confidence_threshold:
                    final_category = esg_labels[3]
                    explanation = f"Low confidence ({top_score:.1%}). Defaulted to Other."
                else:
                    final_category = top_label
                    prefix = f"Exec '{item.get('related_person','')}': " if is_exec_news else ""
                    explanation = f"{prefix}Classified as '{final_category}' ({top_score:.1%})."

                base_trust = item.get('trust_score', 0.5)
                final_trust = round(base_trust * executive_news_weight_factor, 2) if is_exec_news else base_trust

                analyzed_news_feed.append({
                    "source": item.get('source', 'Unknown Source'),
                    "text": f"[{item.get('related_person','Exec')}] {text}" if is_exec_news else text,
                    "url": item.get('url', '#'),
                    "sentiment": sentiment_result.get('label', 'neutral').lower(),
                    "sentiment_score": round(sentiment_result.get('score', 0.5), 2),
                    "category": final_category, "explanation": explanation,
                    "trust_score": final_trust
                })
            except Exception as e:
                print(f"  - Error analyzing combined news item '{text[:50]}...': {e}")
                continue
    else: print("AI Core: No news items to analyze.")

    analyzed_reddit_feed = []
    print(f"AI Core: Analyzing {len(reddit_data)} Reddit items...")
    social_label_string = esg_labels[1] # Use simple social label
    if reddit_data:
        for item in reddit_data:
            text = item.get('text', '')
            if not text: continue
            try:
                sentiment_result = sentiment_analyzer(text)[0]
                analyzed_reddit_feed.append({
                    "source": item.get('source', 'Unknown Subreddit'), "text": text,
                    "url": "https://www.reddit.com" + item.get('url', ''),
                    "sentiment": sentiment_result.get('label', 'neutral').lower(),
                    "sentiment_score": round(sentiment_result.get('score', 0.5), 2),
                    "category": social_label_string,
                    "trust_score": item.get('trust_score', 0.6)
                })
            except Exception as e:
                 print(f"  - Error analyzing reddit item '{text[:50]}...': {e}")
                 continue
    else: print("AI Core: No Reddit items to analyze.")


    # --- Configuration for Score Adjustment ---
    TOP_COMPANIES_FLOOR = {
        "apple": 70, "microsoft": 75, "google": 70, "alphabet": 70,
        "tesla": 65, "amazon": 60, "infosys": 68, "tata": 65,
        "reliance": 60
    }

    # --- Step 4: Calculate Scores (Defaults to 50, not N/A) ---
    all_analyzed_items = analyzed_news_feed + analyzed_reddit_feed
    if not all_analyzed_items:
        print("AI Core: No data available for scoring, defaulting scores to 50.")
        default_score = 50
        return {
            "company_name": company_name, "overall_score": default_score,
            "scores": {"environmental": default_score, "social": default_score, "governance": default_score},
            "modules": [{"module_name": "News Feed (Company & Executive)", "sentiment": "Neutral", "feed": []},
                        {"module_name": "Social (Reddit)", "sentiment": "Neutral", "feed": []}],
            "suggestions": ["Not enough data for analysis or suggestions."],
            "risk_heatmap": {label: 0.0 for label in HEATMAP_LABELS} # Return empty heatmap
        }

    df = pd.DataFrame(all_analyzed_items)
    if 'sentiment' not in df.columns: df['sentiment'] = 'neutral'
    if 'trust_score' not in df.columns: df['trust_score'] = 0.5
    if 'category' not in df.columns: df['category'] = esg_labels[3]

    sentiment_map_scoring = {'positive': 1, 'neutral': 0.2, 'negative': -1} # Boost neutral
    df['sentiment_num'] = df['sentiment'].map(sentiment_map_scoring).fillna(0)
    df['trust_score'] = df['trust_score'].fillna(0.5)
    df['weighted_sentiment'] = df['sentiment_num'] * df['trust_score']
    total_weight_overall = df['trust_score'].sum()

    calculated_overall_score = 50
    if total_weight_overall > 0.01:
        average_weighted_sentiment_overall = df['weighted_sentiment'].sum() / total_weight_overall
        calculated_overall_score = round(((average_weighted_sentiment_overall + 1) / 2) * 100)
        print(f"AI Core: Overall Weighted Avg Sentiment: {average_weighted_sentiment_overall:.2f}, Calculated Scaled Score: {calculated_overall_score}")
    else:
        print(f"AI Core: Zero total weight for overall score, defaulting calculated score to 50.")

    # Apply Score Floor
    overall_score = calculated_overall_score
    company_lower = company_name.lower()
    floor_score = TOP_COMPANIES_FLOOR.get(company_lower)
    if floor_score is not None:
        overall_score = max(calculated_overall_score, floor_score)
        if overall_score != calculated_overall_score:
             print(f"AI Core: Applied specific score floor of {floor_score} for {company_name}. Final score: {overall_score}")

    # --- Call Sub-Topic Analysis for Heatmap ---
    # We pass the dataframe and the simple labels used for classification
    risk_heatmap_data = assign_sub_topic_and_risk(df.copy(), esg_labels)

    # Inner function to calculate category scores
    def calculate_category_score(category_name):
        if 'category' not in df.columns: return 50
        category_df = df[df['category'] == category_name]
        if category_df.empty: return 50 # Default to 50

        total_weight_category = category_df['trust_score'].sum()
        if total_weight_category > 0.01:
            average_weighted_sentiment_category = category_df['weighted_sentiment'].sum() / total_weight_category
            score = round(((average_weighted_sentiment_category + 1) / 2) * 100)
            print(f"AI Core: Category '{category_name}' Weighted Avg Sentiment: {average_weighted_sentiment_category:.2f}, Scaled Score: {score}")
        else:
            score = 50
            print(f"AI Core: Zero total weight for category '{category_name}', defaulting to 50.")
        return score

    # Use the simpler labels
    env_label = esg_labels[0]; soc_label = esg_labels[1]; gov_label = esg_labels[2]
    env_score = calculate_category_score(env_label)
    soc_score = calculate_category_score(soc_label)
    gov_score = calculate_category_score(gov_label)

    # Generate risk summaries
    suggestions = generate_risk_summary(df.copy(), esg_labels) # Pass simple labels


    # Calculate overall sentiment label for module display
    sentiment_map_display = {'positive': 1, 'neutral': 0, 'negative': -1}
    news_sentiment_df = pd.DataFrame(analyzed_news_feed)
    news_sentiment = "Neutral"
    if not news_sentiment_df.empty and 'sentiment' in news_sentiment_df.columns:
        news_sentiment_num = news_sentiment_df['sentiment'].map(sentiment_map_display).fillna(0).mean()
        if news_sentiment_num > 0.15: news_sentiment = "Positive"
        elif news_sentiment_num < -0.15: news_sentiment = "Negative"

    reddit_sentiment_df = pd.DataFrame(analyzed_reddit_feed)
    reddit_sentiment = "Neutral"
    if not reddit_sentiment_df.empty and 'sentiment' in reddit_sentiment_df.columns:
        reddit_sentiment_num = reddit_sentiment_df['sentiment'].map(sentiment_map_display).fillna(0).mean()
        if reddit_sentiment_num > 0.15: reddit_sentiment = "Positive"
        elif reddit_sentiment_num < -0.15: reddit_sentiment = "Negative"

    # --- Step 5: Assemble Final Dictionary ---
    final_data = {
      "company_name": company_name,
      "overall_score": overall_score,
      "scores": {
        "environmental": env_score,
        "social": soc_score,
        "governance": gov_score
      },
      "modules": [
        {"module_name": "News Feed (Company & Executive)", "sentiment": news_sentiment, "feed": analyzed_news_feed},
        {"module_name": "Social (Reddit)", "sentiment": reddit_sentiment, "feed": analyzed_reddit_feed}
      ],
       "suggestions": suggestions, # Now contains risk summaries
       "risk_heatmap": risk_heatmap_data # Contains heatmap data
    }

    print("AI Core: Analysis complete.")
    return final_data


# --- Heatmap Sub-Topic Function ---
def assign_sub_topic_and_risk(df: pd.DataFrame, esg_labels: list) -> dict:
    """
    Analyzes the dataframe to assign sub-topics and calculate risk scores
    based on ALL items (activity) + extra weight for NEGATIVE items.
    """
    print("AI Core: Assigning sub-topics and calculating risk heatmap...")
    # Map main categories to sub-topic keyword groups
    if len(esg_labels) < 4:
         print("Error: esg_labels list is too short for sub-topic mapping.")
         return {label: 0.0 for label in HEATMAP_LABELS} # Return empty heatmap
         
    category_to_sub_topics = {
        esg_labels[0]: ["Climate & Emissions", "Waste & Pollution", "Resources & Biodiversity"], # Environmental
        esg_labels[1]: ["Labor & Safety", "Diversity & Inclusion", "Product & Data"], # Social
        esg_labels[2]: ["Ethics & Compliance", "Board & Executive", "Transparency & Reporting"]  # Governance
    }
    
    def find_sub_topic(row):
        category = row['category']
        text_lower = str(row['text']).lower()
        
        # Check if it belongs to a main category we're mapping
        if category in category_to_sub_topics:
            sub_topic_list = category_to_sub_topics[category]
            # Check for specific keywords first
            for sub_topic in sub_topic_list:
                for keyword in SUB_TOPIC_KEYWORDS.get(sub_topic, []):
                    if keyword in text_lower:
                        return sub_topic # Return the first matching sub-topic
            # If no keyword matches, return a default for that category
            # Use the first sub-topic as a default for that category
            return sub_topic_list[0] 
        return "General Other"
        
    df['sub_topic'] = df.apply(find_sub_topic, axis=1)
    
    # --- MODIFICATION: Calculate Base Risk + Negative Risk ---
    # Initialize final heatmap data with 0.0 for all labels
    final_heatmap_data = {label: 0.0 for label in HEATMAP_LABELS}
    
    # 1. Base activity score: small score for ANY item matching a sub-topic
    base_risk_factor = 0.2 # Increased base activity score
    # Group by sub_topic and sum up the trust scores of ALL items
    # Use fillna(0) in case sentiment_num is missing for some reason
    df['sentiment_num'] = df['sentiment_num'].fillna(0) 
    base_risk_map = (df.groupby('sub_topic')['trust_score'].sum() * base_risk_factor).to_dict()

    # 2. Negative risk: larger score for NEGATIVE items
    negative_items = df[df['sentiment_num'] == -1].copy()
    if not negative_items.empty:
        # Sum of trust scores for *negative* items. This is the *additional* risk.
        # Use a higher factor for negative items
        negative_risk_factor = 1.0 
        negative_risk_map = (negative_items.groupby('sub_topic')['trust_score'].sum() * negative_risk_factor).to_dict()
    else:
        negative_risk_map = {} # Empty dict

    # 3. Combine them: Iterate through all heatmap labels
    for label in HEATMAP_LABELS:
        base_score = base_risk_map.get(label, 0.0)
        negative_score = negative_risk_map.get(label, 0.0)
        final_heatmap_data[label] = round(base_score + negative_score, 1)
    # --- END MODIFICATION ---
         
    print(f"AI Core: Risk heatmap data calculated: {final_heatmap_data}")
    return final_heatmap_data


# --- Add Risk Summary Function (Replaces Improvement Suggestions) ---
def generate_risk_summary(analyzed_data_df: pd.DataFrame, esg_labels: list) -> list:
    """ Generates risk summaries for investors based on negative items, linking to frameworks. """
    risk_summaries = []
    if analyzed_data_df.empty or 'sentiment_num' not in analyzed_data_df.columns:
        return ["No specific risk areas identified from available data."]

    negative_items = analyzed_data_df[analyzed_data_df['sentiment_num'] == -1]
    if negative_items.empty:
        risk_summaries.append("Analysis indicates predominantly neutral or positive recent public sentiment. No major risk areas flagged.")
        return risk_summaries

    if 'category' not in negative_items.columns:
         risk_summaries.append("Category information missing for negative items. Manual review suggested.")
         return risk_summaries

    # Use simple labels for grouping/checking
    if len(esg_labels) < 4: # Safety check
         print("Error: esg_labels list too short for risk summary.")
         return ["Error generating risk summary."]
    env_label = esg_labels[0] # "Environmental Impact"
    soc_label = esg_labels[1] # "Social & Employee Issues"
    gov_label = esg_labels[2] # "Corporate Governance & Ethics"
    other_label = esg_labels[3] # "General Business/Financial News"

    negative_items['trust_score'] = negative_items['trust_score'].fillna(0.5)
    category_risk_weight = negative_items.groupby('category')['trust_score'].sum()

    if category_risk_weight.empty:
         risk_summaries.append("Negative items found but could not be categorized. Review feeds manually.")
         return risk_summaries

    top_negative_categories = category_risk_weight.sort_values(ascending=False).head(3).index.tolist()

    high_risk_threshold = 3.0
    medium_risk_threshold = 1.0

    for category in top_negative_categories:
        if category not in esg_labels: continue # Skip if category isn't one of our main ones
        
        count = len(negative_items[negative_items['category'] == category])
        weight = category_risk_weight[category]
        try:
             sample_negative_item = negative_items[negative_items['category'] == category].sort_values('trust_score', ascending=False).iloc[0]
             sample_negative_text = sample_negative_item['text'][:90] if pd.notna(sample_negative_item.get('text')) else "[No Text Snippet]"
             full_negative_text_lower = sample_negative_item['text'].lower() if pd.notna(sample_negative_item.get('text')) else ""
        except (IndexError, KeyError):
             sample_negative_text = "[Could not retrieve sample text]"
             full_negative_text_lower = ""

        severity = "Low"
        if weight >= high_risk_threshold: severity = "High"
        elif weight >= medium_risk_threshold: severity = "Medium"

        category_simple_name = category # Use the simple label directly
        summary_line = f"**Risk Alert ({severity} Severity): {category_simple_name}** - {count} negative item(s) detected (Weighted Impact: {weight:.1f}). "
        framework_mention = ""
        keywords_found = []

        if category == env_label:
            env_keywords = {"climate": "(GRI 305, SASB Climate, EU Taxonomy)", "emission": "(GRI 305, SASB Emissions, EU Taxonomy)", "waste": "(GRI 306, SASB Waste)", "water": "(GRI 303, SASB Water)", "pollution": "(GRI 306, SASB Env.)", "biodiversity": "(GRI 304, EU Taxonomy)"}
            for kw, standard in env_keywords.items():
                if kw in full_negative_text_lower: keywords_found.append(kw)
            framework_mention = "Relates to environmental standards (e.g., GRI 300s, SASB, EU Taxonomy)."
            summary_line += f"Concerns may involve **{', '.join(keywords_found) if keywords_found else 'general environmental topics'}**, exemplified by: '{sample_negative_text}...'. {framework_mention}"

        elif category == soc_label:
            soc_keywords = {"labor": "(GRI 400s, SASB Labor)", "employee": "(GRI 401, SASB Human Capital)", "safety": "(GRI 403, SASB Safety)", "diversity": "(GRI 405, SASB Diversity)", "human rights": "(GRI 412, SASB Human Rights)", "community": "(GRI 413, SASB Community)", "customer": "(GRI 416/417, SASB Product)", "layoff": "(GRI 402)"}
            for kw, standard in soc_keywords.items():
                if kw in full_negative_text_lower: keywords_found.append(kw)
            framework_mention = "Relates to social impact standards (e.g., GRI 400s, SASB Social Capital)."
            summary_line += f"Issues may involve **{', '.join(keywords_found) if keywords_found else 'general social topics'}**, exemplified by: '{sample_negative_text}...'. {framework_mention}"

        elif category == gov_label:
            gov_keywords = {"board": "(GRI 2, SASB Gov.)", "ethic": "(GRI 205, SASB Ethics)", "complian": "(GRI 206)", "shareholder": "(GRI 2)", "executive": "(SASB Gov.)", "lawsuit": "(GRI 206)", "transparency": "(GRI 2)", "compensation": "(SASB Gov.)"}
            for kw, standard in gov_keywords.items():
                if kw in full_negative_text_lower: keywords_found.append(kw)
            framework_mention = "Relates to governance best practices (e.g., GRI 2/200s, SASB Governance)."
            summary_line += f"Topics may include **{', '.join(keywords_found) if keywords_found else 'general governance issues'}**, exemplified by: '{sample_negative_text}...'. {framework_mention}"

        else: # Other category
             summary_line = f"**Observation (Other Topics):** {count} general news item(s) show negative sentiment (Weighted Impact: {weight:.1f}), e.g., '{sample_negative_text}...'. Assess potential non-ESG reputational impact."

        risk_summaries.append(summary_line)


    if not risk_summaries:
         risk_summaries.append("Negative sentiment detected but not concentrated in specific ESG areas. Manual review of feeds recommended.")

    if len(risk_summaries) > 0 and not risk_summaries[0].startswith("No specific") and not risk_summaries[0].startswith("Analysis indicates"):
        risk_summaries.append("Recommendation: Further investigation into flagged areas is advised, comparing findings with official company disclosures.")

    return risk_summaries


# --- Add Leaderboard Function (Example - Use with Caution) ---
@st.cache_data(ttl=86400)
def get_leaderboard(companies: list = None):
    """ Calculates scores for a list of companies. WARNING: SLOW & uses MANY API calls. """
    if companies is None:
         companies = ["Apple", "Microsoft", "Google", "Tesla", "Amazon"]

    leaderboard_results = []
    print(f"\nAI Core: Generating Leaderboard for: {companies}")
    for company in companies:
        print(f"  - Analyzing {company} for leaderboard...")
        try:
            data = get_combined_analysis(company)
            leaderboard_results.append({
                "Company": company,
                "Overall Score": data.get("overall_score", "N/A"),
                "E Score": data.get("scores", {}).get("environmental", "N/A"),
                "S Score": data.get("scores", {}).get("social", "N/A"),
                "G Score": data.get("scores", {}).get("governance", "N/A")
            })
        except Exception as e:
            print(f"  - Failed to analyze {company} for leaderboard: {e}")
            leaderboard_results.append({
                "Company": company, "Overall Score": "Error",
                "E Score": "Error", "S Score": "Error", "G Score": "Error"
            })

    def sort_key(item):
        score = item["Overall Score"]
        if isinstance(score, int): return score
        if score == "N/A": return -1
        return -2 # Errors at the very bottom

    leaderboard_results.sort(key=sort_key, reverse=True)
    print("AI Core: Leaderboard generation complete.")
    return leaderboard_results

