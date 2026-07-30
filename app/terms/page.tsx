import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Snaprint website.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="30 July 2026">
      <h2>1. Agreement</h2>
      <p>
        These Terms govern your use of <strong>snaprints.com</strong> (the &ldquo;Site&rdquo;), operated
        by Sanskriti Labs (&ldquo;Snaprint&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By visiting the
        Site or submitting an enquiry through it, you agree to these Terms and our{" "}
        <a href="/privacy">Privacy Policy</a>. If you do not agree, please do not use the Site.
      </p>

      <h2>2. What this Site is</h2>
      <p>
        The Site is informational. It describes the Snaprint S1 print kiosk and lets prospective shop
        owners enquire about the franchise/purchase process. The Site itself does not sell anything,
        process payments, or run print jobs.
      </p>

      <h2>3. The kiosk agreement is separate</h2>
      <p>
        If you proceed with a Snaprint S1 kiosk, the purchase, installation, support, and any cashback
        or promotional terms are governed by a separate signed agreement between you and Sanskriti Labs
        &mdash; not by these website Terms. These Terms apply only to your use of the Site itself. In
        case of conflict between these Terms and a signed kiosk agreement, the signed agreement
        controls for matters it covers.
      </p>

      <h2>4. Eligibility</h2>
      <p>
        The Site is intended for business enquiries from individuals aged 18 or older, operating or
        planning to operate a shop or business in India. By using the Site, you confirm you meet this
        requirement.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Scrape, crawl, or automate access to the Site beyond normal browsing</li>
        <li>Attempt to bypass security measures or access non-public areas of the Site</li>
        <li>Submit false or misleading information in an enquiry or franchise application</li>
        <li>Use the Site for any unlawful purpose</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        The Site, including its design, text, graphics, logos, and the Snaprint name and marks, is
        owned by Sanskriti Labs and protected by applicable intellectual property laws. You may not
        copy, reproduce, or use it for commercial purposes without our written permission.
      </p>

      <h2>7. No warranty on Site content</h2>
      <p>
        Site content (specifications, pricing indications, testimonials) is provided for general
        information and is subject to change. It does not constitute a binding offer. Final pricing,
        specifications, and terms for any kiosk are set out in your signed agreement.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent permitted by law, Sanskriti Labs is not liable for any indirect, incidental, or
        consequential loss arising from your use of the Site. Nothing in these Terms limits liability
        that cannot be excluded under Indian law.
      </p>

      <h2>9. Third-party links</h2>
      <p>
        The Site may link to third parties (e.g., WhatsApp, email). We are not responsible for the
        content or practices of third-party services.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute arising from these Terms or your use
        of the Site is subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date above reflects
        the most recent revision. Continued use of the Site after changes means you accept the updated
        Terms.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:snaprints@sanskritilabs.in">snaprints@sanskritilabs.in</a>.
      </p>
      <p>
        <em>
          These Terms are provided as general guidance and have not been reviewed by a lawyer. We
          recommend legal review before relying on them, particularly alongside your signed kiosk
          agreement.
        </em>
      </p>
    </LegalPage>
  );
}
