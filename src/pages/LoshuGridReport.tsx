import ServiceLandingPage from "@/components/ServiceLandingPage";

const LoshuGridReport = () => {
  return (
    <ServiceLandingPage
      serviceTitle="Loshu Grid Report"
      price={2100}
      oldPrice={4500}
      description="Unlock the ancient secrets of the Loshu Grid. This report provides a complete analysis of your birth chart using Chinese numerology principles."
      benefits={[
        "Complete 3x3 Loshu Grid analysis",
        "Missing number remedies",
        "Impact of repeated numbers",
        "Success and career directions",
        "Health and relationship insights",
        "Personalized corrective measures"
      ]}
    />
  );
};

export default LoshuGridReport;