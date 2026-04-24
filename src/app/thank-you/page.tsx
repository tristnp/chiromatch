import type { Metadata } from "next";
import Link from "next/link";
import { ActionBand } from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Match Request Received",
  description: "Your ChiropracticMatch request has been received.",
  path: "/thank-you"
});

export default function ThankYouPage() {
  return (
    <main>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="section-eyebrow">Request received</p>
          <h1 className="mt-4 text-[3.2rem] font-black leading-[0.96] tracking-[-0.03em] text-[#12203f] sm:text-[4.2rem]">
            You took the
            <span className="text-[#58b7dd]"> next step.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-[1.18rem] leading-8 text-[#536986]">
            Your request has been saved in the local demo lead store. In a production setup, this same flow can route to email, CRM, or database integrations.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="button-primary" href="/locations">
              Browse Cities
            </Link>
            <Link className="button-secondary" href="/">
              Back Home
            </Link>
          </div>
        </div>
      </section>
      <ActionBand primaryHref="/auto-accident-chiropractor" primaryLabel="Request Another Match" />
    </main>
  );
}
