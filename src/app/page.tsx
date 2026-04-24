import type { Metadata } from "next";
import {
  ActionBand,
  ComparisonSection,
  FaqSection,
  Hero,
  HowItWorks,
  NetworkSection,
  ReviewsSection
} from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ChiropracticMatch | Find an Auto Accident Chiropractor",
  description:
    "Request a fast chiropractor match after a car accident. ChiropracticMatch helps accident victims find a clearer next step across the US.",
  path: "/"
});

const homeFaqs = [
  {
    question: "Is ChiropracticMatch a chiropractor office?",
    answer:
      "No. ChiropracticMatch is a matching platform that helps you start with the right kind of chiropractor after an accident."
  },
  {
    question: "How much does it cost to request a match?",
    answer:
      "Nothing. The match request is free. If you move forward with an office, they can explain appointment, billing, and insurance details directly."
  },
  {
    question: "Can I use ChiropracticMatch if I am still sorting out insurance details?",
    answer:
      "Yes. Many people start by getting pointed toward the right kind of office first, then handle claim-specific questions with that office."
  },
  {
    question: "Do I need to know exactly what injury I have before using the form?",
    answer:
      "No. Share what you are feeling right now, even if it is just soreness, headaches, stiffness, or limited movement after the collision."
  }
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <NetworkSection />
      <ComparisonSection />
      <ReviewsSection description="Thousands of accident victims want the same thing: a calmer, faster path to care. ChiropracticMatch is built around that moment." />
      <FaqSection faqs={homeFaqs} description="Everything you need to know about getting started after an auto accident." />
      <ActionBand />
    </main>
  );
}
