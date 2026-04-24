import type { Metadata } from "next";
import { ActionBand } from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How ChiropracticMatch handles lead request information.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-white py-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Privacy</p>
          <h1 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.8rem]">
            How ChiropracticMatch handles your information
          </h1>
          <div className="surface-card mt-10 grid gap-6 p-8 text-[1.08rem] leading-8 text-[#536986]">
            <p>
              ChiropracticMatch collects the information you submit through the match request form so your request can be reviewed, stored, and routed in a future production workflow.
            </p>
            <p>
              Demo submissions are saved locally in this project environment. A production version should connect to approved storage, email, CRM, consent, retention, and access control systems.
            </p>
            <p>
              Do not submit emergency medical information. If you may have a medical emergency, call 911 or seek immediate medical care.
            </p>
          </div>
        </article>
      </section>
      <ActionBand primaryHref="/auto-accident-chiropractor" primaryLabel="Request a Match" />
    </main>
  );
}
