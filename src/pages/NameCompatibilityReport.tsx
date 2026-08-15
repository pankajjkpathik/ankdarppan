/* Standardized Date Formats & Visual Visibility Edits applied */
import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import sampleReport from "@/assets/name-sample.jpg.asset.json";

const NameCompatibilityReport = () => {
  return (
    <>
      <SEO 
        title="Name Correction & Numerology Report ₹941 | Ank Darppan"
        description="क्या आपका नाम आपकी जन्मतिथि से match करता है? Name analysis + correction options. Sawan offer ₹941."
        canonical="https://www.ankdarppan.com/name-compatibility-report"
      />
      <ServiceLandingPage
        serviceTitle="Name Compatibility Report"
        price={891}
        matchTitles={["Name Compatibility"]}
        oldPrice={2100}
        description="Is your name working for you or against you? Discover how your name's vibration aligns with your birth date for maximum success."
        sampleReportImage={sampleReport.url}
        benefits={[
          "Name spelling optimization",
          "Vibration analysis of current name",
          "Alignment with Psychic and Destiny numbers",
          "Signature correction for prosperity",
          "Social and legal name advice",
          "Lucky alphabets and combinations"
        ]}
      />
    </>
  );
};

export default NameCompatibilityReport;