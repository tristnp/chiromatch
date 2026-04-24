import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { StateTemplate } from "@/components/Sections";
import { getStateBySlug, getStateDescription, getStatePath, states } from "@/lib/locations";
import { buildMetadata, stateJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map((state) => ({
    state: state.slug
  }));
}

export function generateMetadata({ params }: { params: { state: string } }): Metadata {
  const state = getStateBySlug(params.state);

  if (!state) {
    return {};
  }

  return buildMetadata({
    title: `Auto Accident Chiropractors in ${state.name}`,
    description: getStateDescription(state),
    path: getStatePath(state)
  });
}

export default function StatePage({ params }: { params: { state: string } }) {
  const state = getStateBySlug(params.state);

  if (!state) {
    notFound();
  }

  return (
    <>
      <JsonLd data={stateJsonLd(state)} />
      <StateTemplate state={state} />
    </>
  );
}
