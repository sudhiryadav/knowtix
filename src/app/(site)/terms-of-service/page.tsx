import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Knowtix - AI-Powered Document Conversations",
  description: "Read our terms of service and understand your rights and responsibilities when using Knowtix.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Breadcrumb
        pageName="Terms of Service"
        pageDescription="Read our terms of service"
      />
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Terms of Service</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Agreement to Terms</h3>
            <p>
              By accessing or using Knowtix, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h3>2. Use License</h3>
            <p>
              Permission is granted to temporarily use Knowtix for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on Knowtix</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h3>3. User Content</h3>
            <p>
              You retain all rights to any content you submit, post, or display on or through Knowtix. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
            </p>

            <h3>4. Disclaimer</h3>
            <p>
              The materials on Knowtix are provided on an &apos;as is&apos; basis. Knowtix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h3>5. Limitations</h3>
            <p>
              In no event shall Knowtix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Knowtix.
            </p>

            <h3>6. Revisions and Errata</h3>
            <p>
              The materials appearing on Knowtix could include technical, typographical, or photographic errors. Knowtix does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>

            <h3>7. Links</h3>
            <p>
              Knowtix has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Knowtix of the site.
            </p>

            <h3>8. Modifications</h3>
            <p>
              Knowtix may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h3>9. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 