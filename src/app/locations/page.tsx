import type { Metadata } from "next";
import { LocationIndex } from "@/components/Sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Auto Accident Chiropractor Locations",
  description:
    "Browse ChiropracticMatch state and city pages for auto accident chiropractor matching across the US.",
  path: "/locations"
});

export default function LocationsPage() {
  return <LocationIndex />;
}
