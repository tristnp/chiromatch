export type CitySeoRecord = {
  city: string;
  state: string;
  stateCode: string;
  stateSlug: string;
  slug: string;
  roads: string[];
  nearbyAreas: string[];
  zipCodes: string[];
  metro: string;
  commuterContext: string;
  localIntro: string;
  localSymptomContext: string;
  localProof: string;
  profileId: string;
  faqOverrides?: { question: string; answer: string }[];
  metadataDescriptionOverride?: string;
};

export type City = CitySeoRecord;

export const cities: CitySeoRecord[];
export const rejectedCitySeoRecords: {
  slug: string;
  city: string;
  state: string;
  issues: string[];
}[];
export const citySeoValidationReport: {
  totalRecords: number;
  validRecords: number;
  rejectedRecords: number;
  rejected: typeof rejectedCitySeoRecords;
};
export function getCitiesByState(state: string): CitySeoRecord[];
export function getCityBySlug(slug: string): CitySeoRecord | undefined;
export function getRelatedCities(city: CitySeoRecord, limit?: number): CitySeoRecord[];
export function getCityPagePath(city: CitySeoRecord, type: string): string;
export function getCityPageTitle(city: CitySeoRecord, type: string): string;
export function getCityPageDescription(city: CitySeoRecord, type: string): string;
export function getCityPageFaqs(city: CitySeoRecord, type: string): { question: string; answer: string }[];
export function getCityPageSections(
  city: CitySeoRecord,
  type: string
): {
  eyebrow: string;
  heroDescription: string;
  localContext: string;
  cards: { title: string; text: string }[];
  ctaSupport: string;
};
export function getCityJsonLd(city: CitySeoRecord, type: string): Record<string, unknown>;
export function getCityBrowseLabel(city: CitySeoRecord): string;
export function getCityBrowseDescription(city: CitySeoRecord): string;
