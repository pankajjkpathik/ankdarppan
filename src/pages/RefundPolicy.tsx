import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const RefundPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl prose prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 gold-text">Refund and Returns Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <h2>1. Digital Services (Consultations & Reports)</h2>
        <p>Since numerology consultations and reports are personalized digital services prepared specifically for you, <strong>refunds are not applicable</strong> once the service has been delivered or work has commenced.</p>
        <p>If you have not received your report within the promised timeframe, please contact us and we will resolve the issue promptly.</p>

        <h2>2. Physical Products (Crystals, Rudraksha, Gemstones)</h2>
        <ul>
          <li><strong>Returns:</strong> Products can be returned within 7 days of delivery if they are unused, undamaged, and in their original packaging.</li>
          <li><strong>Damaged/Defective Items:</strong> If you receive a damaged or defective product, contact us within 48 hours of delivery with photos for a replacement or refund.</li>
          <li><strong>Return Shipping:</strong> Return shipping costs are borne by the customer unless the item was damaged or incorrect.</li>
        </ul>

        <h2>3. Refund Process</h2>
        <p>Approved refunds will be processed within 7-10 business days via the original payment method (Razorpay).</p>

        <h2>4. Cancellations</h2>
        <p>Orders can be cancelled before processing/shipping. Once a consultation is scheduled or a product is shipped, cancellation is not possible.</p>

        <h2>5. Contact Us</h2>
        <p>For refund or return requests, please contact us at:</p>
        <p>Email: contactus@ankdarppan.com<br />Phone: +(91) 93173-65025<br />WhatsApp: +(91) 93173-65025</p>
      </div>
    </section>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default RefundPolicy;
