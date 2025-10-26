// src/GreenwashAnalyzer.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Make sure you've run: npm install axios

function GreenwashAnalyzer() {
  // State variables to manage form inputs, loading status, results, and errors
  const [companyName, setCompanyName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Basic validation for PDF type
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null); // Clear any previous file errors
    } else {
      setSelectedFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default browser form submission

    // Basic validation for inputs
    if (!companyName || !selectedFile) {
      setError('Please enter a company name and select a PDF file.');
      return;
    }

    // Reset state for a new analysis
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    // Create a FormData object to send file and text data together
    const formData = new FormData();
    formData.append('company_name', companyName.trim()); // Send trimmed company name
    formData.append('file', selectedFile);

    try {
      // Make the POST request to the FastAPI backend endpoint
      // Ensure this URL matches where your FastAPI server is running (likely http://localhost:8000)
      const response = await axios.post(
        'http://localhost:8000/analyze_company/', // Your FastAPI endpoint
        formData,
        {
          // Required header for sending files
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Optional: Add a timeout for long requests (e.g., 5 minutes)
          // timeout: 300000, // 300 seconds = 5 minutes
        }
      );

      // Store the successful analysis report from the backend
      setAnalysisResult(response.data);

    } catch (err) {
      // Handle errors during the API call
      console.error('Analysis request failed:', err);
      // Extract a useful error message (from backend if possible, otherwise generic)
      const backendError = err.response?.data?.detail || err.message || 'Analysis failed. Please check the backend server logs.';
      setError(`Error: ${backendError}`);
    } finally {
      // Ensure loading state is turned off regardless of success or failure
      setIsLoading(false);
    }
  };

  // Helper function to render the analysis results conditionally
  const renderReport = () => {
    // Don't render anything if there's no result yet
    if (!analysisResult) return null;

    return (
      <div className="report-results" style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h4 style={{ marginTop: '0' }}>Analysis Report for: {analysisResult.company_name?.toUpperCase()}</h4>
        <p style={{ fontWeight: 'bold' }}>Status: {analysisResult.status}</p>

        {/* If inconsistent, display the list of flagged issues */}
        {analysisResult.status === 'Inconsistent' && Array.isArray(analysisResult.report) ? (
          <ul style={{ paddingLeft: '20px' }}>
            {analysisResult.report.map((item, index) => (
              <li key={index} style={{ color: '#d9534f', marginBottom: '10px' }}> {/* Using a red color for warnings */}
                <strong>{item.topic}:</strong> {item.flag}
              </li>
            ))}
          </ul>
        ) : (
          /* Otherwise, display the consistent/error message */
          <p>{analysisResult.report}</p>
        )}
      </div>
    );
  };

  // --- JSX for the component's UI ---
  return (
    <div className="greenwash-analyzer" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Greenwashing Analysis</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px' }}>Enter the company name and upload their ESG/Sustainability report (PDF).</p>

      <form onSubmit={handleSubmit}>
        {/* Company Name Input */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px' }}>Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="e.g., Tesla, Apple"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* File Input */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="pdfFile" style={{ display: 'block', marginBottom: '5px' }}>ESG Report (PDF):</label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf" // Browser-level filter for PDF files
            onChange={handleFileChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Analyzing... Please wait...' : 'Run Analysis'}
        </button>
      </form>

      {/* Display Error Messages */}
      {error && <p style={{ color: '#d9534f', marginTop: '15px', textAlign: 'center' }}>{error}</p>}

      {/* Display Loading Indicator */}
      {isLoading && <p style={{ marginTop: '15px', textAlign: 'center' }}>Processing... This might take a few minutes depending on the report and Reddit search speed.</p>}

      {/* Display Analysis Results Section */}
      {renderReport()}

    </div>
  );
}

// --- Make sure to include the default export ---
export default GreenwashAnalyzer;