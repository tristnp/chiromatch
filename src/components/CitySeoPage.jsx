import Link from "next/link";
import Script from "next/script";
import { LeadForm } from "@/components/LeadForm";
import { ActionBand, ComparisonSection, FaqSection, ReviewsSection } from "@/components/Sections";
import {
  getCityBrowseLabel,
  getCityJsonLd,
  getCityPageFaqs,
  getCityPagePath,
  getCityPageSections,
  getRelatedCities
} from "../../lib/cities";
import { getAreaForCity, getAreaPath } from "@/lib/locations";

export function CitySeoPage({ city, type }) {
  const isWhiplash = type === "whiplash";
  const siblingType = isWhiplash ? "car-accident" : "whiplash";
  const siblingLabel = isWhiplash ? "Chiropractor after car accident" : "Whiplash chiropractor";
  const sections = getCityPageSections(city, type);
  const faqItems = getCityPageFaqs(city, type);
  const relatedCities = getRelatedCities(city, 3);
  const localArea = getAreaForCity(city.city, city.state);
  const pageSource = `${type}:${city.slug}`;
  const schema = getCityJsonLd(city, type);

  return (
    <main>
      <Script id={`${city.slug}-${type}-jsonld`} type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_470px] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="trust-pill">
              <span className="accent-dot" />
              {sections.eyebrow}
            </div>
            <h1 className="mt-8 max-w-3xl text-[3.1rem] font-black leading-[0.94] tracking-[-0.03em] text-[#12203f] sm:text-[4.15rem]">
              {isWhiplash ? "Find a whiplash chiropractor" : "Find a chiropractor after a car accident"}
              <br />
              <span className="text-[#58b7dd]">in {city.city}.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[1.2rem] leading-[1.75] text-[#536986]">{sections.heroDescription}</p>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-[#7a90aa]">{sections.localContext}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href="#match-form">
                Request Match
              </Link>
            </div>
            <div className="mt-10 grid gap-4 border-t border-[#e3edf7] pt-8 sm:grid-cols-3">
              <div>
                <p className="text-[1.15rem] font-black text-[#12203f]">{city.stateCode}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">state market</p>
              </div>
              <div>
                <p className="text-[1.15rem] font-black text-[#12203f]">{city.roads.slice(0, 2).join(" · ")}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">local corridors</p>
              </div>
              <div>
                <p className="text-[1.15rem] font-black text-[#12203f]">{city.nearbyAreas.length}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#8da1bc]">local areas referenced</p>
              </div>
            </div>
          </div>

          <div id="match-form">
            <LeadForm pageSource={pageSource} heading={`Request a ${city.city} Match`} />
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbff] py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {sections.cards.map((card) => (
            <article key={card.title} className="surface-card p-7">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-[#12203f]">{card.title}</h2>
              <p className="mt-4 text-lg leading-8 text-[#536986]">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Local pathways</p>
            <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[3.5rem]">
              Keep exploring {city.city}
            </h2>
            <p className="mt-5 text-[1.15rem] leading-8 text-[#536986]">
              Move between the matching page families, the broader {city.state} market page, and nearby city pages without losing the local context.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="surface-card p-6">
              <h3 className="text-[1.5rem] font-black tracking-[-0.03em] text-[#12203f]">Alternate search intent</h3>
              <p className="mt-4 text-lg leading-8 text-[#536986]">
                Switch to the sibling page for {city.city} if your search is more symptom-specific or more accident-specific.
              </p>
              <Link className="mt-5 inline-flex text-base font-black text-[#58b7dd]" href={getCityPagePath(city, siblingType)}>
                {siblingLabel} in {city.city} →
              </Link>
            </article>

            <article className="surface-card p-6">
              <h3 className="text-[1.5rem] font-black tracking-[-0.03em] text-[#12203f]">State and city directory</h3>
              <p className="mt-4 text-lg leading-8 text-[#536986]">
                Browse the broader {city.state} directory or jump into the matching local area page when we have one live.
              </p>
              <div className="mt-5 grid gap-2 text-base font-black text-[#58b7dd]">
                <Link href={`/locations/${city.stateSlug}`}>Browse {city.state} city pages</Link>
                {localArea ? <Link href={getAreaPath(localArea)}>View the {city.city} local area page</Link> : null}
              </div>
            </article>

            <article className="surface-card p-6">
              <h3 className="text-[1.5rem] font-black tracking-[-0.03em] text-[#12203f]">Related nearby city pages</h3>
              <p className="mt-4 text-lg leading-8 text-[#536986]">
                These pages stay in the same regional lane so users and crawlers can move through related markets naturally.
              </p>
              <div className="mt-5 grid gap-2 text-base font-black text-[#58b7dd]">
                {relatedCities.map((relatedCity) => (
                  <Link key={relatedCity.slug} href={getCityPagePath(relatedCity, type)}>
                    {getCityBrowseLabel(relatedCity)}
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <ComparisonSection
        title={`Before & After starting in ${city.city}`}
        description={`A clearer path into local chiropractic care after a collision in ${city.city}, ${city.state}.`}
      />

      <ReviewsSection
        title={`What people want after a crash in ${city.city}`}
        description={city.localProof}
      />

      <FaqSection
        faqs={faqItems}
        title={`Common questions in ${city.city}`}
        description={`Everything you need to know before you request a chiropractor match in ${city.city}.`}
      />

      <ActionBand
        title={`Don't wait on your recovery in ${city.city}.`}
        accentLine="Get matched today."
        description={sections.ctaSupport}
        primaryHref="#match-form"
        primaryLabel={`Request ${city.city} Match`}
      />
    </main>
  );
}
