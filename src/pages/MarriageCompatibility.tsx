import ServiceLandingPage from "@/components/ServiceLandingPage";

const MarriageCompatibility = () => {
  return (
    <ServiceLandingPage
      serviceTitle="Marriage Compatibility"
      price={2100}
      oldPrice={4200}
      description="Ensure a harmonious lifetime partnership. Our compatibility report analyzes the numerological alignment between two individuals for a successful marriage."
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