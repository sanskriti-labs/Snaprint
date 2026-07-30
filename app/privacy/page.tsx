import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Snaprint collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="30 July 2026">
      <h2>1. Who we are</h2>
      <p>
        Snaprint (&ldquo;Snaprint&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a product of Sanskriti Labs,
        based in Bengaluru, India. Snaprint sells and installs Snaprint S1 print kiosks to independent
        shop owners across India. This policy explains what information we collect through{" "}
        <strong>snaprints.com</strong> and our franchise/sales process, and how it is handled under the
        Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;).
      </p>

      <h2>2. What Snaprint does</h2>
      <p>
        Snaprint is print-kiosk hardware and software sold to shop owners, who own the machine and use
        it to serve their own customers. This website is informational and used to reach prospective
        shop owners &mdash; it does not process end-customer print jobs, payments, or uploaded documents.
      </p>

      <h2>3. Information we collect</h2>
      <p><strong>What we do not collect on this site:</strong></p>
      <ul>
        <li>No accounts, passwords, or user profiles</li>
        <li>No payment information (payments for kiosks are handled separately, via agreement, not through this website)</li>
        <li>No uploaded documents or print jobs (that happens on the physical kiosk at your shop, not this site)</li>
      </ul>
      <p><strong>Information you send us directly</strong></p>
      <p>
        If you email us, message us on WhatsApp, or submit the franchise/quote enquiry form, we
        collect what you provide &mdash; typically your name, phone number, email, shop location, and
        daily print volume. We use this only to respond to your enquiry and, if you proceed, to set up
        your Snaprint kiosk installation and agreement.
      </p>
      <p><strong>Analytics</strong></p>
      <p>
        We use Google Analytics to understand how visitors use this site (pages viewed, approximate
        location at city/country level, device type, referral source). Google Analytics uses cookies
        for this purpose &mdash; see the <a href="/refund-policy">Cookies</a> section below for details
        and opt-out instructions. We do not use this data to identify individual visitors.
      </p>

      <h2>4. Cookies</h2>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Opt out</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_ga</code>, <code>_ga_*</code></td>
            <td>Google Analytics &mdash; aggregate usage measurement</td>
            <td>Up to 2 years</td>
            <td><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a>, or block third-party cookies in your browser</td>
          </tr>
        </tbody>
      </table>
      <p>We do not use advertising cookies or cross-site tracking.</p>

      <h2>5. How we use your information</h2>
      <ul>
        <li>Responding to enquiries about franchise applications and quotes</li>
        <li>Scheduling site visits and kiosk installation</li>
        <li>Understanding and improving this website via aggregate analytics</li>
        <li>Meeting legal, tax, and regulatory obligations</li>
      </ul>
      <p>We do not sell your personal data to third parties, and we do not use it to train AI models.</p>

      <h2>6. Third parties we share data with</h2>
      <table>
        <thead>
          <tr><th>Party</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td>Vercel</td><td>Website hosting and content delivery</td></tr>
          <tr><td>Google Analytics</td><td>Aggregate website usage analytics</td></tr>
          <tr><td>WhatsApp / email</td><td>Direct communication if you contact us that way</td></tr>
        </tbody>
      </table>

      <h2>7. Data retention</h2>
      <ul>
        <li><strong>Enquiry/form data:</strong> retained while your enquiry or agreement is active, and for a reasonable period after for record-keeping and legal purposes</li>
        <li><strong>Analytics aggregates:</strong> retained per Google Analytics defaults (currently 14 months)</li>
        <li><strong>Server access logs:</strong> retained for up to 30 days for security and debugging</li>
      </ul>

      <h2>8. Your rights under the DPDP Act, 2023</h2>
      <p>As a Data Principal under the DPDP Act, you have the right to:</p>
      <ul>
        <li>Obtain a summary of the personal data we hold about you and how it is processed</li>
        <li>Request correction, completion, or updating of your personal data</li>
        <li>Request erasure of your personal data, once it is no longer needed for the purpose it was collected</li>
        <li>Withdraw consent at any time, as easily as you gave it</li>
        <li>Nominate another individual to exercise these rights on your behalf in the event of death or incapacity</li>
        <li>Register a grievance with us, and if unresolved, with the Data Protection Board of India</li>
      </ul>
      <p>To exercise any of these rights, email <a href="mailto:snaprints@sanskritilabs.in">snaprints@sanskritilabs.in</a>. We will respond within a reasonable time, and in any case within 30 days.</p>

      <h2>9. Children&rsquo;s data</h2>
      <p>
        Snaprint&rsquo;s website and franchise process are directed at adult shop owners and business
        enquiries. We do not knowingly collect personal data from individuals under 18. If you believe
        a child has submitted data to us, contact us and we will delete it.
      </p>

      <h2>10. Security</h2>
      <p>
        This site is served over HTTPS. We do not store payment credentials on this website. We take
        reasonable technical and organisational measures to protect the data we do hold, and will
        notify affected individuals and the Data Protection Board of India of any breach as required
        by law.
      </p>

      <h2>11. International transfers</h2>
      <p>
        Our website infrastructure (hosting, analytics) may process data outside India as part of
        standard cloud/CDN routing. We do not otherwise transfer your personal data outside India.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of
        this page reflects the most recent revision. Significant changes will be highlighted on this
        page.
      </p>

      <h2>13. Contact us</h2>
      <p>
        For any privacy questions or to exercise your rights, email{" "}
        <a href="mailto:snaprints@sanskritilabs.in">snaprints@sanskritilabs.in</a>.
      </p>
      <p>
        <em>
          This policy is provided as general guidance and has not been reviewed by a lawyer. For a
          business handling franchise agreements and payments, we recommend legal review before relying
          on it.
        </em>
      </p>
    </LegalPage>
  );
}
