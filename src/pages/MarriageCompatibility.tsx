import ServiceLandingPage from "@/components/ServiceLandingPage";
import sampleReport from "@/assets/marriage_compatibility_report_sample.png.asset.json";

const MarriageCompatibility = () => {
  return (
    <ServiceLandingPage
      serviceTitle="Marriage Compatibility"
      price={2100}
      oldPrice={4200}
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