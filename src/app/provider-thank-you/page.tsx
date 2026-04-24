import type { Metadata } from "next";
import Link from "next/link";
import { ActionBand } from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Provider Application Received",
  description: "Your ChiropracticMatch provider application has been received.",
  path: "/provider-thank-you"
});

export default function ProviderThankYouPage() {
  return (
    <main>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="section-eyebrow">Application received</p>
          <h1 className="mt-4 text-[3.2rem] font-black leading-[0.96] tracking-[-0.03em] text-[#12203f] sm:text-[4.2rem]">
            Thanks for applying to
            <span className="text-[#58b7dd]"> ChiropracticMatch.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-[1.18rem] leading-8 text-[#536986]">
            Your provider application has been saved in the local demo store. The next step is review of your practice details, license information, service area, and accident-care fit.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="button-secondary" href="/">
              Back Home
            </Link>
            <Link className="button-secondary" href="/for-chiropractors">
              Provider Page
            </Link>
          </div>
        </div>
      </section>

      <ActionBand
        title="We review every practice"
        accentLine="before activation."
        description="That keeps the network focused on providers who are ready to support auto accident patients with care, communication, and follow-up."
        primaryHref="/for-chiropractors"
        primaryLabel="Back to Provider Page"
      />
    </main>
  );
}
