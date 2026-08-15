import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import sampleReport from "@/assets/mobile-sample.jpg.asset.json";

const MobileCompatibilityReport = () => {
  return (
    <>
      <SEO 
        title="Mobile Number Numerology Report ₹581 | Ank Darppan"
        description="आपका Mobile Number आपके लिए lucky है या नहीं? पूरी report + voice note, 24 घंटे में। Sawan offer ₹581."
        canonical="https://www.ankdarppan.com/mobile-compatibility-report"
      />
      <ServiceLandingPage
        serviceTitle="Mobile Number Consultation"
        price={581}
        matchTitles={["Mobile Number Consultation", "Mobile Compatibility"]}
        oldPrice={1100}
        description="Unlock the hidden vibration of your mobile number. Discover if your number aligns with your success, health, and prosperity."
        sampleReportImage={sampleReport.url}
        benefits={[
          "Detailed numerological breakdown of your current number",
          "Compatibility score with your Date of Birth",
          "Identification of 'Anti' or 'Lucky' combinations",
          "Practical remedies for number correction",
          "Personalized suggestions for new number combinations"
        ]}
      />
    </>
  );
};

export default MobileCompatibilityReport;
