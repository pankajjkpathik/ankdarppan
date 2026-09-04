import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import { loshuSamplePages, LOSHU_TOTAL_PAGES } from "@/data/samplePages";

const sampleReport = { url: loshuSamplePages[0] };

const LoshuGridReport = () => {
  return (
    <>
      <SEO 
        title="Lo Shu Grid Report ₹941 | अपनी जन्मतिथि का नक्शा | Ank Darppan"
        description="आपके Lo Shu Grid में कौन-से numbers missing हैं? Missing planes, remedies और पूरा analysis. Sawan offer ₹941."
        canonical="https://www.ankdarppan.com/loshu-grid-report"
      />
      <ServiceLandingPage
        serviceTitle="Lo Shu Grid Report"
        price={941}
        matchTitles={["Loshu Grid Report", "Lo Shu Grid"]}
        oldPrice={2100}
        description="Discover the secret map of your destiny. Our detailed Lo Shu Grid report identifies missing numbers, hidden strengths, and powerful remedies based on your birth date."
        sampleReportImage={sampleReport.url}
        samplePages={loshuSamplePages}
        sampleTotalPages={LOSHU_TOTAL_PAGES}
        benefits={[
          "Complete analysis of all 8 planes of life",
          "Identification of missing numbers and their impact",
          "Customized remedies for weak sectors",
          "Career and financial growth insights",
          "Health and relationship predictions",
          "Personalized lucky colors and directions"
        ]}
      />
    </>
  );
};

export default LoshuGridReport;
