import { createClient } from "@sanity/client";
import { blogPosts } from "../src/data/blog-posts-seeded.js";

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION ?? "2026-04-25";

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity config. Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false
});

function blocksFromParagraphs(paragraphs) {
  return paragraphs.map((paragraph) => ({
    _type: "block",
    children: [
      {
        _type: "span",
        marks: [],
        text: paragraph
      }
    ],
    markDefs: [],
    style: "normal"
  }));
}

function textSection(title, content) {
  return {
    _type: "textSection",
    title,
    body: blocksFromParagraphs([content])
  };
}

function faqItem(question, answer) {
  return {
    _type: "faqItem",
    question,
    answer: blocksFromParagraphs([answer])
  };
}

function inferCtaVariant(href) {
  return href === "/locations" ? "browse" : "match";
}

function toDocument(post) {
  return {
    _id: `blogPost.${post.slug}`,
    _type: "blogPost",
    title: post.title,
    slug: {
      _type: "slug",
      current: post.slug
    },
    excerpt: post.excerpt,
    publishDate: post.publishDate,
    status: "published",
    topic: post.topic,
    searchIntent: post.searchIntent,
    authorName: "ChiropracticMatch",
    seoTitle: `${post.title} | ChiropracticMatch Blog`,
    seoDescription: post.excerpt,
    ctaVariant: inferCtaVariant(post.cta.href),
    bodyBlocks: [
      {
        _type: "intro",
        content: blocksFromParagraphs(post.answerIntro)
      },
      ...post.bodySections.map((section) => textSection(section.title, section.content)),
      {
        _type: "faqBlock",
        items: post.faqs.map((item) => faqItem(item.question, item.answer))
      },
      {
        _type: "relatedLinksBlock",
        links: post.relatedLinks.map((link) => ({
          _type: "relatedLink",
          label: link.label,
          href: link.href,
          description: link.description
        }))
      },
      {
        _type: "ctaBlock",
        label: post.cta.label,
        href: post.cta.href,
        title: post.cta.title,
        accentLine: post.cta.accentLine
      }
    ]
  };
}

async function main() {
  for (const post of blogPosts) {
    const document = toDocument(post);
    await client.createOrReplace(document);
    console.log(`Imported ${post.slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
