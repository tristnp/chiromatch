import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/Blog";
import { JsonLd } from "@/components/JsonLd";
import { getBlogPostBySlug, getBlogPosts, getBlogSlugs } from "@/lib/blog";
import { blogPostJsonLd, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getBlogSlugs();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Blog",
      description: "Patient guides for finding care after a car accident.",
      path: "/blog"
    });
  }

  return buildMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${post.slug}`
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, posts] = await Promise.all([getBlogPostBySlug(params.slug), getBlogPosts()]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogPostJsonLd(post)} />
      <BlogArticlePage post={post} posts={posts} />
    </>
  );
}
