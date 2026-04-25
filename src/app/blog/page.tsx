import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/Blog";
import { blogPosts } from "@/data/blog-posts";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ChiropracticMatch Blog | Auto Accident Recovery Guides",
  description:
    "Read practical ChiropracticMatch guides about whiplash, soreness, insurance questions, and how to find the right chiropractor after a car accident.",
  path: "/blog"
});

export default function BlogPage() {
  return <BlogIndexPage posts={blogPosts} />;
}
