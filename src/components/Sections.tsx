import type { ReactNode } from "react";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { NationwideCoverageMap } from "@/components/NationwideCoverageMap";
import { cities, getCitiesByState, getCityBrowseDescription, getCityBrowseLabel, getCityPagePath } from "../../lib/cities";
import { getAreaPath, getStatePath, states, type LocationArea, type LocationState } from "@/lib/locations";

const featuredCities = cities.slice(0, 8);

const sharedReviews = [
  {
    initials: "MR",
    name: "Maria R.",
    detail: "Sacramento, CA · Whiplash injury",
    quote:
      "I was rear-ended on the freeway and had no idea where to start. The process was quick, clear, and I had an appointment lined up right away."
  },
  {
    initials: "DT",
    name: "David T.",
    detail: "Houston, TX · Back & neck pain",
    quote:
      "I wanted one place to start. ChiropracticMatch helped me stop bouncing between offices and get pointed in the right direction."
  },
  {
    initials: "KL",
    name: "Kayla L.",
    detail: "Seattle, WA · Post-collision soreness",
    quote:
      "I tried calling around on my own and kept getting stuck. This felt calmer, faster, and much easier to trust."
  }
];

const sharedFaqs = [
  {
    question: "Will my insurance cover chiropractic care after a car accident?",
    answer:
      "Coverage depends on your policy and claim details, but matched offices can explain how they typically handle accident-related billing and documentation."
  },
  {
    question: "Do I need a doctor's referral or police report first?",
    answer:
      "Not always. You can start the matching process first, then speak directly with the office about what paperwork is helpful for your situation."
  },
  {
    question: "What does the free service mean?",
    answer:
      "ChiropracticMatch does not charge you to request a match. The purpose is to help you quickly connect with a chiropractor who understands auto accident injuries."
  },
  {
    question: "How soon should I see a chiropractor after a crash?",
    answer:
      "Many people reach out as soon as soreness, headaches, stiffness, or reduced range of motion begin. Earlier conversations can make the next steps feel clearer."
  }
];

type HeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  stats: { label: string; value: string }[];
  pageSource: string;
  formHeading?: string;
};

type Step = {
  number: string;
  title: string;
  text: string;
};

export function Hero() {
  return (
    <LandingHero
      eyebrow="Free for auto accident victims"
      title={
        <>
          Find a chiropractor
          <br />
          after a car accident
          <br />
          <span className="text-[#58b7dd]">without the runaround.</span>
        </>
      }
      description="We match you with a licensed chiropractor in your area who specializes in auto accident injuries and helps you take the next step fast."
      primaryLabel="Request Match"
      primaryHref="#match-form"
      secondaryLabel="Browse Locations"
      secondaryHref="/locations"
      pageSource="homepage"
      formHeading="Request Your Free Match"
      stats={[
        { value: "50", label: "states covered" },
        { value: String(cities.length), label: "city pages live" },
        { value: "Fast", label: "next-step routing" }
      ]}
    />
  );
}

export function ServiceHero() {
  return (
    <LandingHero
      eyebrow="Auto accident chiropractor matching"
      title={
        <>
          Find care after your
          <br />
          accident
          <span className="text-[#58b7dd]"> and get moving again.</span>
        </>
      }
      description="We remove the guesswork between your injury and your first appointment by helping you start with the right kind of chiropractor."
      primaryLabel="Request Match"
      primaryHref="#service-form"
      secondaryLabel="Browse Cities"
      secondaryHref="/locations"
      pageSource="service:auto-accident-chiropractor"
      formHeading="Request Your Free Match"
      stats={[
        { value: "No cost", label: "to request a match" },
        { value: String(cities.length), label: "city pages live" },
        { value: "(916)", label: "305-2631 to call" }
      ]}
    />
  );
}

export function LandingHero({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  stats,
  pageSource,
  formHeading
}: HeroProps) {
  return (
    <section className="motion-fade bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_470px] lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="trust-pill">
            <span className="accent-dot" />
            {eyebrow}
          </div>
          <h1 className="mt-8 max-w-3xl text-[3.1rem] font-black leading-[0.94] tracking-[-0.03em] text-[#12203f] sm:text-[4.35rem]">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-[1.2rem] leading-[1.75] text-[#536986]">{description}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="button-secondary" href={secondaryHref}>
              {secondaryLabel}
            </Link>
          </div>

          <div className="mt-10 grid gap-4 border-t border-[#e3edf7] pt-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[1.15rem] font-black text-[#12203f]">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div id={pageSource === "service:auto-accident-chiropractor" ? "service-form" : undefined}>
          <LeadForm pageSource={pageSource} heading={formHeading} />
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({
  title = "Recovery in 3 simple steps",
  description = "We've removed every obstacle between your injury and your first appointment.",
  steps
}: {
  title?: string;
  description?: string;
  steps?: Step[];
}) {
  const items =
    steps ??
    [
      {
        number: "01",
        title: "Tell us about your injury",
        text: "Fill out one simple form with your contact information and a short description of what happened."
      },
      {
        number: "02",
        title: "We find your best match",
        text: "We point you toward chiropractic care that understands auto accident injuries and next-step documentation."
      },
      {
        number: "03",
        title: "Book your appointment",
        text: "Move forward with a local office and start getting answers while the details of the crash are still fresh."
      }
    ];

  return (
    <section id="how-it-works" className="motion-fade bg-[#f7fbff] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-eyebrow">How it works</p>
          <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.7rem]">
            {title}
          </h2>
          <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">{description}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((step, index) => (
            <article
              key={step.title}
              className={`surface-card motion-fade-up relative overflow-hidden p-8 ${index === items.length - 1 ? "border-[#7fd1ee]" : ""}`}
            >
              <p className="text-[5.5rem] font-black leading-none tracking-[-0.06em] text-[#eaf6fc]">{step.number}</p>
              <div className="mt-3 flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#edf8fd] text-[#58b7dd]">
                <IconStep index={index} />
              </div>
              <h3 className="mt-8 text-[2rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">{step.title}</h3>
              <p className="mt-5 text-lg leading-8 text-[#536986]">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ComparisonSection({
  title = "Before & After ChiropracticMatch",
  description = "What the journey looks like without us, and with us.",
  withoutTitle = "Weeks of confusion, pain, and dead ends.",
  withTitle = "Matched in minutes. Better in weeks.",
  withoutItems,
  withItems
}: {
  title?: string;
  description?: string;
  withoutTitle?: string;
  withTitle?: string;
  withoutItems?: string[];
  withItems?: string[];
}) {
  const leftItems =
    withoutItems ??
    [
      'Searching Google for "chiropractor near me" with no idea who specializes in accidents',
      "Calling multiple offices before finding one that feels like a fit",
      "Waiting too long to start because the next step feels unclear",
      "Trying to sort through billing and documentation questions alone"
    ];
  const rightItems =
    withItems ??
    [
      "Submit one simple form and start in one place",
      "Get matched with a chiropractor who understands accident-related care",
      "Move toward an appointment with less delay and less guesswork",
      "Start the conversation with more clarity about what comes next"
    ];

  return (
    <section className="motion-fade bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-eyebrow">Recovery story</p>
          <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.6rem]">{title}</h2>
          <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">{description}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="surface-card border-[#f3cfc7] bg-[#fff7f5] p-8">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e46b5b]">Without ChiropracticMatch</p>
            <h3 className="mt-6 text-[2rem] font-black leading-tight tracking-[-0.03em] text-[#7a2f28]">{withoutTitle}</h3>
            <ul className="mt-6 grid gap-4 text-lg leading-8 text-[#87463f]">
              {leftItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 text-[#ef6a5b]">
                    <IconX />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card border-[#c7e8f5] bg-[#f4fbff] p-8">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#58b7dd]">With ChiropracticMatch</p>
            <h3 className="mt-6 text-[2rem] font-black leading-tight tracking-[-0.03em] text-[#204c6c]">{withTitle}</h3>
            <ul className="mt-6 grid gap-4 text-lg leading-8 text-[#325b7a]">
              {rightItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 text-[#58b7dd]">
                    <IconCheck />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function NetworkSection() {
  return (
    <section className="network-section motion-fade">
      <div className="network-section__inner">
        <div className="network-section__content">
          <p className="section-eyebrow">Nationwide network</p>
          <h2 className="network-section__title">
            Chiropractors ready
            <br />
            in your city
          </h2>
          <p className="network-section__body">
            Our current city coverage spans all 50 states and {cities.length} city pages. From Sacramento to Miami, Seattle to New York, you can start in one place.
          </p>
          <p className="network-section__stats">50+ States · {cities.length}+ Cities · Free to Match</p>
        </div>

        <div className="network-section__grid-wrap motion-fade-up">
          <NationwideCoverageMap />

          <Link className="button-primary network-section__cta" href="/locations">
            Browse All Locations <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CityGridSection({
  title = "Find care in your city",
  description = "We keep location pages live across the US so you can start local and move quickly toward the right next step.",
  linkLabel = `View all ${cities.length}+ cities`
}: {
  title?: string;
  description?: string;
  linkLabel?: string;
}) {
  return (
    <section className="motion-fade bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-eyebrow">Browse locations</p>
          <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.6rem]">{title}</h2>
          <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">{description}</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredCities.map((city) => (
            <Link key={city.slug} href={getCityPagePath(city, "car-accident")} className="surface-card p-5">
              <p className="text-[1.25rem] font-black tracking-[-0.03em] text-[#12203f]">{getCityBrowseLabel(city)}</p>
              <p className="mt-3 text-base leading-7 text-[#7a90aa]">{getCityBrowseDescription(city)}</p>
            </Link>
          ))}
        </div>

        <Link className="mt-8 inline-flex text-lg font-black text-[#58b7dd]" href="/locations">
          {linkLabel} →
        </Link>
      </div>
    </section>
  );
}

export function ReviewsSection({
  title = "Real patients, real results",
  description = "People reach out because they want a faster, calmer way to start care after a crash.",
  reviews = sharedReviews
}: {
  title?: string;
  description?: string;
  reviews?: typeof sharedReviews;
}) {
  return (
    <section id="reviews" className="motion-fade bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-eyebrow">Patient reviews</p>
          <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.6rem]">{title}</h2>
          <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">{description}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={`${review.name}-${review.detail}`} className="surface-card p-8">
              <p className="text-[1.2rem] tracking-[0.18em] text-[#f2a638]">★★★★★</p>
              <p className="mt-6 text-[1.08rem] leading-8 text-[#536986]">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#58b7dd] text-sm font-black text-white">
                  {review.initials}
                </div>
                <div>
                  <p className="text-base font-black text-[#12203f]">{review.name}</p>
                  <p className="mt-1 text-sm text-[#7a90aa]">{review.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({
  faqs = sharedFaqs,
  title = "Common questions",
  description = "Everything you need to know about getting care after an auto accident."
}: {
  faqs?: { question: string; answer: string }[];
  title?: string;
  description?: string;
}) {
  return (
    <section className="motion-fade bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.6rem]">{title}</h2>
          <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">{description}</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <details key={faq.question} className={`surface-card motion-fade-up p-0 ${index % 2 ? "motion-delay-1" : ""}`}>
              <summary className="flex cursor-pointer items-start justify-between gap-4 p-6 text-left">
                <span className="text-[1.35rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">{faq.question}</span>
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#edf8fd] text-[#58b7dd]">
                  <IconPlus />
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-lg leading-8 text-[#536986]">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActionBand({
  title = "Don't wait on your recovery.",
  accentLine = "Get matched today.",
  description = "Every day without treatment can make recovery harder. Start in one place and move toward the right next step.",
  primaryHref = "#match-form",
  primaryLabel = "Request Match — Free & Instant"
}: {
  title?: string;
  accentLine?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="motion-fade bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[8px] bg-[#182a58] px-8 py-14 text-center text-white shadow-[0_24px_56px_rgba(18,32,63,0.18)] sm:px-14">
          <h2 className="text-[2.6rem] font-black leading-[1.02] tracking-[-0.04em] sm:text-[3.8rem]">
            {title}
            <br />
            <span className="text-[#58b7dd]">{accentLine}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-[1.08rem] leading-8 text-[#c2d1e8]">{description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="button-primary" href={primaryHref}>
              {primaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LocationIndex() {
  const citiesByState = cities.reduce<Record<string, typeof cities>>((groups, city) => {
    if (!groups[city.state]) {
      groups[city.state] = [];
    }

    groups[city.state].push(city);
    return groups;
  }, {});

  const orderedStates = Object.keys(citiesByState).sort((a, b) => a.localeCompare(b));

  return (
    <main className="bg-[#f7fbff]">
      <section className="motion-fade bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="locations-index__intro max-w-3xl">
            <p className="section-eyebrow">Browse locations</p>
            <h1 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[4rem]">
              Browse cities by state
            </h1>
            <p className="mt-6 text-[1.15rem] leading-8 text-[#536986]">
              Choose a state, open the dropdown, and see every live ChiropracticMatch city page for that market in one clean list.
            </p>
            <p className="mt-5 text-[0.98rem] font-semibold text-[#7a90aa]">
              Showing {orderedStates.length} states with {cities.length}+ city pages
            </p>
          </div>

          <div className="locations-state-grid mt-12">
            {orderedStates.map((stateName) => (
              <details key={stateName} className="locations-accordion surface-card p-0">
                <summary className="locations-accordion__summary">
                  <div className="locations-accordion__summary-copy">
                    <p className="locations-accordion__title">{stateName}</p>
                    <p className="locations-accordion__meta">{citiesByState[stateName].length} city pages</p>
                  </div>
                  <span className="locations-accordion__chevron">
                    <IconChevron />
                  </span>
                </summary>
                <div className="locations-accordion__panel">
                  <div className="locations-accordion__grid locations-accordion__grid--cities">
                    {citiesByState[stateName]
                    .slice()
                    .sort((a, b) => getCityBrowseLabel(a).localeCompare(getCityBrowseLabel(b)))
                    .map((city) => (
                      <Link
                        key={city.slug}
                        href={getCityPagePath(city, "car-accident")}
                        className="locations-accordion__item locations-accordion__item--city"
                      >
                        <span className="locations-accordion__item-title">{getCityBrowseLabel(city)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function StateTemplate({ state }: { state: LocationState }) {
  const stateCities = getCitiesByState(state.name).slice(0, 12);

  return (
    <main>
      <section className="motion-fade bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="trust-pill">
              <span className="accent-dot" />
              State directory
            </div>
            <h1 className="mt-8 text-[3rem] font-black leading-[0.96] tracking-[-0.03em] text-[#12203f] sm:text-[4rem]">
              Auto accident chiropractors in {state.name}
            </h1>
            <p className="mt-6 text-[1.15rem] leading-8 text-[#536986]">
              Browse local pages across {state.name} and start from the city or area that feels closest to your next step after a collision.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-card p-8">
              <h2 className="text-[2rem] font-black tracking-[-0.03em] text-[#12203f]">Local area pages</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {state.areas.map((area) => (
                  <Link key={area.slug} href={getAreaPath(area)} className="rounded-[8px] border border-[#dce7f4] px-4 py-4">
                    <p className="text-base font-black text-[#12203f]">{area.name}</p>
                    <p className="mt-1 text-sm text-[#7a90aa]">{area.zipCodes.slice(0, 2).join(" · ") || `${area.stateCode} market`}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-card p-8">
              <h2 className="text-[2rem] font-black tracking-[-0.03em] text-[#12203f]">Featured city pages</h2>
              <div className="mt-6 grid gap-3">
                {stateCities.length ? (
                  stateCities.map((city) => (
                    <Link key={city.slug} href={`/chiropractor-after-car-accident/${city.slug}`} className="rounded-[8px] border border-[#dce7f4] px-4 py-4">
                      <p className="text-base font-black text-[#12203f]">{getCityBrowseLabel(city)}</p>
                      <p className="mt-1 text-sm text-[#7a90aa]">{getCityBrowseDescription(city)}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-base leading-7 text-[#536986]">
                    State-specific city SEO pages are still expanding. Start with one of the local area pages above.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ActionBand
        title={`Need help finding care in ${state.name}?`}
        accentLine="Start with one local page."
        description={`Browse ${state.name} area pages or request a chiropractor match and let ChiropracticMatch help you find the right next step.`}
      />
    </main>
  );
}

export function AreaTemplate({ area }: { area: LocationArea }) {
  return (
    <main>
      <section className="motion-fade bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_470px] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="trust-pill">
              <span className="accent-dot" />
              {area.name}, {area.stateCode}
            </div>
            <h1 className="mt-8 max-w-3xl text-[3.1rem] font-black leading-[0.94] tracking-[-0.03em] text-[#12203f] sm:text-[4.15rem]">
              Find an auto accident chiropractor in {area.name}
            </h1>
            <p className="mt-8 max-w-2xl text-[1.2rem] leading-[1.75] text-[#536986]">{area.intro}</p>
            <p className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-[#7a90aa]">{area.availabilityCopy}</p>
            <div className="mt-10 grid gap-4 border-t border-[#e3edf7] pt-8 sm:grid-cols-3">
              <div>
                <p className="text-[1.15rem] font-black text-[#12203f]">{area.stateCode}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">service area</p>
              </div>
              <div>
                <p className="text-[1.15rem] font-black text-[#12203f]">{area.neighborhoods.slice(0, 2).join(" · ") || "Local neighborhoods"}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">nearby areas</p>
              </div>
              <div>
                <p className="text-[1.15rem] font-black text-[#12203f]">{area.zipCodes.length || 1}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">ZIP codes referenced</p>
              </div>
            </div>
          </div>

          <LeadForm pageSource={`area:${area.stateSlug}/${area.slug}`} heading={`Request a ${area.name} Match`} />
        </div>
      </section>

      <section className="motion-fade bg-[#f7fbff] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="surface-card p-7">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-[#12203f]">Local neighborhoods</h2>
              <p className="mt-4 text-lg leading-8 text-[#536986]">
                {area.neighborhoods.length ? area.neighborhoods.join(", ") : `${area.name} and nearby communities.`}
              </p>
            </article>
            <article className="surface-card p-7">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-[#12203f]">Coverage notes</h2>
              <p className="mt-4 text-lg leading-8 text-[#536986]">{area.chiropractorCountCopy}</p>
            </article>
            <article className="surface-card p-7">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-[#12203f]">Why people start here</h2>
              <p className="mt-4 text-lg leading-8 text-[#536986]">{area.ctaVariant}</p>
            </article>
          </div>
        </div>
      </section>

      <ReviewsSection
        title={`What people want after a crash in ${area.name}`}
        description={`A faster, calmer path into accident-related chiropractic care for ${area.name}, ${area.stateName}.`}
        reviews={area.testimonials.map((item) => ({
          initials: item.name
            .split(" ")
            .map((part) => part[0] ?? "")
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          name: item.name,
          detail: item.detail ?? `${area.name}, ${area.stateCode}`,
          quote: item.quote
        }))}
      />

      <FaqSection
        faqs={area.faqs}
        title={`Questions about finding care in ${area.name}`}
        description={`Everything you need to know before you request a chiropractor match in ${area.name}, ${area.stateCode}.`}
      />

      <ActionBand
        title={`Need a chiropractor in ${area.name}?`}
        accentLine="Get matched today."
        description={area.ctaVariant}
      />
    </main>
  );
}

function IconStep({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M7 4V8M17 4V8M5 10H19M6 6H18V20H6V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M7 4V8M17 4V8M5 10H19M6 6H18V20H6V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
      <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8L6.4 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
