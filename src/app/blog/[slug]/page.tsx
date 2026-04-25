import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/Blog";
import { JsonLd } from "@/components/JsonLd";
import { blogPosts, getBlogPostBySlug } from "@/data/blog-posts";
import { blogPostJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Blog",
      description: "Patient guides for finding care after a car accident.",
      path: "/blog"
    });
  }

  return buildMetadata({
    title: `${post.title} | ChiropracticMatch Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogPostJsonLd(post)} />
      <BlogArticlePage post={post} />
    </>
  );
}
