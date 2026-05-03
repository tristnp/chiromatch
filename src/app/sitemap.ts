import type { MetadataRoute } from "next";
import { cities } from "../../lib/cities";
import { getBlogPosts } from "@/lib/blog";
import { areas, getAreaPath, getStatePath, states } from "@/lib/locations";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPosts = await getBlogPosts();
  const staticRoutes = [
    "/",
    "/auto-accident-chiropractor",
    "/blog",
    "/for-chiropractors",
    "/locations",
    "/privacy",
    "/terms",
    "/thank-you",
    "/provider-thank-you"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.7
    })),
    ...states.map((state) => ({
      url: absoluteUrl(getStatePath(state)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...areas.map((area) => ({
      url: absoluteUrl(getAreaPath(area)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishDate),
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...cities.flatMap((city) => [
      {
        url: absoluteUrl(`/chiropractor-after-car-accident/${city.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9
      },
      {
        url: absoluteUrl(`/whiplash-chiropractor/${city.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9
      }
    ])
  ];
}
