import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Knowtix - AI-Powered Document Conversations",
  description: "Learn about how Knowtix protects your privacy and handles your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb
        pageName="Privacy Policy"
        pageDescription="Learn about how we protect your privacy"
      />
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Privacy Policy</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Introduction</h3>
            <p>
              At Knowtix, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>

            <h3>2. Information We Collect</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information (name, email address)</li>
              <li>Documents you upload to our platform</li>
              <li>Usage data and analytics</li>
              <li>Communication preferences</li>
            </ul>

            <h3>3. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process your transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Improve our service and develop new features</li>
            </ul>

            <h3>4. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h3>5. Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>

            <h3>6. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@knowtix.com
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 