import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Knowtix - AI-Powered Document Conversations",
  description: "Learn about our refund policy and how we handle subscription cancellations.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Breadcrumb
        pageName="Refund Policy"
        pageDescription="Learn about our refund policy"
      />
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Refund Policy</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Subscription Cancellation</h3>
            <p>
              You may cancel your subscription at any time. Upon cancellation, you will continue to have access to the service until the end of your current billing period.
            </p>

            <h3>2. Refund Eligibility</h3>
            <p>
              We offer refunds under the following circumstances:
            </p>
            <ul>
              <li>Technical issues preventing service usage</li>
              <li>Billing errors or duplicate charges</li>
              <li>Service unavailability for extended periods</li>
            </ul>

            <h3>3. Refund Process</h3>
            <p>
              To request a refund:
            </p>
            <ol>
              <li>Contact our support team at support@knowtix.com</li>
              <li>Provide your account details and reason for refund</li>
              <li>Allow up to 5 business days for review</li>
              <li>If approved, refund will be processed to original payment method</li>
            </ol>

            <h3>4. Non-Refundable Items</h3>
            <p>
              The following are not eligible for refunds:
            </p>
            <ul>
              <li>Usage of service during the billing period</li>
              <li>Custom development or integration services</li>
              <li>Training or consultation services</li>
            </ul>

            <h3>5. Partial Refunds</h3>
            <p>
              In some cases, we may offer partial refunds based on:
            </p>
            <ul>
              <li>Length of service usage</li>
              <li>Nature of the issue</li>
              <li>Impact on your business</li>
            </ul>

            <h3>6. Contact Us</h3>
            <p>
              If you have any questions about our refund policy, please contact us at:
              <br />
              Email: support@knowtix.com
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 