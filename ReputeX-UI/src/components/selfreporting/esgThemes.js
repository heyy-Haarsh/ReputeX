import {
  FiFileText, FiCheckCircle, FiTrendingUp, FiShield,
  FiBarChart2, FiAward
} from "react-icons/fi";
import React from "react";


// All icon fields use React.createElement component
export const features = [
  {
    icon: React.createElement(FiFileText),
    title: "Interactive Assessment",
    description: "Answer yes/no and quantitative questions across E, S, G dimensions. No signup required.",
    color: "#00ff88"
  },
  {
    icon: React.createElement(FiCheckCircle),
    title: "Global Standards Aligned",
    description: "Built on SASB and GRI frameworks for globally recognized ESG metrics.",
    color: "#673ab7"
  },
  {
    icon: React.createElement(FiTrendingUp),
    title: "Real-Time Integration",
    description: "Combines self-reported data with live sentiment analysis from news and social media.",
    color: "#3f51b5"
  },
  {
    icon: React.createElement(FiShield),
    title: "Greenwashing Detection",
    description: "Automatic verification of claims against public perception to ensure authenticity.",
    color: "#00ffaa"
  },
  {
    icon: React.createElement(FiBarChart2),
    title: "Instant Visualization",
    description: "Interactive radar charts, circular gauges, and heatmaps for immediate insights.",
    color: "#ab47bc"
  },
  {
    icon: React.createElement(FiAward),
    title: "Balanced Scoring",
    description: "Merges internal assessment with external data for transparent, accurate ESG scores.",
    color: "#00ddbb"
  }
];

export const sampleQuestions = [
  { category: 'Environmental', question: 'Do you track and report carbon emissions?', checked: true },
  { category: 'Environmental', question: 'Is there a renewable energy policy in place?', checked: true },
  { category: 'Social', question: 'Is there an equal pay policy in place?', checked: false },
  { category: 'Social', question: 'Do you have a diversity & inclusion program?', checked: true },
  { category: 'Governance', question: 'Is your board gender-diverse (>30%)?', checked: true },
  { category: 'Governance', question: 'Are ESG metrics tied to executive compensation?', checked: false },
];
