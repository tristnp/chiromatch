import type { Metadata } from "next";
import { ActionBand } from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms for using ChiropracticMatch.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <main>
      <section className="bg-white py-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Terms</p>
          <h1 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.8rem]">
            Terms for using ChiropracticMatch
          </h1>
          <div className="surface-card mt-10 grid gap-6 p-8 text-[1.08rem] leading-8 text-[#536986]">
            <p>
              ChiropracticMatch is a lead generation and matching website. It is not a healthcare provider, law firm, insurer, or emergency service.
            </p>
            <p>
              Submitting a request does not create a doctor-patient relationship. Any clinical, billing, insurance, or care questions should be discussed directly with the matched office.
            </p>
            <p>
              Site content is informational and should not be treated as medical advice. Always seek professional guidance for your specific situation.
            </p>
          </div>
        </article>
      </section>
      <ActionBand primaryHref="/auto-accident-chiropractor" primaryLabel="Start With a Match" />
    </main>
  );
}
