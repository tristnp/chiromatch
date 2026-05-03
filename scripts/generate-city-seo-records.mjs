import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import top1000UsCities from "../src/data/top-1000-us-cities.js";
import curatedOverrides from "../src/data/city-seo-overrides.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "../src/data/city-seo-records.js");

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeArray(value, fallback) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  return items.length ? [...new Set(items)] : fallback;
}

function normalizeString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getTrafficProfile(populationRank, population) {
  if (populationRank <= 25 || population >= 750_000) {
    return {
      roads: ["major highways", "surface streets", "downtown corridors", "commuter routes"],
      commuterContext: "dense highways, long commutes, and heavy city traffic"
    };
  }

  if (populationRank <= 150 || population >= 250_000) {
    return {
      roads: ["busy highways", "arterial roads", "city corridors", "daily commuter routes"],
      commuterContext: "busy intersections, routine commuter traffic, and major arterial driving"
    };
  }

  if (populationRank <= 500 || population >= 100_000) {
    return {
      roads: ["main roads", "surface streets", "local arterials", "commuter routes"],
      commuterContext: "main-road traffic, busy intersections, and regular city driving"
    };
  }

  return {
    roads: ["main roads", "surface streets", "local connectors", "daily driving routes"],
    commuterContext: "regional traffic, everyday intersections, and routine local driving"
  };
}

function buildGeneratedRecord(source) {
  const profile = getTrafficProfile(source.populationRank, source.population);
  const nearbyAreas = ["Downtown", "city center", "nearby neighborhoods", "surrounding communities"];
  const metro = `the ${source.city} area`;

  return {
    city: source.city,
    state: source.state,
    stateCode: source.stateCode,
    stateSlug: source.stateSlug,
    slug: source.slug,
    population: source.population,
    populationRank: source.populationRank,
    roads: profile.roads,
    nearbyAreas,
    zipCodes: [],
    metro,
    commuterContext: profile.commuterContext,
    localIntro: `${source.city} drivers often begin looking for care after collisions on ${profile.roads[0]} and ${profile.roads[1]} leave them dealing with soreness, stiffness, headaches, or range-of-motion problems.`,
    localSymptomContext: `Crashes around ${source.city} can leave people noticing symptoms later that day or the next morning, especially after they settle back into normal driving routines.`,
    localProof: `People in ${source.city} usually want one clear next step after a crash instead of calling office after office on their own.`,
    profileId: slugify(`${source.city}-${source.stateCode}`),
    faqOverrides: [],
    metadataDescriptionOverride: ""
  };
}

function mergeRecord(source, overrideRecord) {
  const generated = buildGeneratedRecord(source);

  if (!overrideRecord) {
    return generated;
  }

  return {
    ...generated,
    ...overrideRecord,
    city: source.city,
    state: source.state,
    stateCode: source.stateCode,
    stateSlug: source.stateSlug,
    slug: source.slug,
    population: source.population,
    populationRank: source.populationRank,
    roads: normalizeArray(overrideRecord.roads, generated.roads),
    nearbyAreas: normalizeArray(overrideRecord.nearbyAreas, generated.nearbyAreas),
    zipCodes: normalizeArray(overrideRecord.zipCodes, generated.zipCodes),
    metro: normalizeString(overrideRecord.metro, generated.metro),
    commuterContext: normalizeString(overrideRecord.commuterContext, generated.commuterContext),
    localIntro: normalizeString(overrideRecord.localIntro, generated.localIntro),
    localSymptomContext: normalizeString(overrideRecord.localSymptomContext, generated.localSymptomContext),
    localProof: normalizeString(overrideRecord.localProof, generated.localProof),
    profileId: normalizeString(overrideRecord.profileId, generated.profileId),
    faqOverrides: Array.isArray(overrideRecord.faqOverrides) ? overrideRecord.faqOverrides : [],
    metadataDescriptionOverride: normalizeString(
      overrideRecord.metadataDescriptionOverride,
      generated.metadataDescriptionOverride
    )
  };
}

function validateGeneratedRecords(records) {
  if (records.length !== 1000) {
    throw new Error(`Expected 1000 city records, received ${records.length}.`);
  }

  const slugSet = new Set();
  const rankSet = new Set();

  for (const record of records) {
    if (slugSet.has(record.slug)) {
      throw new Error(`Duplicate slug detected: ${record.slug}`);
    }

    if (rankSet.has(record.populationRank)) {
      throw new Error(`Duplicate populationRank detected: ${record.populationRank}`);
    }

    slugSet.add(record.slug);
    rankSet.add(record.populationRank);
  }
}

async function main() {
  const overrideMap = new Map(curatedOverrides.map((record) => [record.slug, record]));
  const records = top1000UsCities
    .slice()
    .sort((left, right) => left.populationRank - right.populationRank)
    .map((source) => mergeRecord(source, overrideMap.get(source.slug)));

  validateGeneratedRecords(records);

  const fileContents = `export const citySeoRecords = ${JSON.stringify(records, null, 2)};\n\nexport default citySeoRecords;\n`;
  await fs.writeFile(outputPath, fileContents, "utf8");
  console.log(`Generated ${records.length} city SEO records at ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
