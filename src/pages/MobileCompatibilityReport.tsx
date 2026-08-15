import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import sampleReport from "@/assets/mobile-sample.jpg.asset.json";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MobileCompatibilityReport = () => {
  const [mobile, setMobile] = useState("");

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
        extraHeroFields={
          <div className="text-left">
            <Label htmlFor="hero-mobile" className="text-sm font-semibold ml-1 text-stone-900">Mobile Number to Analyze</Label>
            <Input 
              id="hero-mobile"
              type="tel"
              placeholder="Enter mobile number" 
              className="bg-[#fdfbf7] border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-primary"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
        }
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
