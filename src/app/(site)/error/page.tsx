import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page | Play SaaS Starter Kit and Boilerplate for Next.js",
};

const ErrorPage = () => {
  return (
    <>
      <Breadcrumb pageName="404 Page" />

      <section className="bg-white py-20 dark:bg-dark-2 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 md:w-5/12 lg:w-6/12">
              <div className="relative mx-auto aspect-[129/138] max-w-[357px] text-center">
                <div className="text-9xl font-bold text-primary">404</div>
              </div>
            </div>
            <div className="w-full px-4 md:w-7/12 lg:w-6/12 xl:w-5/12">
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-dark dark:text-white">
                    Page Not Found
                  </h2>
                </div>
                <h3 className="mb-5 text-2xl font-semibold text-dark dark:text-white">
                  We Can&#39;t Seem to Find The Page You&#39;re Looking For.
                </h3>
                <p className="mb-8 text-base text-body-color dark:text-dark-6">
                  Oops! The page you are looking for does not exist. It might have
                  been moved or deleted.
                </p>
                <Link
                  href="/"
                  className="rounded-md bg-dark px-7 py-3 text-base font-medium text-white transition hover:bg-primary dark:bg-primary dark:hover:bg-primary/80"
                >
                  Go To Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorPage;
