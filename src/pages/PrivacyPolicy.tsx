import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl prose prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 gold-text">Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <h2>1. Information We Collect</h2>
        <p>At Ank Darppan, we collect personal information you voluntarily provide, including your name, email address, phone number, date of birth, and payment information when you use our services or make purchases.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide personalized numerology consultations and reports</li>
          <li>To process orders and payments via Razorpay</li>
          <li>To communicate with you about your orders and services</li>
          <li>To improve our website and services</li>
          <li>To send relevant updates (only with your consent)</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or share your personal data with third parties except as required to process payments (Razorpay) or as required by law.</p>

        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

        <h2>5. Cookies</h2>
        <p>Our website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. Contact us at contactus@ankdarppan.com for any requests.</p>

        <h2>7. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at:</p>
        <p>Email: contactus@ankdarppan.com<br />Phone: +(91) 93173-65025</p>
      </div>
    </section>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default PrivacyPolicy;
