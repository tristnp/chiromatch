import type { Metadata } from "next";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { getBlogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "ChiropracticMatch Blog | Auto Accident Recovery Guides",
  description:
    "Read practical ChiropracticMatch guides about whiplash, soreness, insurance questions, and how to find the right chiropractor after a car accident.",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogIndexClient posts={posts} />;
}
