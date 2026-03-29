import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const TermsAndConditions = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl prose prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 gold-text">Terms and Conditions</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using www.ankdarppan.com, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>

        <h2>2. Services</h2>
        <p>Ank Darppan provides numerology consultation services, personalized reports, and spiritual products. Our services are intended for informational and spiritual guidance purposes only and should not be considered as professional medical, legal, or financial advice.</p>

        <h2>3. User Responsibilities</h2>
        <ul>
          <li>Provide accurate personal information for consultations</li>
          <li>Use our services for lawful purposes only</li>
          <li>Not reproduce, distribute, or commercially exploit our content without permission</li>
        </ul>

        <h2>4. Payments</h2>
        <p>All payments are processed securely through Razorpay. Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</p>

        <h2>5. Intellectual Property</h2>
        <p>All content on this website, including text, images, logos, and reports, is the property of Ank Darppan and is protected by copyright laws. Unauthorized use is prohibited.</p>

        <h2>6. Disclaimer</h2>
        <p>Numerology is a spiritual and metaphysical practice. While we strive for accuracy, Ank Darppan does not guarantee specific outcomes. Results may vary based on individual circumstances.</p>

        <h2>7. Limitation of Liability</h2>
        <p>Ank Darppan shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services or products.</p>

        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in India.</p>

        <h2>9. Contact Us</h2>
        <p>For questions about these Terms, contact us at:</p>
        <p>Email: contactus@ankdarppan.com<br />Phone: +(91) 93173-65025</p>
      </div>
    </section>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default TermsAndConditions;
