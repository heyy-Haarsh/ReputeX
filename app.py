# This is app.py
# This file is your "Test Harness" for ai_core.py

import streamlit as st
import ai_core  # <-- This imports all your code from ai_core.py
import json

# --- Page Setup ---
st.set_page_config(layout="wide")
st.title("ReputeX - AI Core Test Page 🧪")
st.write("This page is for testing the `ai_core.py` script. Type a company name and check the results.")

# --- User Input ---
company_name = st.text_input("Enter a company name to test (e.g., Tesla, Apple, Microsoft):")

if st.button("Run AI Core Analysis"):
    if company_name:
        # --- Run Your Code ---
        # This will call your main function and show a loading spinner
        with st.spinner(f"Running full analysis for {company_name}... This will take 30-60 seconds the first time as models download."):
            try:
                # This is the single most important line:
                # It calls your ai_core.py file to get all the data
                final_data = ai_core.get_combined_analysis(company_name)
                
                st.success("Analysis Complete!")
                
                st.subheader("Check your VS Code Terminal for 'AI Core:' print messages to see the step-by-step process.")
                
                # --- Display Results ---
                st.subheader(f"Overall Score: {final_data.get('overall_score')}")
                
                st.subheader("Raw Data Output (as JSON):")
                st.json(final_data) # This displays the entire dictionary
                
            except Exception as e:
                st.error(f"An error occurred in ai_core.py!")
                st.exception(e) # This will print the full error message
    else:
        st.warning("Please enter a company name.")
