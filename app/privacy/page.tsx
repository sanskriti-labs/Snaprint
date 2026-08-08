import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Snaprint collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="8 August 2026">
      <h2>1. Who we are</h2>
      <p>
        Snaprint (&ldquo;Snaprint&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a product of Sanskriti Labs,
        based in Bengaluru, India. Snaprint sells and installs Snaprint S1 print kiosks to independent
        shop owners across India. This policy explains what information we collect through{" "}
        <strong>snaprints.com</strong> and our franchise/sales process, what information the Snaprint S1
        kiosk itself collects from the shop owner&rsquo;s end customers, and how both are handled under
        the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;).
      </p>

      <h2>2. What Snaprint does</h2>
      <p>
        Snaprint is print-kiosk hardware and software sold to shop owners, who own the machine and use
        it to serve their own customers (&ldquo;end customers&rdquo;). This website is informational and
        used to reach prospective shop owners &mdash; it does not itself process end-customer print jobs,
        payments, or uploaded documents. The kiosk software does, and is covered separately in{" "}
        <a href="#kiosk-data">Section 3B</a> below.
      </p>

      <h2>3. Information we collect</h2>
      <p><strong>What we do not collect on this site:</strong></p>
      <ul>
        <li>No accounts, passwords, or user profiles</li>
        <li>No payment information (payments for kiosks are handled separately, via agreement, not through this website)</li>
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

      <h2 id="kiosk-data">3B. Information the Snaprint S1 kiosk collects from end customers</h2>
      <p>
        This section covers data handled by the kiosk itself &mdash; the physical device installed at a
        shop &mdash; not this website. It applies to end customers who scan a kiosk&rsquo;s QR code to
        print a document, not to shop owners or website visitors.
      </p>
      <p><strong>What the kiosk collects</strong></p>
      <ul>
        <li>
          <strong>The uploaded file</strong> (PDF, JPG, or PNG) you send to the kiosk to print, along with
          job details such as page count, copies, and print options.
        </li>
        <li>
          <strong>Your phone number</strong>, captured and OTP-verified at the time of payment for a print
          job. This is not collected for uploads that are never paid for.
        </li>
      </ul>
      <p><strong>Why we keep it</strong></p>
      <p>
        A print job you have paid for but not yet printed must remain available so you (or the shop
        owner, on your behalf) can print it later. Once a job is completed, we keep the file and your
        phone number for a limited window afterward &mdash; rather than deleting them immediately &mdash;
        because a shop owner may be legally required to produce the file or identify who submitted it if
        a law enforcement or other authority raises a concern about a specific print (for example, a
        complaint that a print job involved unlawful content). We do not otherwise access, review, or use
        your file or phone number.
      </p>
      <p><strong>How long we keep it</strong></p>
      <p>
        Both the uploaded file and the job record (including your phone number, if collected) are
        automatically deleted <strong>30 days</strong> after the job reaches a final state (printed,
        cancelled, or expired unpaid). Uploads that are never paid for and never completed are cleared
        out much sooner, typically within 10&ndash;15 minutes of being abandoned.
      </p>
      <p><strong>Who can access it</strong></p>
      <p>
        The shop owner operating the kiosk can view job history, including your phone number if payment
        was completed, through their own kiosk dashboard &mdash; this is how they locate and reprint a
        paid job, or respond to an authority&rsquo;s request. We do not sell, share, or otherwise use this
        data for marketing, analytics, or any purpose beyond printing your job and the retention purpose
        described above.
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
        <li><strong>Kiosk end-customer files and phone numbers:</strong> retained for 30 days after a print job reaches a final state, then automatically deleted &mdash; see <a href="#kiosk-data">Section 3B</a></li>
        <li><strong>Unpaid, abandoned kiosk uploads:</strong> deleted within 10&ndash;15 minutes</li>
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
      <p>
        Note on kiosk data: an erasure request for an uploaded file or phone number covered by{" "}
        <a href="#kiosk-data">Section 3B</a> may be delayed until the retention window described there
        ends, where the shop owner is required to keep the record to respond to a pending or reasonably
        anticipated legal or authority request.
      </p>

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
