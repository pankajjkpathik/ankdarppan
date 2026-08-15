import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import sampleReport from "@/assets/marriage-sample.jpg.asset.json";

const MarriageCompatibility = () => {
  return (
    <>
      <SEO 
        title="Marriage Compatibility Report ₹941 | Numerology Match | Ank Darppan"
        description="शादी से पहले numbers ज़रूर मिलाइए। दोनों की compatibility, strengths और remedies. Sawan offer ₹941."
        canonical="https://www.ankdarppan.com/marriage-compatibility"
      />
      <ServiceLandingPage
        serviceTitle="Marriage Compatibility"
        price={941}
        matchTitles={["Marriage Compatibility"]}
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
    </>
  );
};

export default MarriageCompatibility;