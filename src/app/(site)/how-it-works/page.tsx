import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Knowtix - AI-Powered Document Conversations",
  description: "Learn how Knowtix uses AI to transform your documents into interactive conversations.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumb
        pageName="How It Works"
        pageDescription="Learn how Knowtix transforms your documents into interactive conversations"
      />
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <h2 className="mb-8 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
                How Knowtix Works
              </h2>
              <p className="mb-8 text-base !leading-relaxed text-body-color md:text-lg">
                Knowtix uses advanced AI technology to transform your documents into interactive conversations. Here's how it works:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
                      Upload Your Documents
                    </h3>
                    <p className="text-base text-body-color">
                      Upload your PDFs, Word documents, or text files to our secure platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
                      AI Processing
                    </h3>
                    <p className="text-base text-body-color">
                      Our AI analyzes your documents and creates an interactive knowledge base.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
                      Interactive Conversations
                    </h3>
                    <p className="text-base text-body-color">
                      Users can now ask questions and get instant, accurate answers from your documents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0">
                <img
                  src="/images/how-it-works.svg"
                  alt="How Knowtix Works"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 