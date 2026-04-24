import type { Metadata } from "next";
import Link from "next/link";
import { ActionBand, FaqSection, HowItWorks } from "@/components/Sections";
import { ProviderApplicationForm } from "@/components/ProviderApplicationForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Join the ChiropracticMatch Network",
  description:
    "Apply to join ChiropracticMatch and receive pre-screened auto accident patient inquiries in your service area.",
  path: "/for-chiropractors"
});

const benefitCards = [
  {
    title: "Pre-screened patient inquiries",
    text:
      "ChiropracticMatch is built around people who say they were in an auto accident and are actively looking for a chiropractor."
  },
  {
    title: "Built for accident-focused offices",
    text:
      "The intake flow asks about crash timing, injury concerns, location, and contact preferences so your team can start with useful context."
  },
  {
    title: "Flexible market preferences",
    text:
      "Tell us your service area, lead volume goals, and the types of accident cases your office is best prepared to handle."
  },
  {
    title: "No cold directory traffic",
    text:
      "This is not a general directory listing. The goal is to route active patient inquiries to practices that are ready to respond."
  }
];

const providerFaqs = [
  {
    question: "How quickly can my practice start receiving inquiries?",
    answer:
      "After you apply, the ChiropracticMatch team reviews your market, license details, malpractice insurance status, and accident-care fit before activating lead delivery."
  },
  {
    question: "Are patient inquiries exclusive to my practice?",
    answer:
      "Market routing depends on coverage, availability, and patient location. The provider team will explain how your territory and preferences work during onboarding."
  },
  {
    question: "What if a patient does not answer or does not book?",
    answer:
      "The v1 application flow is focused on provider qualification. Lead delivery rules, replacement policies, and billing terms should be finalized during onboarding before launch."
  },
  {
    question: "Do I need to handle auto accident billing myself?",
    answer:
      "Your practice should be comfortable discussing accident-related care and documentation. The application asks about your experience so the network can route inquiries responsibly."
  }
];

const providerSteps = [
  {
    number: "01",
    title: "Apply and get reviewed",
    text:
      "Submit your practice details, license information, malpractice insurance status, and accident-care experience for review."
  },
  {
    number: "02",
    title: "Set market preferences",
    text:
      "Choose the cities you serve, your desired lead volume, and the types of patient inquiries your office is ready to handle."
  },
  {
    number: "03",
    title: "Receive qualified inquiries",
    text:
      "Once approved, patient inquiries can be routed to your team with the contact details and injury context needed for fast follow-up."
  }
];

export default function ForChiropractorsPage() {
  return (
    <main>
      <section className="bg-[#182a58] py-10 text-white sm:py-12 lg:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_500px]">
          <div className="motion-fade-up pt-1 lg:pt-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#58b7dd]/40 bg-[#58b7dd]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-[#58b7dd]">
              <span className="accent-dot" />
              For chiropractors
            </div>
            <h1 className="mt-6 max-w-3xl text-[2.85rem] font-black leading-[0.95] tracking-[-0.04em] sm:text-[3.8rem] lg:text-[4.15rem] xl:text-[4.55rem]">
              Grow your practice with
              <span className="text-[#58b7dd]"> qualified auto accident leads.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[1.13rem] leading-[1.7] text-[#c2d1e8]">
              Join ChiropracticMatch and receive pre-screened auto accident patient inquiries from people actively looking for care in your area.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href="#provider-application">
                Apply to Join Our Network
              </Link>
            </div>

            <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
              <ProviderMetric value="Screened" label="patient inquiries" />
              <ProviderMetric value="Real-time" label="delivery options" />
              <ProviderMetric value="Flexible" label="market preferences" />
            </div>
          </div>

          <ProviderApplicationForm />
        </div>
      </section>

      <section className="motion-fade bg-[#f7fbff] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Why ChiropracticMatch</p>
            <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.6rem]">
              Built specifically for auto accident specialists
            </h2>
            <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">
              ChiropracticMatch is not a general directory. It is a matching flow for accident victims who need a clearer path into care.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {benefitCards.map((benefit) => (
              <article key={benefit.title} className="surface-card motion-fade-up grid gap-5 p-7 sm:grid-cols-[56px_1fr]">
                <div className="flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#edf8fd] text-[#58b7dd]">
                  <IconCheck />
                </div>
                <div>
                  <h3 className="text-[1.45rem] font-black tracking-[-0.03em] text-[#12203f]">{benefit.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-[#536986]">{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks
        title="Start receiving patient inquiries in 3 steps"
        description="Getting set up starts with one application. We review provider fit before routing patient inquiries."
        steps={providerSteps}
      />

      <section className="motion-fade bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="section-eyebrow">Network fit</p>
            <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.5rem]">
              A better fit than cold directory traffic
            </h2>
            <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">
              The network is designed for practices that can respond quickly, understand accident-related intake, and want clearer patient context from the start.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {["Accident-focused intake", "Service-area routing", "Volume preferences", "Review before activation"].map((item) => (
              <div key={item} className="surface-card motion-fade-up p-6">
                <p className="text-[1.55rem] font-black tracking-[-0.03em] text-[#12203f]">{item}</p>
                <p className="mt-3 text-base leading-7 text-[#7a90aa]">
                  Provider applications help match patient demand with office capability before inquiries are delivered.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        faqs={providerFaqs}
        title="Questions from providers"
        description="Everything you need to know before applying to join the network."
      />

      <ActionBand
        title="Ready to fill your schedule"
        accentLine="with qualified patients?"
        description="Apply to join the ChiropracticMatch network and tell us where your practice can help auto accident patients."
        primaryHref="#provider-application"
        primaryLabel="Apply to Join Our Network"
      />
    </main>
  );
}

function ProviderMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[1.2rem] font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#9fb4d1]">{label}</p>
    </div>
  );
}

function IconCheck() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 20 20" fill="none">
      <path d="M4.5 10.5L8.1 14L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
