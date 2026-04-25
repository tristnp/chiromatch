import citySeoRecords from "../src/data/city-seo-records.js";

const callNumber = "(916) 305-2631";

function dedupe(items) {
  return [...new Set((items ?? []).filter(Boolean))];
}

function oxfordList(items, conjunction = "and") {
  if (!items.length) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items.at(-1)}`;
}

function titleCasePhrase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function validateCitySeoRecord(record) {
  const issues = [];
  const normalized = {
    city: typeof record.city === "string" ? record.city.trim() : "",
    state: typeof record.state === "string" ? record.state.trim() : "",
    stateCode: typeof record.stateCode === "string" ? record.stateCode.trim() : "",
    stateSlug: typeof record.stateSlug === "string" ? record.stateSlug.trim() : "",
    slug: typeof record.slug === "string" ? record.slug.trim() : "",
    roads: dedupe(record.roads),
    nearbyAreas: dedupe(record.nearbyAreas),
    zipCodes: dedupe(record.zipCodes),
    metro: typeof record.metro === "string" ? record.metro.trim() : "",
    commuterContext: typeof record.commuterContext === "string" ? record.commuterContext.trim() : "",
    localIntro: typeof record.localIntro === "string" ? record.localIntro.trim() : "",
    localSymptomContext: typeof record.localSymptomContext === "string" ? record.localSymptomContext.trim() : "",
    localProof: typeof record.localProof === "string" ? record.localProof.trim() : "",
    profileId: typeof record.profileId === "string" ? record.profileId.trim() : "",
    faqOverrides: Array.isArray(record.faqOverrides) ? record.faqOverrides : [],
    metadataDescriptionOverride:
      typeof record.metadataDescriptionOverride === "string" ? record.metadataDescriptionOverride.trim() : ""
  };

  if (!normalized.city) {
    issues.push("missing city");
  }

  if (!normalized.state) {
    issues.push("missing state");
  }

  if (!normalized.slug) {
    issues.push("missing slug");
  }

  if (!normalized.stateCode) {
    issues.push("missing stateCode");
  }

  if (!normalized.stateSlug) {
    issues.push("missing stateSlug");
  }

  if (!normalized.roads.length) {
    issues.push("missing roads");
  }

  if (!normalized.nearbyAreas.length) {
    issues.push("missing nearbyAreas");
  }

  if (!normalized.metro) {
    issues.push("missing metro");
  }

  if (!normalized.commuterContext) {
    issues.push("missing commuterContext");
  }

  if (!normalized.localIntro) {
    issues.push("missing localIntro");
  }

  if (!normalized.localSymptomContext) {
    issues.push("missing localSymptomContext");
  }

  if (!normalized.localProof) {
    issues.push("missing localProof");
  }

  if (!normalized.profileId) {
    issues.push("missing profileId");
  }

  return {
    valid: issues.length === 0,
    issues,
    record: normalized
  };
}

const validationResults = citySeoRecords.map((record) => validateCitySeoRecord(record));

export const rejectedCitySeoRecords = validationResults
  .filter((entry) => !entry.valid)
  .map((entry) => ({
    slug: entry.record.slug || "(missing-slug)",
    city: entry.record.city || "(missing-city)",
    state: entry.record.state || "(missing-state)",
    issues: entry.issues
  }));

export const citySeoValidationReport = {
  totalRecords: citySeoRecords.length,
  validRecords: validationResults.filter((entry) => entry.valid).length,
  rejectedRecords: rejectedCitySeoRecords.length,
  rejected: rejectedCitySeoRecords
};

export const cities = validationResults.filter((entry) => entry.valid).map((entry) => entry.record);

export function getCityBySlug(slug) {
  return cities.find((city) => city.slug === slug);
}

export function getCitiesByState(state) {
  return cities.filter((city) => city.state === state);
}

export function getRelatedCities(city, limit = 3) {
  const sameProfile = cities.filter((entry) => entry.profileId === city.profileId && entry.slug !== city.slug);
  const sameState = cities.filter((entry) => entry.state === city.state && entry.slug !== city.slug);

  return dedupe(
    [...sameProfile, ...sameState]
      .slice(0, limit * 3)
      .map((entry) => entry.slug)
  )
    .map((slug) => getCityBySlug(slug))
    .filter(Boolean)
    .slice(0, limit);
}

export function getCityPagePath(city, type) {
  return type === "whiplash" ? `/whiplash-chiropractor/${city.slug}` : `/chiropractor-after-car-accident/${city.slug}`;
}

const cityPageFamilies = {
  "car-accident": {
    title(city) {
      return `Chiropractor After Car Accident in ${city.city}, ${city.state}`;
    },
    description(city) {
      const roadText = oxfordList(city.roads.slice(0, 3), "and");
      return (
        city.metadataDescriptionOverride ||
        `Find a chiropractor after a car accident in ${city.city}, ${city.state}. Start with local crash-care context from ${roadText} and nearby areas like ${city.nearbyAreas[0]}.`
      );
    },
    sections(city) {
      const roadText = oxfordList(city.roads.slice(0, 3), "and");
      const areaText = oxfordList(city.nearbyAreas.slice(0, 3), "and");

      return {
        eyebrow: `${city.city}, ${city.stateCode}`,
        heroDescription: `${city.localIntro} ChiropracticMatch helps people in ${city.city} find a chiropractor after a car accident without doing all the searching themselves.`,
        localContext: `People in ${city.city} often start looking for care after collisions on ${roadText} or routine trips through ${areaText} leave them sore the next day.`,
        cards: [
          {
            title: "Local accident care context",
            text: `Drivers in ${city.city} often begin after rear-end crashes, intersection hits, or freeway merges around ${roadText} leave them looking for a clearer next step.`
          },
          {
            title: "Nearby areas we reference",
            text: `This page is written for people searching from ${areaText} and nearby parts of ${city.metro}, not just one downtown ZIP code.`
          },
          {
            title: "Why the next day matters",
            text: city.localSymptomContext
          }
        ],
        ctaSupport: `Use the form or call to get started if crash-related soreness or stiffness showed up after driving in ${city.city}.`
      };
    },
    faqs(city) {
      const roadText = oxfordList(city.roads.slice(0, 2), "and");
      const areaText = oxfordList(city.nearbyAreas.slice(0, 3), "and");
      const defaults = [
        {
          question: `How do I start looking for a chiropractor after a crash in ${city.city}?`,
          answer: `Start with the form or call ${callNumber}. ChiropracticMatch helps people in ${city.city} begin with a clearer next step after crashes along ${roadText}.`
        },
        {
          question: `Why do symptoms show up later after a crash in ${city.city}?`,
          answer: `${city.localSymptomContext} That is one reason many people reach out once they notice headaches, stiffness, or reduced range of motion after getting home.`
        },
        {
          question: `What parts of ${city.city} does this help with?`,
          answer: `People often reach out from ${areaText} and nearby parts of ${city.metro}. The goal is to help you start with a chiropractor who understands accident-related care.`
        }
      ];

      return city.faqOverrides.length ? city.faqOverrides : defaults;
    },
    serviceType: "Auto accident chiropractor matching"
  },
  whiplash: {
    title(city) {
      return `Whiplash Chiropractor in ${city.city}, ${city.state}`;
    },
    description(city) {
      const roadText = oxfordList(city.roads.slice(0, 3), "and");
      return (
        city.metadataDescriptionOverride ||
        `Find a whiplash chiropractor in ${city.city}, ${city.state}. ChiropracticMatch helps people dealing with neck pain, stiffness, and delayed soreness after crashes on ${roadText}.`
      );
    },
    sections(city) {
      const roadText = oxfordList(city.roads.slice(0, 3), "and");
      const areaText = oxfordList(city.nearbyAreas.slice(0, 3), "and");

      return {
        eyebrow: `${city.city}, ${city.stateCode}`,
        heroDescription: `${city.localIntro} ChiropracticMatch helps people in ${city.city} find a whiplash chiropractor without starting from scratch.`,
        localContext: `Whiplash complaints in ${city.city} often begin after stop-and-go driving on ${roadText} or neighborhood trips through ${areaText}.`,
        cards: [
          {
            title: "Whiplash symptoms around town",
            text: `Neck pain, headaches, shoulder tightness, and limited range of motion are common reasons people in ${city.city} start here after crashes on ${roadText}.`
          },
          {
            title: "Nearby areas we reference",
            text: `This page is written for people searching from ${areaText} and nearby parts of ${city.metro}, not just one downtown ZIP code.`
          },
          {
            title: "Why delayed soreness happens",
            text: `${city.localSymptomContext} ${city.commuterContext[0].toUpperCase()}${city.commuterContext.slice(1)} can make smaller collisions feel worse later in the day.`
          }
        ],
        ctaSupport: `Use the form or call to get started if whiplash symptoms showed up after driving in ${city.city}.`
      };
    },
    faqs(city) {
      const roadText = oxfordList(city.roads.slice(0, 2), "and");
      const areaText = oxfordList(city.nearbyAreas.slice(0, 3), "and");
      const defaults = [
        {
          question: `How do I start looking for a whiplash chiropractor in ${city.city}?`,
          answer: `Start with the form or call ${callNumber}. ChiropracticMatch helps people in ${city.city} begin with a clearer next step after crashes along ${roadText}.`
        },
        {
          question: `Why does neck pain show up later after a crash in ${city.city}?`,
          answer: `${city.localSymptomContext} That is one reason many people reach out once they notice headaches, stiffness, or reduced range of motion after getting home.`
        },
        {
          question: `What parts of ${city.city} does this help with?`,
          answer: `People often reach out from ${areaText} and nearby parts of ${city.metro}. The goal is to help you start with a chiropractor who understands whiplash-style crash symptoms.`
        }
      ];

      return city.faqOverrides.length ? city.faqOverrides : defaults;
    },
    serviceType: "Whiplash chiropractor matching"
  }
};

function getPageFamily(type) {
  return cityPageFamilies[type] ?? cityPageFamilies["car-accident"];
}

export function getCityPageTitle(city, type) {
  return getPageFamily(type).title(city);
}

export function getCityPageDescription(city, type) {
  return getPageFamily(type).description(city);
}

export function getCityPageFaqs(city, type) {
  return getPageFamily(type).faqs(city);
}

export function getCityPageSections(city, type) {
  return getPageFamily(type).sections(city);
}

export function getCityJsonLd(city, type) {
  const family = getPageFamily(type);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: family.title(city),
    serviceType: family.serviceType,
    areaServed: {
      "@type": "City",
      name: city.city,
      addressRegion: city.stateCode,
      addressCountry: "US"
    },
    provider: {
      "@type": "Organization",
      name: "ChiropracticMatch",
      url: "https://www.chiropracticmatch.com"
    },
    description: family.description(city)
  };
}

export function getCityBrowseLabel(city) {
  return `${city.city}, ${city.stateCode}`;
}

export function getCityBrowseDescription(city) {
  const firstArea = city.nearbyAreas[0] ?? `Downtown ${city.city}`;
  return `Local copy references ${titleCasePhrase(firstArea)} and corridors like ${city.roads[0]}.`;
}
