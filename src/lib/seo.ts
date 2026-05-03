import type { Metadata } from "next";
import { getAreaPath, getAreaTitle, type LocationArea, type LocationState } from "@/lib/locations";

export const siteConfig = {
  name: "ChiropracticMatch",
  url: "https://www.chiropracticmatch.com",
  description:
    "ChiropracticMatch connects auto accident victims with chiropractors across the US."
};

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = absoluteUrl(path);

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
      siteName: siteConfig.name,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export function areaJsonLd(area: LocationArea) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: getAreaTitle(area),
    serviceType: "Auto accident chiropractic matching",
    areaServed: {
      "@type": "City",
      name: area.name,
      addressRegion: area.stateCode,
      addressCountry: "US"
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    url: absoluteUrl(getAreaPath(area)),
    description: area.intro
  };
}

export function stateJsonLd(state: LocationState) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Auto accident chiropractors in ${state.name}`,
    itemListElement: state.areas.map((area, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getAreaTitle(area),
      url: absoluteUrl(getAreaPath(area))
    }))
  };
}

export function blogPostJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishDate: string;
  authorName?: string;
  featuredImage?: { url: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: post.authorName ?? siteConfig.name
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    image: post.featuredImage?.url
  };
}
