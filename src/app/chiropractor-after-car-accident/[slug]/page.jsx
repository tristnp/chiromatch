import { notFound } from "next/navigation";
import { CitySeoPage } from "@/components/CitySeoPage";
import { cities, getCityBySlug, getCityPageDescription, getCityPagePath, getCityPageTitle } from "../../../../lib/cities.js";
import { absoluteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug
  }));
}

export function generateMetadata({ params }) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    return {};
  }

  const title = getCityPageTitle(city, "car-accident");
  const description = getCityPageDescription(city, "car-accident");
  const url = absoluteUrl(getCityPagePath(city, "car-accident"));

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ChiropracticMatch",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default function ChiropractorAfterCarAccidentCityPage({ params }) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    notFound();
  }

  return <CitySeoPage city={city} type="car-accident" />;
}
