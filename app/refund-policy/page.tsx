import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Snaprint's refund and cancellation policy for kiosk purchases.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicy() {
  return (
    <LegalPage title="Refund Policy" updated="30 July 2026">
      <h2>1. What this covers</h2>
      <p>
        This policy applies to purchase of the Snaprint S1 print kiosk, including hardware,
        pre-installed Snaprint OS, on-site installation, and included support, as agreed in your signed
        kiosk agreement. It does not cover general website use, which has no associated payment.
      </p>

      <h2>2. Before installation</h2>
      <p>
        If you have paid for a kiosk but installation has not yet taken place, you may cancel and
        request a full refund by writing to{" "}
        <a href="mailto:snaprints@sanskritilabs.in">snaprints@sanskritilabs.in</a>. Refunds in this stage are
        processed within 7&ndash;14 business days to your original payment method.
      </p>

      <h2>3. After installation</h2>
      <p>
        Because the kiosk is physical hardware installed on-site at your shop and configured for your
        use, the purchase is non-refundable once installation is complete, except as required by law or
        as set out below.
      </p>
      <p>Exceptions where a refund or repair/replacement applies after installation:</p>
      <ul>
        <li>The kiosk has a manufacturing defect covered under warranty and cannot be repaired or replaced within a reasonable time</li>
        <li>The kiosk delivered materially differs from what was agreed in your signed agreement</li>
        <li>Any other case required under the Consumer Protection Act, 2019</li>
      </ul>
      <p>
        In these cases, we will first attempt repair or replacement. If that is not possible within a
        reasonable time, we will refund the amount paid, pro-rated where partial use has already
        occurred, as set out in your signed agreement.
      </p>

      <h2>4. Cashback and promotional offers</h2>
      <p>
        Promotional terms (for example, founder cashback after a minimum print volume in the first
        month) are conditional on meeting the stated criteria within the stated period, as described at
        the time of your application and confirmed in your signed agreement. Cashback is forfeited if
        the conditions are not met and is not itself refundable or transferable.
      </p>

      <h2>5. What is not covered</h2>
      <ul>
        <li>Change of mind after installation</li>
        <li>Damage caused by misuse, unauthorized modification, or third-party repair</li>
        <li>Consumables (e.g., paper) supplied as part of the starter kit</li>
        <li>Loss of business or profit</li>
      </ul>

      <h2>6. How to request a refund or raise an issue</h2>
      <p>
        Email <a href="mailto:snaprints@sanskritilabs.in">snaprints@sanskritilabs.in</a> with your name, shop
        location, and a description of the issue. We aim to acknowledge requests within 2 business days
        and resolve them within 14 business days.
      </p>

      <h2>7. Governing law</h2>
      <p>
        This policy is governed by the laws of India, including the Consumer Protection Act, 2019, and
        is subject to the jurisdiction of the courts of Bengaluru, Karnataka.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date above reflects
        the most recent revision.
      </p>
      <p>
        <em>
          This policy is provided as general guidance and has not been reviewed by a lawyer. We
          recommend legal review before relying on it, particularly alongside your signed kiosk
          agreement.
        </em>
      </p>
    </LegalPage>
  );
}
