import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { AreaTemplate } from "@/components/Sections";
import {
  areas,
  getAreaBySlugs,
  getAreaDescription,
  getAreaPath,
  getAreaTitle
} from "@/lib/locations";
import { areaJsonLd, buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((area) => ({
    state: area.stateSlug,
    area: area.slug
  }));
}

export function generateMetadata({ params }: { params: { state: string; area: string } }): Metadata {
  const area = getAreaBySlugs(params.state, params.area);

  if (!area) {
    return {};
  }

  return buildMetadata({
    title: getAreaTitle(area),
    description: getAreaDescription(area),
    path: getAreaPath(area)
  });
}

export default function AreaPage({ params }: { params: { state: string; area: string } }) {
  const area = getAreaBySlugs(params.state, params.area);

  if (!area) {
    notFound();
  }

  return (
    <>
      <JsonLd data={areaJsonLd(area)} />
      <AreaTemplate area={area} />
    </>
  );
}
