import React from "react";
import styled from "styled-components";
import HeroSection from "../components/selfreporting/HeroSection";
import FeaturesSection from "../components/selfreporting/FeaturesSection";
import StickyProcess from "../components/selfreporting/StickyProcess";
import FormPreviewSection from "../components/selfreporting/FormPreviewSection";
import ESGInsightSection from "../components/selfreporting/ESGInsightSection";
import CTASection from "../components/selfreporting/CTASection";

const PageWrapper = styled.div`
  background: #000;
  min-height: 100vh;
  padding-top: 80px;
`;

const SelfReporting1 = () => (
  <PageWrapper>
    <HeroSection />
    <FeaturesSection />
    <StickyProcess />
    <FormPreviewSection />
    <CTASection />
  </PageWrapper>
);

export default SelfReporting1;
