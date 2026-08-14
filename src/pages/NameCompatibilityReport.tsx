/* Standardized Date Formats & Visual Visibility Edits applied */
import ServiceLandingPage from "@/components/ServiceLandingPage";
import sampleReport from "@/assets/name-sample.jpg.asset.json";

const NameCompatibilityReport = () => {
  return (
    <ServiceLandingPage
      serviceTitle="Name Compatibility Report"
      price={891}
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
  );
};

export default NameCompatibilityReport;