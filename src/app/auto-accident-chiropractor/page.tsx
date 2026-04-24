import type { Metadata } from "next";
import {
  ActionBand,
  CityGridSection,
  ComparisonSection,
  FaqSection,
  ReviewsSection,
  ServiceHero,
  HowItWorks
} from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Auto Accident Chiropractor Matching",
  description:
    "Find a chiropractor after an auto accident. ChiropracticMatch helps you start with the right office for neck pain, back stiffness, headaches, and whiplash symptoms.",
  path: "/auto-accident-chiropractor"
});

const serviceFaqs = [
  {
    question: "What does an auto accident chiropractor actually help with?",
    answer:
      "A chiropractor can discuss pain, stiffness, headaches, whiplash symptoms, reduced range of motion, and the practical next steps after a crash."
  },
  {
    question: "Should I wait to see if the pain goes away on its own?",
    answer:
      "Many people notice symptoms later rather than immediately. Starting the conversation sooner can make the next steps feel easier and less confusing."
  },
  {
    question: "Can ChiropracticMatch help if I am still deciding what kind of provider I need?",
    answer:
      "Yes. That is one of the main reasons people use the service. It gives you a practical place to begin instead of calling around blindly."
  },
  {
    question: "Can I call instead of filling out the form?",
    answer: "Yes. If you want to talk to someone first, call (916) 305-2631."
  }
];

export default function AutoAccidentChiropractorPage() {
  return (
    <main>
      <ServiceHero />
      <HowItWorks description="We've removed every obstacle between your accident and the first useful next step." />
      <ComparisonSection
        title="Before & After ChiropracticMatch"
        description="How the process feels when you are doing all the searching yourself versus starting in one place."
      />
      <ReviewsSection
        title="Real patients, real results"
        description="People use ChiropracticMatch because they want less confusion, less delay, and a clearer start after the crash."
      />
      <CityGridSection
        title="Find care in your city"
        description="Start from a city landing page if you want a more local path into the matching process."
        linkLabel="Browse all city pages"
      />
      <FaqSection faqs={serviceFaqs} description="Common questions about getting chiropractic care after an auto accident." />
      <ActionBand
        title="Don't wait on your recovery."
        accentLine="Get matched today."
        primaryHref="#service-form"
        primaryLabel="Request Match — Free & Instant"
      />
    </main>
  );
}
