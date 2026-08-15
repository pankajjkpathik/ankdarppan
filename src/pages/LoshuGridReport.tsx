/* Standardized Date Formats & Visual Visibility Edits applied */
import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import sampleReport from "@/assets/loshu-sample.jpg.asset.json";

const LoshuGridReport = () => {
  return (
    <>
      <SEO 
        title="Lo Shu Grid Report ₹941 | अपनी जन्मतिथि का नक्शा | Ank Darppan"
        description="आपकी Lo Shu Grid में कौन-से numbers missing हैं? Missing planes, remedies और पूरा analysis. Sawan offer ₹941."
        canonical="https://www.ankdarppan.com/loshu-grid-report"
      />
      <ServiceLandingPage
        serviceTitle="Loshu Grid Report"
        price={941}
        matchTitles={["Loshu Grid"]}
        oldPrice={2100}
        description="Unlock the ancient secrets of the Loshu Grid. This report provides a complete analysis of your birth chart using Chinese numerology principles."
        sampleReportImage={sampleReport.url}
        benefits={[
          "Complete 3x3 Loshu Grid analysis",
          "Missing number remedies",
          "Impact of repeated numbers",
          "Success and career directions",
          "Health and relationship insights",
          "Personalized corrective measures"
        ]}
      />
    </>
  );
};

export default LoshuGridReport;