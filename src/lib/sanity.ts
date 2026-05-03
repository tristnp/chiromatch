import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const apiVersion = process.env.SANITY_API_VERSION ?? "2026-04-25";

export function getSanityProjectId() {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? "";
}

export function getSanityDataset() {
  return process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET ?? "";
}

export function hasSanityConfig() {
  return Boolean(getSanityProjectId() && getSanityDataset());
}

export function getSanityClient({ preview = false }: { preview?: boolean } = {}) {
  const projectId = getSanityProjectId();
  const dataset = getSanityDataset();

  if (!projectId || !dataset) {
    throw new Error("Sanity is not configured. Missing project ID or dataset.");
  }

  const token =
    process.env.SANITY_API_READ_TOKEN ??
    process.env.SANITY_API_TOKEN ??
    (preview ? process.env.SANITY_API_WRITE_TOKEN : undefined);

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: preview ? "previewDrafts" : "published"
  });
}

const builder = createImageUrlBuilder({
  projectId: getSanityProjectId() || "placeholder",
  dataset: getSanityDataset() || "production"
});

export function sanityImageUrl(source: unknown) {
  if (!source || !hasSanityConfig()) {
    return null;
  }

  return builder.image(source);
}
