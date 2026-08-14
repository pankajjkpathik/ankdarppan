/* Standardized Date Formats & Visual Visibility Edits applied */
import ServiceLandingPage from "@/components/ServiceLandingPage";
import sampleReport from "@/assets/marriage-sample.jpg.asset.json";

const MarriageCompatibility = () => {
  return (
    <ServiceLandingPage
      serviceTitle="Marriage Compatibility"
      price={941}
      oldPrice={2100}
      description="Ensure a harmonious lifetime partnership. Our compatibility report analyzes the numerological alignment between two individuals for a successful marriage."
      sampleReportImage={sampleReport.url}
      benefits={[
        "Destiny number alignment analysis",
        "Communication and emotional bonding score",
        "Financial compatibility insights",
        "Potential challenge areas and remedies",
        "Long-term stability forecast",
        "Auspicious dates for marriage events"
      ]}
    />
  );
};

export default MarriageCompatibility;