import ServiceLandingPage from "@/components/ServiceLandingPage";
import SEO from "@/components/SEO";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const sampleReport = { url: "/marriage-report-v2.png" };

const MarriageCompatibility = () => {
  const [partnerName, setPartnerName] = useState("");
  const [partnerDob, setPartnerDob] = useState("");

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
        extraHeroFields={
          <div className="space-y-4">
            <div className="text-left">
              <Label htmlFor="partner-name" className="text-sm font-semibold ml-1 text-stone-900">Partner's Name</Label>
              <Input 
                id="partner-name"
                placeholder="Partner's full name" 
                className="bg-[#fdfbf7] border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-primary"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
              />
            </div>
            <div className="text-left">
              <Label htmlFor="partner-dob" className="text-sm font-semibold ml-1 text-stone-900">Partner's DOB (DD/MM/YYYY)</Label>
              <Input 
                id="partner-dob"
                placeholder="DD/MM/YYYY" 
                className="bg-[#fdfbf7] border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-primary"
                value={partnerDob}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 8) val = val.slice(0, 8);
                  if (val.length > 4) val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
                  else if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                  setPartnerDob(val);
                }}
                required
              />
            </div>
          </div>
        }
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