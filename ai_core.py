import streamlit as st
import requests
import praw
import pandas as pd
from transformers import pipeline
# If using fuzzywuzzy for deduplication:
# from fuzzywuzzy import fuzz

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

# --- GNews ---
@st.cache_data(ttl=3600) # Cache data for 1 hour
def get_news(company_name: str) -> list:
    """ Fetches general ESG news articles for the company from GNews. """
    print(f"AI Core: Fetching general ESG news from GNews for {company_name}")
    response = None # Initialize
    try:
        api_key = st.secrets["GNEWS_API_KEY"]

        # Broader Query
        esg_terms = [
            "ESG", "environmental", "social", "governance", "sustainability",
            "ethics", "carbon", "climate", "labor", "community", "diversity",
            "pollution", "emissions", "renewable"
        ]
        esg_or_query = " OR ".join(esg_terms)
        identifier_terms = ["stock", "shares", "Inc.", "Corp.", "Ltd.", "Group"]
        identifier_query = " OR ".join([f'"{company_name} {term}"' for term in identifier_terms])
        query = f'("{company_name}" OR ({identifier_query})) AND ({esg_or_query})'

        url = "https://gnews.io/api/v4/search"
        params = {
            "q": query, "lang": "en", "max": 25, "apikey": api_key,
            "in": "title,description", "sortby": "relevance"
        }

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
        exclude_keywords = ["forest", "river", "rainforest", "jungle", "amazonas", "dorabji", "recipe"]
        company_variants = [company_name.lower()]
        if company_name.lower() == "tata":
             company_variants.extend(["tata group", "tata motors", "tata steel", "tcs"])

        for article in articles:
            title_lower = article['title'].lower()
            desc_lower = article.get('description', '').lower()
            content_lower = title_lower + " " + desc_lower

            if not any(variant in content_lower for variant in company_variants): continue
            if any(keyword in content_lower for keyword in exclude_keywords): continue

            filtered_articles.append({
                "source": article['source']['name'],
                "text": article['title'],
                "url": article['url']
            })

        print(f"Found {len(filtered_articles)} relevant GNews articles after filtering for {company_name}")
        return filtered_articles

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GNews (Network/HTTP Error): {e}")
        if response is not None: print(f"Response content: {response.text[:500]}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_news: {e}")
        return []

# --- Mediastack ---
@st.cache_data(ttl=3600) # Cache for 1 hour
def get_mediastack_news(company_name: str) -> list:
    """ Fetches general ESG news articles from Mediastack. """
    print(f"AI Core: Fetching Mediastack news for {company_name}")
    response = None # Initialize
    try:
        api_key = st.secrets["MEDIASTACK_API_KEY"]

        esg_terms = ["ESG", "environmental", "social", "governance", "sustainability", "ethics"]
        # Mediastack 'keywords' syntax might need checking - this is a guess
        keywords = f'{company_name} ( { " OR ".join(esg_terms) } )'

        url = "http://api.mediastack.com/v1/news" # Note: Check if HTTPS is needed/allowed
        params = {
            'access_key': api_key,
            'keywords': keywords,
            'languages': 'en',
            'limit': 25, # Requesting more
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
            if article.get('title') and article.get('url'):
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
             print(f"Mediastack Response Body: {response.text[:500]}") # Show API error
        return []
    except Exception as e:
        print(f"An unexpected error occurred in get_mediastack_news: {e}")
        return []

# --- Newsdata.io ---
@st.cache_data(ttl=3600) # Cache for 1 hour
def get_newsdata_news(company_name: str) -> list:
    """ Fetches general ESG news articles from Newsdata.io. """
    print(f"AI Core: Fetching Newsdata.io news for {company_name}")
    response = None # Initialize
    try:
        api_key = st.secrets["NEWSDATA_API_KEY"]

        esg_terms = ["ESG", "environmental", "social", "governance", "sustainability", "ethics"]
        # Newsdata.io 'q' syntax - check docs, assuming AND/OR works
        query = f'"{company_name}" AND ({ " OR ".join(esg_terms) })'

        url = "https://newsdata.io/api/1/news"
        params = {
            'apikey': api_key,
            'q': query,
            'language': 'en',
            # 'size': 10 # Free plan default is usually 10, may not allow more
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
             print(f"Newsdata.io Response Body: {response.text[:500]}") # Show API error
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
        subreddits_to_search = ["investing", "stocks", "wallstreetbets", "antiwork", "recruitinghell", "environment"]
        query = f'"{company_name}"'
        posts_list = []
        total_posts_limit = 15
        posts_found = 0

        for sub in subreddits_to_search:
            if posts_found >= total_posts_limit: break
            try:
                subreddit = reddit.subreddit(sub)
                for submission in subreddit.search(query, sort="relevance", limit=5):
                    if posts_found < total_posts_limit:
                        posts_list.append({
                            "source": f"r/{sub}",
                            "text": submission.title,
                            "url": submission.permalink
                        })
                        posts_found += 1
                    else: break
            except Exception as sub_e:
                print(f"  - Error searching subreddit r/{sub}: {sub_e}")
                continue

        print(f"Found {len(posts_list)} relevant Reddit posts for {company_name}")
        return posts_list

    except Exception as e:
        print(f"Error fetching Reddit: {e}")
        return []

# --- MAIN ANALYSIS FUNCTION ---
def get_combined_analysis(company_name: str) -> dict:
    """
    Main function. Fetches from multiple sources, analyzes, scores, returns dict.
    """
    print(f"AI Core: Starting combined analysis for {company_name}...")

    # --- Step 1: Load AI Models ---
    sentiment_analyzer, esg_classifier = load_analyzers()

    # --- Step 2: Fetch Data from ALL Sources ---
    gnews_data = get_news(company_name)
    mediastack_data = get_mediastack_news(company_name)
    newsdata_data = get_newsdata_news(company_name)
    reddit_data = get_reddit_posts(company_name)

    # --- Step 2b: Combine and De-duplicate News ---
    all_fetched_news = gnews_data + mediastack_data + newsdata_data
    deduplicated_news = []
    seen_urls = set()
    print(f"AI Core: Total news articles fetched before deduplication: {len(all_fetched_news)}")
    for article in all_fetched_news:
        url = article.get("url")
        if url and url not in seen_urls:
            deduplicated_news.append(article)
            seen_urls.add(url)
            # Add fuzzywuzzy title check here if needed

    all_news_data = deduplicated_news[:50] # Keep up to 50 unique articles
    print(f"AI Core: News articles after deduplication (max 50): {len(all_news_data)}")

    # --- Step 3: Analyze Data ---
    esg_labels = [
        "Environmental topics: company's impact on nature, climate change, pollution, sustainability efforts, resource use (water, energy), conservation",
        "Social topics: employee relations (layoffs, strikes, safety, diversity), human rights, community impact, customer welfare, product safety",
        "Governance topics: corporate leadership, board structure, executive pay, shareholder issues, business ethics, transparency, lawsuits, regulatory compliance, financial reporting",
        "Other topics: General business news, stock performance, product launches, partnerships, personnel changes (unless related to governance/social issues)"
    ]
    hypothesis_template = "This news article discusses {}."
    confidence_threshold = 0.5

    analyzed_news_feed = []
    print(f"AI Core: Analyzing {len(all_news_data)} news items...")
    if all_news_data:
        for item in all_news_data:
            text = item.get('text', '')
            if not text: continue
            try:
                sentiment_result = sentiment_analyzer(text)[0]
                esg_result = esg_classifier(text, esg_labels, hypothesis_template=hypothesis_template)
                top_label = esg_result['labels'][0]
                top_score = esg_result['scores'][0]

                if top_score < confidence_threshold:
                    final_category = esg_labels[3]
                    explanation = f"Low confidence ({top_score:.1%}). Defaulted to Other."
                    # print(f"  - Low confidence ({top_score:.2f}) for news '{text[:50]}...'. Classified as Other.") # Optional debug log
                else:
                    final_category = top_label
                    explanation = f"Classified as '{final_category.split(':')[0]}' ({top_score:.1%})."

                analyzed_news_feed.append({
                    "source": item.get('source', 'Unknown Source'), "text": text, "url": item.get('url', '#'),
                    "sentiment": sentiment_result.get('label', 'neutral').lower(),
                    "sentiment_score": round(sentiment_result.get('score', 0.5), 2),
                    "category": final_category, "explanation": explanation
                })
            except Exception as e:
                print(f"  - Error analyzing news item '{text[:50]}...': {e}")
                continue
    else: print("AI Core: No news items to analyze.")

    analyzed_reddit_feed = []
    print(f"AI Core: Analyzing {len(reddit_data)} Reddit items...")
    social_label_string = esg_labels[1]
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
                    "category": social_label_string # Assign specific Social label
                })
            except Exception as e:
                 print(f"  - Error analyzing reddit item '{text[:50]}...': {e}")
                 continue
    else: print("AI Core: No Reddit items to analyze.")

    # --- Step 4: Calculate Scores (Balanced Average Method) ---
    all_analyzed_items = analyzed_news_feed + analyzed_reddit_feed
    if not all_analyzed_items:
        print("AI Core: No data available for scoring.")
        return {
            "company_name": company_name, "overall_score": "N/A",
            "scores": {"environmental": "N/A", "social": "N/A", "governance": "N/A"},
            "modules": [{"module_name": "Official News (ESG)", "sentiment": "Neutral", "feed": []},
                        {"module_name": "Social (Reddit)", "sentiment": "Neutral", "feed": []}]
        }

    df = pd.DataFrame(all_analyzed_items)
    sentiment_map = {'positive': 1, 'neutral': 0, 'negative': -1}
    df['sentiment_num'] = df['sentiment'].map(sentiment_map).fillna(0)

    average_sentiment_overall = df['sentiment_num'].mean()
    overall_score = round(((average_sentiment_overall + 1) / 2) * 100)
    print(f"AI Core: Overall Avg Sentiment: {average_sentiment_overall:.2f}, Scaled Score: {overall_score}")

    def calculate_category_score(category_name):
        category_df = df[df['category'] == category_name]
        if category_df.empty: return None
        average_sentiment_category = category_df['sentiment_num'].mean()
        score = round(((average_sentiment_category + 1) / 2) * 100)
        print(f"AI Core: Category '{category_name.split(':')[0]}' Avg Sentiment: {average_sentiment_category:.2f}, Scaled Score: {score}")
        return score

    env_label = esg_labels[0]; soc_label = esg_labels[1]; gov_label = esg_labels[2]
    env_score = calculate_category_score(env_label)
    soc_score = calculate_category_score(soc_label)
    gov_score = calculate_category_score(gov_label)

    # Calculate overall sentiment label for module display
    news_sentiment_df = pd.DataFrame(analyzed_news_feed)
    news_sentiment = "Neutral"
    if not news_sentiment_df.empty:
        news_sentiment_num = news_sentiment_df['sentiment'].map(sentiment_map).fillna(0).mean()
        if news_sentiment_num > 0.15: news_sentiment = "Positive"
        elif news_sentiment_num < -0.15: news_sentiment = "Negative"

    reddit_sentiment_df = pd.DataFrame(analyzed_reddit_feed)
    reddit_sentiment = "Neutral"
    if not reddit_sentiment_df.empty:
        reddit_sentiment_num = reddit_sentiment_df['sentiment'].map(sentiment_map).fillna(0).mean()
        if reddit_sentiment_num > 0.15: reddit_sentiment = "Positive"
        elif reddit_sentiment_num < -0.15: reddit_sentiment = "Negative"

    # --- Step 5: Assemble Final Dictionary ---
    final_data = {
      "company_name": company_name,
      "overall_score": overall_score,
      "scores": {
        "environmental": env_score if env_score is not None else "N/A",
        "social": soc_score if soc_score is not None else "N/A",
        "governance": gov_score if gov_score is not None else "N/A"
      },
      "modules": [
        {"module_name": "Official News (ESG)", "sentiment": news_sentiment, "feed": analyzed_news_feed},
        {"module_name": "Social (Reddit)", "sentiment": reddit_sentiment, "feed": analyzed_reddit_feed}
      ]
    }

    print("AI Core: Analysis complete.")
    return final_data

# --- Add Improvement Suggestion Function (Example) ---
def generate_improvement_suggestions(analyzed_data_df: pd.DataFrame) -> list:
    """ Generates simple improvement suggestions based on negative items. """
    suggestions = []
    if analyzed_data_df.empty:
        return ["No data available to generate suggestions."]

    # Use the same mapping as in scoring
    sentiment_map = {'positive': 1, 'neutral': 0, 'negative': -1}
    analyzed_data_df['sentiment_num'] = analyzed_data_df['sentiment'].map(sentiment_map).fillna(0)

    negative_items = analyzed_data_df[analyzed_data_df['sentiment_num'] == -1]

    if negative_items.empty:
        suggestions.append("Overall sentiment appears positive or neutral. Maintain current efforts.")
        return suggestions

    # Count negative items per category
    category_counts = negative_items['category'].value_counts()

    # Get the top 1-2 categories with the most negative sentiment
    top_negative_categories = category_counts.head(2).index.tolist()

    for category in top_negative_categories:
        category_short_name = category.split(':')[0] # Get 'Environmental', 'Social', etc.
        count = category_counts[category]
        sample_negative_text = negative_items[negative_items['category'] == category].iloc[0]['text'][:80] # Get first few words of an example

        if "Environmental" in category_short_name:
            suggestions.append(f"Focus Area: Environmental ({count} items). Address concerns like those mentioned in: '{sample_negative_text}...'. Review sustainability practices.")
        elif "Social" in category_short_name:
            suggestions.append(f"Focus Area: Social ({count} items). Address issues like those in: '{sample_negative_text}...'. Review employee relations, community impact, or product safety.")
        elif "Governance" in category_short_name:
            suggestions.append(f"Focus Area: Governance ({count} items). Address topics like: '{sample_negative_text}...'. Review leadership decisions, ethics, or transparency.")
        # Add more specific suggestions if possible based on keywords in negative items

    if not suggestions:
         suggestions.append("Review overall negative feedback across categories for potential improvements.")

    return suggestions

# --- Add Leaderboard Function (Example) ---
# NOTE: Running this live can be SLOW and hit API limits quickly.
# Consider pre-calculating or using a very small list for the demo.
@st.cache_data(ttl=86400) # Cache leaderboard for a day
def get_leaderboard(companies: list = None):
    """ Calculates scores for a list of companies. Use with caution due to runtime/API limits. """
    if companies is None:
         # Use a small, fixed list for the hackathon demo
         companies = ["Apple", "Microsoft", "Google", "Tesla", "Amazon"]

    leaderboard_results = []
    print(f"\nAI Core: Generating Leaderboard for: {companies}")
    for company in companies:
        print(f"  - Analyzing {company} for leaderboard...")
        # IMPORTANT: This calls the full analysis for each company!
        # It will be slow and use many API calls.
        data = get_combined_analysis(company)
        leaderboard_results.append({
            "Company": company,
            "Overall Score": data.get("overall_score", "N/A"),
            "E Score": data.get("scores", {}).get("environmental", "N/A"),
            "S Score": data.get("scores", {}).get("social", "N/A"),
            "G Score": data.get("scores", {}).get("governance", "N/A")
        })

    # Sort by Overall Score (handle 'N/A')
    def sort_key(item):
        score = item["Overall Score"]
        return int(score) if isinstance(score, int) else -1 # Put N/A at the bottom

    leaderboard_results.sort(key=sort_key, reverse=True)
    print("AI Core: Leaderboard generation complete.")
    return leaderboard_results

# --- Add PDF Analyzer Function (Example - Basic Regex) ---
# Needs PyMuPDF: pip install pymupdf
try:
    import fitz # PyMuPDF
except ImportError:
    print("PyMuPDF (fitz) not installed. PDF analysis will not work.")
    fitz = None

def analyze_pdf_greenwash(uploaded_file):
    """ Basic analysis of PDF text for 'greenwashing' keywords. """
    if not fitz:
         return {"error": "PyMuPDF library not installed."}
    if uploaded_file is None:
         return {"error": "No file uploaded."}

    try:
        doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

        if not text:
             return {"credibility_score": 0, "flags": ["Could not extract text from PDF."]}

        # Simple check for vague 'weasel words' vs. concrete terms
        weasel_words = ["aim to", "strive", "target", "plan to", "potential", "hope to", "intend to", "may", "could"]
        concrete_words = ["achieved", "reduced", "increased", "implemented", "completed", "verified", "certified", "quantified"] # Add metrics like kWh, tons CO2 etc. if possible

        weasel_count = 0
        concrete_count = 0
        flags = []

        # Very basic check - count occurrences (case-insensitive)
        text_lower = text.lower()
        for word in weasel_words:
            count = text_lower.count(word)
            if count > 0:
                weasel_count += count
                # Find first occurrence for flag example
                try:
                    index = text_lower.index(word)
                    snippet = text[max(0, index-20):min(len(text), index+len(word)+20)].replace("\n", " ")
                    flags.append(f"Vague term: ...{snippet}...")
                except ValueError: pass # Should not happen if count > 0

        for word in concrete_words:
            concrete_count += text_lower.count(word)

        # Simple scoring: ratio of concrete to total (adjust weights as needed)
        total_relevant = weasel_count + concrete_count
        if total_relevant == 0:
            credibility_score = 50 # Neutral if no relevant words found
        else:
            credibility_score = round((concrete_count / total_relevant) * 100)

        # Limit flags shown
        flags = flags[:5]

        return {"credibility_score": credibility_score, "flags": flags, "weasel_count": weasel_count, "concrete_count": concrete_count}

    except Exception as e:
        print(f"Error analyzing PDF: {e}")
        return {"error": f"Failed to process PDF. Ensure it's a valid text-based PDF. Error: {e}"}


# --- Add Improvement Suggestion Function ---
# (Keep the generate_improvement_suggestions function from previous example here)
def generate_improvement_suggestions(analyzed_data_df: pd.DataFrame) -> list:
    """ Generates simple improvement suggestions based on negative items. """
    suggestions = []
    if analyzed_data_df.empty:
        return ["No data available to generate suggestions."]

    sentiment_map = {'positive': 1, 'neutral': 0, 'negative': -1}
    # Ensure sentiment_num exists, apply map again if necessary
    if 'sentiment_num' not in analyzed_data_df.columns:
         analyzed_data_df['sentiment_num'] = analyzed_data_df['sentiment'].map(sentiment_map).fillna(0)

    negative_items = analyzed_data_df[analyzed_data_df['sentiment_num'] == -1]

    if negative_items.empty:
        suggestions.append("Overall sentiment positive/neutral. Maintain current ESG focus.")
        return suggestions

    category_counts = negative_items['category'].value_counts()
    top_negative_categories = category_counts.head(2).index.tolist()

    for category in top_negative_categories:
        category_short_name = category.split(':')[0]
        count = category_counts[category]
        # Safely get sample text
        sample_negative_item = negative_items[negative_items['category'] == category].iloc[0]
        sample_negative_text = sample_negative_item['text'][:80] if pd.notna(sample_negative_item['text']) else "[No Text]"

        if "Environmental" in category_short_name:
            suggestions.append(f"Focus Area: Environmental ({count} items). Address concerns like: '{sample_negative_text}...'. Review sustainability reports/data.")
        elif "Social" in category_short_name:
            suggestions.append(f"Focus Area: Social ({count} items). Address issues like: '{sample_negative_text}...'. Review employee feedback, community engagement.")
        elif "Governance" in category_short_name:
            suggestions.append(f"Focus Area: Governance ({count} items). Address topics like: '{sample_negative_text}...'. Review board decisions, ethics policies.")
        else: # Other category
             suggestions.append(f"Focus Area: Other ({count} items). Review negative general news like: '{sample_negative_text}...'. Assess potential reputational impact.")

    if not suggestions:
         suggestions.append("Review overall negative feedback across categories for potential improvements.")

    return suggestions
