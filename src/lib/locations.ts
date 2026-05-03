export type FaqItem = {
  question: string;
  answer: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail?: string;
};

export type RawLocationRecord = {
  city?: string;
  area?: string;
  name?: string;
  state?: string;
  stateName?: string;
  stateCode?: string;
  slug?: string;
  neighborhoods?: string[] | string;
  zipCodes?: string[] | string;
  intro?: string;
  availabilityCopy?: string;
  chiropractorCountCopy?: string;
  ctaVariant?: string;
  faqs?: FaqItem[] | string;
  testimonials?: Testimonial[] | string;
};

export type LocationArea = {
  name: string;
  slug: string;
  stateName: string;
  stateCode: string;
  stateSlug: string;
  neighborhoods: string[];
  zipCodes: string[];
  intro: string;
  availabilityCopy: string;
  chiropractorCountCopy: string;
  ctaVariant: string;
  faqs: FaqItem[];
  testimonials: Testimonial[];
};

export type LocationState = {
  name: string;
  code: string;
  slug: string;
  areas: LocationArea[];
};

const STATE_NAMES: Record<string, string> = {
  AZ: "Arizona",
  CA: "California",
  CO: "Colorado",
  FL: "Florida",
  GA: "Georgia",
  IL: "Illinois",
  MA: "Massachusetts",
  NC: "North Carolina",
  NV: "Nevada",
  NY: "New York",
  OH: "Ohio",
  PA: "Pennsylvania",
  TX: "Texas",
  WA: "Washington"
};

const rawLocations: RawLocationRecord[] = [
  {
    area: "Phoenix",
    stateCode: "AZ",
    neighborhoods: "Downtown Phoenix, Arcadia, Deer Valley, Ahwatukee",
    zipCodes: "85004, 85016, 85022, 85044",
    intro:
      "Phoenix drivers deal with fast arterial roads, freeway merges, and long commutes. ChiropracticMatch helps people find accident-focused chiropractic care close to home.",
    chiropractorCountCopy: "A broad network of Phoenix-area chiropractors can help after rear-end, rideshare, and freeway collisions."
  },
  {
    area: "Los Angeles",
    stateCode: "CA",
    neighborhoods: "Hollywood, Koreatown, West LA, Echo Park",
    zipCodes: "90004, 90026, 90034, 90046",
    ctaVariant: "Find a Los Angeles chiropractor familiar with post-accident soreness, stiffness, and recovery documentation."
  },
  {
    area: "San Diego",
    stateCode: "CA",
    neighborhoods: "North Park, La Jolla, Mission Valley, Chula Vista",
    zipCodes: "92103, 92108, 92109, 91910"
  },
  {
    area: "San Francisco",
    stateCode: "CA",
    neighborhoods: "SoMa, Mission District, Richmond, Sunset",
    zipCodes: "94103, 94110, 94118, 94122"
  },
  {
    area: "Denver",
    stateCode: "CO",
    neighborhoods: "Capitol Hill, Cherry Creek, Highlands, Aurora",
    zipCodes: "80203, 80206, 80211, 80012"
  },
  {
    area: "Miami",
    stateCode: "FL",
    neighborhoods: "Brickell, Wynwood, Coral Gables, Hialeah",
    zipCodes: "33130, 33132, 33134, 33012",
    testimonials: [
      {
        quote: "They helped me understand what to do next after my crash and found an office near work.",
        name: "M. Rivera",
        detail: "Miami, FL"
      }
    ]
  },
  {
    area: "Orlando",
    stateCode: "FL",
    neighborhoods: "Downtown Orlando, Lake Nona, Winter Park, Kissimmee",
    zipCodes: "32801, 32827, 32789, 34741"
  },
  {
    area: "Atlanta",
    stateCode: "GA",
    neighborhoods: "Midtown, Buckhead, Decatur, Sandy Springs",
    zipCodes: "30308, 30305, 30030, 30328"
  },
  {
    area: "Chicago",
    stateCode: "IL",
    neighborhoods: "Loop, Logan Square, Lincoln Park, Hyde Park",
    zipCodes: "60601, 60647, 60614, 60615"
  },
  {
    area: "Boston",
    stateCode: "MA",
    neighborhoods: "Back Bay, Dorchester, Cambridge, Somerville",
    zipCodes: "02116, 02124, 02139, 02143"
  },
  {
    area: "Charlotte",
    stateCode: "NC",
    neighborhoods: "Uptown, South End, NoDa, Ballantyne",
    zipCodes: "28202, 28203, 28205, 28277"
  },
  {
    area: "Las Vegas",
    stateCode: "NV",
    neighborhoods: "Summerlin, Henderson, Paradise, Spring Valley",
    zipCodes: "89135, 89052, 89169, 89147"
  },
  {
    area: "New York City",
    stateCode: "NY",
    neighborhoods: "Manhattan, Brooklyn, Queens, Bronx",
    zipCodes: "10001, 11201, 11101, 10451",
    availabilityCopy: "Many New York City offices offer appointment windows that work around transit, work, and family schedules."
  },
  {
    area: "Columbus",
    stateCode: "OH",
    neighborhoods: "Short North, German Village, Clintonville, Dublin",
    zipCodes: "43201, 43206, 43214, 43017"
  },
  {
    area: "Philadelphia",
    stateCode: "PA",
    neighborhoods: "Center City, Fishtown, University City, South Philly",
    zipCodes: "19103, 19125, 19104, 19148"
  },
  {
    area: "Austin",
    stateCode: "TX",
    neighborhoods: "Downtown Austin, South Congress, Mueller, Round Rock",
    zipCodes: "78701, 78704, 78723, 78664"
  },
  {
    area: "Dallas",
    stateCode: "TX",
    neighborhoods: "Uptown, Oak Cliff, Deep Ellum, Plano",
    zipCodes: "75204, 75208, 75226, 75024"
  },
  {
    area: "Houston",
    stateCode: "TX",
    neighborhoods: "Midtown, The Heights, Montrose, Sugar Land",
    zipCodes: "77002, 77008, 77006, 77479"
  },
  {
    area: "San Antonio",
    stateCode: "TX",
    neighborhoods: "Downtown, Alamo Heights, Stone Oak, Leon Valley",
    zipCodes: "78205, 78209, 78258, 78238"
  },
  {
    area: "Seattle",
    stateCode: "WA",
    neighborhoods: "Capitol Hill, Ballard, West Seattle, Bellevue",
    zipCodes: "98102, 98107, 98116, 98004"
  }
];

const baseFaqs = (area: string, stateName: string): FaqItem[] => [
  {
    question: `Can ChiropracticMatch help me find care in ${area}?`,
    answer: `Yes. Share a few details about your accident and ChiropracticMatch will help connect you with an accident-focused chiropractor serving ${area}, ${stateName}.`
  },
  {
    question: "How soon should I look for chiropractic care after a crash?",
    answer:
      "Many people start by getting checked as soon as they notice soreness, stiffness, headaches, or limited range of motion. ChiropracticMatch helps you find an office so you can ask clinical questions directly."
  },
  {
    question: "Do I need an attorney before requesting a match?",
    answer:
      "No. You can request a chiropractor match first. If you are also working with an attorney or insurance adjuster, mention that during intake so the office understands your situation."
  }
];

const baseTestimonials = (area: string): Testimonial[] => [
  {
    quote: "The process felt simple, calm, and fast when everything else after the accident felt complicated.",
    name: "Recent patient",
    detail: area
  }
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listify(value: string[] | string | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonArray<T>(value: T[] | string | undefined, fallback: T[]): T[] {
  if (!value) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeLocationRecords(records: RawLocationRecord[]): LocationArea[] {
  return records
    .map((record) => {
      const name = record.area ?? record.city ?? record.name;
      const stateCode = (record.stateCode ?? record.state ?? "").toUpperCase();
      const stateName = record.stateName ?? STATE_NAMES[stateCode] ?? record.state ?? "";

      if (!name || !stateCode || !stateName) {
        return null;
      }

      const stateSlug = slugify(stateName);
      const slug = record.slug ? slugify(record.slug) : slugify(name);

      return {
        name,
        slug,
        stateName,
        stateCode,
        stateSlug,
        neighborhoods: listify(record.neighborhoods),
        zipCodes: listify(record.zipCodes),
        intro:
          record.intro ??
          `${name} accident victims can use ChiropracticMatch to find chiropractic offices that understand soreness, stiffness, mobility concerns, and post-crash documentation needs.`,
        availabilityCopy:
          record.availabilityCopy ??
          `Request a match and we will help you find available chiropractic care near ${name} with appointment options that fit your day.`,
        chiropractorCountCopy:
          record.chiropractorCountCopy ??
          `ChiropracticMatch focuses on accident-aware chiropractors serving ${name} and nearby communities.`,
        ctaVariant:
          record.ctaVariant ??
          `Tell us what happened and get matched with a ${name} chiropractor who can help you take the next step.`,
        faqs: parseJsonArray<FaqItem>(record.faqs, baseFaqs(name, stateName)),
        testimonials: parseJsonArray<Testimonial>(record.testimonials, baseTestimonials(name))
      };
    })
    .filter((location): location is LocationArea => Boolean(location))
    .sort((a, b) => a.stateName.localeCompare(b.stateName) || a.name.localeCompare(b.name));
}

export const areas = normalizeLocationRecords(rawLocations);

export const states: LocationState[] = Array.from(
  areas.reduce((map, area) => {
    const existing = map.get(area.stateSlug);
    if (existing) {
      existing.areas.push(area);
      return map;
    }

    map.set(area.stateSlug, {
      name: area.stateName,
      code: area.stateCode,
      slug: area.stateSlug,
      areas: [area]
    });

    return map;
  }, new Map<string, LocationState>())
).map(([, state]) => ({
  ...state,
  areas: state.areas.sort((a, b) => a.name.localeCompare(b.name))
}));

export function getStateBySlug(slug: string) {
  return states.find((state) => state.slug === slug);
}

export function getAreaBySlugs(stateSlug: string, areaSlug: string) {
  return areas.find((area) => area.stateSlug === stateSlug && area.slug === areaSlug);
}

export function getAreaForCity(cityName: string, stateName: string) {
  const citySlug = slugify(cityName);
  const stateSlug = slugify(stateName);
  return areas.find((area) => area.stateSlug === stateSlug && area.slug === citySlug);
}

export function normalizeZip(value: string) {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function getAreaForZip(zip: string) {
  const normalizedZip = normalizeZip(zip);

  if (normalizedZip.length !== 5) {
    return undefined;
  }

  return areas.find((area) => area.zipCodes.includes(normalizedZip));
}

export function getAreaMatchCount(area: LocationArea) {
  return Math.max(area.zipCodes.length, area.neighborhoods.length, 1);
}

export function getPlaceholderZipMatchCount(zip: string, area?: LocationArea) {
  const seed = area ? `${area.stateSlug}:${area.slug}:${zip}` : zip;
  const hash = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  return 8 + (hash % 19);
}

export function getAreaPath(area: LocationArea) {
  return `/locations/${area.stateSlug}/${area.slug}`;
}

export function getStatePath(state: LocationState) {
  return `/locations/${state.slug}`;
}

export function getAreaTitle(area: LocationArea) {
  return `Auto Accident Chiropractor in ${area.name}, ${area.stateCode}`;
}

export function getAreaDescription(area: LocationArea) {
  return `Find an accident-focused chiropractor near ${area.name}, ${area.stateName}. ChiropracticMatch helps with fast, calm matching after a car crash.`;
}

export function getStateDescription(state: LocationState) {
  return `Find auto accident chiropractors across ${state.name}. Browse ChiropracticMatch city and area pages for supportive post-crash care.`;
}
