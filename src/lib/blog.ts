import { blogPosts as seededBlogPosts } from "@/data/blog-posts-seeded";
import { getSanityClient, hasSanityConfig } from "@/lib/sanity";
import type {
  BlogBlock,
  BlogCta,
  BlogFaq,
  BlogImage,
  BlogPostPageData,
  BlogPostSummary,
  BlogRelatedLink,
  BlogSummaryRef,
  BlogTopic
} from "@/types/blog";

export const blogTopicOrder: BlogTopic[] = [
  "Symptoms",
  "Timing",
  "Insurance",
  "Choosing care",
  "Appointments",
  "Starting point",
  "Logistics",
  "Decision"
];

const publishedPostsQuery = `
  *[_type == "blogPost" && status == "published"] | order(publishDate desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishDate,
    topic,
    searchIntent,
    authorName,
    seoTitle,
    seoDescription,
    ctaVariant,
    featuredImage {
      alt,
      asset->{
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    relatedPosts[]->{
      title,
      "slug": slug.current,
      excerpt,
      publishDate,
      topic,
      searchIntent,
      featuredImage {
        alt,
        asset->{
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    },
    bodyBlocks[]{
      ...,
      image {
        alt,
        asset->{
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      relatedPosts[]->{
        title,
        "slug": slug.current,
        excerpt,
        publishDate,
        topic,
        searchIntent,
        featuredImage {
          alt,
          asset->{
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        }
      }
    }
  }
`;

function plainTextFromPortableText(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((block) => {
      if (!block || typeof block !== "object") {
        return "";
      }

      const maybeChildren = (block as { children?: unknown[] }).children;

      if (!Array.isArray(maybeChildren)) {
        return "";
      }

      return maybeChildren
        .map((child) => (child && typeof child === "object" && "text" in child ? String((child as { text: unknown }).text ?? "") : ""))
        .join("")
        .trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

function paragraphsFromPortableText(value: unknown): string[] {
  const text = plainTextFromPortableText(value);
  if (!text) {
    return [];
  }

  return text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function estimateReadTimeFromBlocks(blocks: BlogBlock[], excerpt: string): number {
  const text = blocks
    .map((block) => {
      switch (block.type) {
        case "intro":
          return block.paragraphs.join(" ");
        case "section":
          return `${block.title} ${block.content}`;
        case "faq":
          return block.items.map((item) => `${item.question} ${item.answer}`).join(" ");
        case "cta":
          return `${block.cta.title} ${block.cta.accentLine}`;
        case "ctaBanner":
          return `${block.headline} ${block.subheading}`;
        case "relatedLinks":
          return block.links.map((item) => `${item.label} ${item.description}`).join(" ");
        case "image":
          return block.caption ?? "";
        case "quote":
        case "pullQuote":
          return `${block.quote} ${block.attribution ?? ""}`;
        case "checklist":
          return `${block.title ?? ""} ${block.items.join(" ")}`;
        case "comparison":
          return `${block.title ?? ""} ${block.rows.map((row) => `${row.label} ${row.value}`).join(" ")}`;
        case "highlight":
          return `${block.title ?? ""} ${block.content}`;
        default:
          return "";
      }
    })
    .join(" ");

  const words = `${excerpt} ${text}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 180));
}

function normalizeImage(value: unknown): BlogImage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as {
    alt?: unknown;
    asset?: {
      url?: unknown;
      metadata?: { dimensions?: { width?: unknown; height?: unknown } };
    };
  };

  if (typeof source.asset?.url !== "string" || !source.asset.url) {
    return null;
  }

  const width =
    typeof source.asset.metadata?.dimensions?.width === "number" ? source.asset.metadata.dimensions.width : undefined;
  const height =
    typeof source.asset.metadata?.dimensions?.height === "number" ? source.asset.metadata.dimensions.height : undefined;

  return {
    url: source.asset.url,
    alt: typeof source.alt === "string" && source.alt.trim() ? source.alt : "Blog image",
    width,
    height
  };
}

function defaultCtaForVariant(variant: unknown): BlogCta {
  if (variant === "browse") {
    return {
      label: "Browse Cities",
      href: "/locations",
      title: "Need a calmer way to compare local options?",
      accentLine: "Start with your city."
    };
  }

  return {
    label: "Request Match",
    href: "/#match-form",
    title: "Ready to stop guessing?",
    accentLine: "Start with one clear next step."
  };
}

function normalizeRelatedLinks(value: unknown): BlogRelatedLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as {
        label?: unknown;
        href?: unknown;
        description?: unknown;
      };

      if (typeof link.label !== "string" || typeof link.href !== "string" || typeof link.description !== "string") {
        return null;
      }

      return {
        label: link.label,
        href: link.href,
        description: link.description
      };
    })
    .filter((item): item is BlogRelatedLink => Boolean(item));
}

function normalizeFaqs(value: unknown): BlogFaq[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const faq = item as { question?: unknown; answer?: unknown };
      const answer = typeof faq.answer === "string" ? faq.answer : plainTextFromPortableText(faq.answer);

      if (typeof faq.question !== "string" || !answer) {
        return null;
      }

      return {
        question: faq.question,
        answer
      };
    })
    .filter((item): item is BlogFaq => Boolean(item));
}

function normalizeSummaryRef(value: unknown): BlogSummaryRef | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const post = value as {
    slug?: unknown;
    title?: unknown;
    excerpt?: unknown;
    publishDate?: unknown;
    topic?: unknown;
    searchIntent?: unknown;
    featuredImage?: unknown;
  };

  if (
    typeof post.slug !== "string" ||
    typeof post.title !== "string" ||
    typeof post.excerpt !== "string" ||
    typeof post.publishDate !== "string" ||
    typeof post.topic !== "string" ||
    typeof post.searchIntent !== "string"
  ) {
    return null;
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishDate: post.publishDate,
    topic: post.topic,
    searchIntent: post.searchIntent,
    featuredImage: normalizeImage(post.featuredImage)
  };
}

function normalizeBodyBlocks(value: unknown): BlogBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<BlogBlock[]>((acc, item) => {
    if (!item || typeof item !== "object") {
      return acc;
    }

    const block = item as Record<string, unknown>;
    let normalized: BlogBlock[] = [];

    switch (block._type) {
      case "intro": {
        const paragraphs = paragraphsFromPortableText(block.content);
        normalized = paragraphs.length ? [{ type: "intro", paragraphs } satisfies BlogBlock] : [];
        break;
      }
      case "textSection": {
        const content = plainTextFromPortableText(block.body);
        if (typeof block.title !== "string" || !content) {
          break;
        }
        normalized = [{ type: "section", title: block.title, content } satisfies BlogBlock];
        break;
      }
      case "faqBlock": {
        const items = normalizeFaqs(block.items);
        normalized = items.length ? [{ type: "faq", items } satisfies BlogBlock] : [];
        break;
      }
      case "ctaBlock": {
        if (
          typeof block.label !== "string" ||
          typeof block.href !== "string" ||
          typeof block.title !== "string" ||
          typeof block.accentLine !== "string"
        ) {
          break;
        }

        normalized = [
          {
            type: "cta",
            cta: {
              label: block.label,
              href: block.href,
              title: block.title,
              accentLine: block.accentLine
            }
          } satisfies BlogBlock
        ];
        break;
      }
      case "ctaBanner": {
        if (typeof block.headline !== "string" || typeof block.subheading !== "string") {
          break;
        }

        normalized = [
          {
            type: "ctaBanner",
            emoji: typeof block.emoji === "string" && block.emoji.trim() ? block.emoji : undefined,
            headline: block.headline,
            subheading: block.subheading,
            buttonLabel:
              typeof block.buttonLabel === "string" && block.buttonLabel.trim() ? block.buttonLabel : "→ Get My Free Match"
          } satisfies BlogBlock
        ];
        break;
      }
      case "relatedLinksBlock": {
        const links = normalizeRelatedLinks(block.links);
        normalized = links.length ? [{ type: "relatedLinks", links } satisfies BlogBlock] : [];
        break;
      }
      case "imageBlock": {
        const image = normalizeImage(block.image);
        if (!image) {
          break;
        }
        normalized = [
          {
            type: "image",
            image,
            caption: typeof block.caption === "string" ? block.caption : undefined
          } satisfies BlogBlock
        ];
        break;
      }
      case "quoteBlock": {
        if (typeof block.quote !== "string") {
          break;
        }
        normalized = [
          {
            type: "quote",
            quote: block.quote,
            attribution: typeof block.attribution === "string" ? block.attribution : undefined
          } satisfies BlogBlock
        ];
        break;
      }
      case "pullQuote": {
        if (typeof block.quote !== "string") {
          break;
        }
        normalized = [
          {
            type: "pullQuote",
            quote: block.quote,
            attribution: typeof block.attribution === "string" ? block.attribution : undefined
          } satisfies BlogBlock
        ];
        break;
      }
      case "checklistBlock": {
        const items = Array.isArray(block.items)
          ? block.items.map((entry) => (typeof entry === "string" ? entry.trim() : "")).filter(Boolean)
          : [];
        normalized = items.length
          ? [
              {
                type: "checklist",
                title: typeof block.title === "string" ? block.title : undefined,
                items
              } satisfies BlogBlock
            ]
          : [];
        break;
      }
      case "comparisonBlock": {
        const rows = Array.isArray(block.rows)
          ? block.rows
              .map((row) => {
                if (!row || typeof row !== "object") {
                  return null;
                }
                const candidate = row as { label?: unknown; value?: unknown };
                if (typeof candidate.label !== "string" || typeof candidate.value !== "string") {
                  return null;
                }
                  return { label: candidate.label, value: candidate.value };
              })
              .filter((row): row is { label: string; value: string } => Boolean(row))
          : [];
        normalized = rows.length
          ? [
              {
                type: "comparison",
                title: typeof block.title === "string" ? block.title : undefined,
                rows
              } satisfies BlogBlock
            ]
          : [];
        break;
      }
      case "highlightBlock": {
        const content = typeof block.content === "string" ? block.content.trim() : plainTextFromPortableText(block.content);
        normalized = content
          ? [
              {
                type: "highlight",
                title: typeof block.title === "string" ? block.title : undefined,
                content
              } satisfies BlogBlock
            ]
          : [];
        break;
      }
      default:
        break;
    }

    acc.push(...normalized);
    return acc;
  }, []);
}

function toSummary(post: BlogPostPageData): BlogPostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishDate: post.publishDate,
    topic: post.topic,
    searchIntent: post.searchIntent,
    featuredImage: post.featuredImage,
    readTimeMinutes: post.readTimeMinutes,
    authorName: post.authorName,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription
  };
}

function toSummaryRef(post: BlogPostPageData): BlogSummaryRef {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishDate: post.publishDate,
    topic: post.topic,
    searchIntent: post.searchIntent,
    featuredImage: post.featuredImage,
    readTimeMinutes: post.readTimeMinutes
  };
}

function mapSeededPost(post: any): BlogPostPageData {
  const cta: BlogCta = {
    label: post.cta.label,
    href: post.cta.href,
    title: post.cta.title,
    accentLine: post.cta.accentLine
  };

  const relatedLinks: BlogRelatedLink[] = post.relatedLinks.map((link: any) => ({
    label: link.label,
    href: link.href,
    description: link.description
  }));

  const bodyBlocks: BlogBlock[] = [
    {
      type: "intro",
      paragraphs: post.answerIntro
    },
    ...post.bodySections.map((section: any) => ({
      type: "section",
      title: section.title,
      content: section.content
    })),
    {
      type: "faq",
      items: post.faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer
      }))
    },
    {
      type: "relatedLinks",
      links: relatedLinks
    },
    {
      type: "cta",
      cta
    }
  ];

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishDate: post.publishDate,
    topic: post.topic,
    searchIntent: post.searchIntent,
    authorName: "ChiropracticMatch",
    seoTitle: `${post.title} | ChiropracticMatch Blog`,
    seoDescription: post.excerpt,
    featuredImage: null,
    bodyBlocks,
    readTimeMinutes: estimateReadTimeFromBlocks(bodyBlocks, post.excerpt),
    cta,
    relatedLinks,
    relatedPosts: []
  };
}

function mapSanityPost(post: any): BlogPostPageData | null {
  if (
    typeof post?.slug !== "string" ||
    typeof post.title !== "string" ||
    typeof post.excerpt !== "string" ||
    typeof post.publishDate !== "string" ||
    typeof post.topic !== "string" ||
    typeof post.searchIntent !== "string"
  ) {
    return null;
  }

  const bodyBlocks = normalizeBodyBlocks(post.bodyBlocks);
  const ctaBlock = bodyBlocks.find((block): block is Extract<BlogBlock, { type: "cta" }> => block.type === "cta");
  const relatedLinksBlock = bodyBlocks.find(
    (block): block is Extract<BlogBlock, { type: "relatedLinks" }> => block.type === "relatedLinks"
  );

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishDate: post.publishDate,
    topic: post.topic,
    searchIntent: post.searchIntent,
    authorName: typeof post.authorName === "string" && post.authorName.trim() ? post.authorName : "ChiropracticMatch",
    seoTitle:
      typeof post.seoTitle === "string" && post.seoTitle.trim()
        ? post.seoTitle
        : `${post.title} | ChiropracticMatch Blog`,
    seoDescription:
      typeof post.seoDescription === "string" && post.seoDescription.trim() ? post.seoDescription : post.excerpt,
    featuredImage: normalizeImage(post.featuredImage),
    bodyBlocks,
    readTimeMinutes: estimateReadTimeFromBlocks(bodyBlocks, post.excerpt),
    cta: ctaBlock?.cta ?? defaultCtaForVariant(post.ctaVariant),
    relatedLinks: relatedLinksBlock?.links ?? [],
    relatedPosts: Array.isArray(post.relatedPosts)
      ? post.relatedPosts
          .map((item: unknown) => normalizeSummaryRef(item))
          .filter((item: BlogSummaryRef | null): item is BlogSummaryRef => Boolean(item))
      : []
  };
}

function enrichRelatedPosts(posts: BlogPostPageData[]) {
  return posts.map((post) => {
    const explicit = post.relatedPosts.filter((item) => item.slug !== post.slug);

    if (explicit.length) {
      return {
        ...post,
        relatedPosts: explicit.slice(0, 4)
      };
    }

    const fallback = posts
      .filter((candidate) => candidate.slug !== post.slug)
      .sort((left, right) => {
        const leftScore = Number(left.topic === post.topic);
        const rightScore = Number(right.topic === post.topic);
        return rightScore - leftScore;
      })
      .slice(0, 4)
      .map(toSummaryRef);

    return {
      ...post,
      relatedPosts: fallback
    };
  });
}

async function loadBlogPosts(): Promise<BlogPostPageData[]> {
  if (!hasSanityConfig()) {
    console.warn("Blog loader: using seeded fallback because Sanity config is missing.");
    return enrichRelatedPosts(seededBlogPosts.map(mapSeededPost));
  }

  try {
    const client = getSanityClient();
    const posts = await client.fetch<unknown[]>(publishedPostsQuery);
    if (Array.isArray(posts) && posts[0] && typeof posts[0] === "object") {
      const first = posts[0] as Record<string, unknown>;
      console.warn("Blog loader: first Sanity post field types", {
        slug: typeof first.slug,
        title: typeof first.title,
        excerpt: typeof first.excerpt,
        publishDate: typeof first.publishDate,
        topic: typeof first.topic,
        searchIntent: typeof first.searchIntent
      });
    }
    const normalized = Array.isArray(posts)
      ? posts.map(mapSanityPost).filter((item): item is BlogPostPageData => Boolean(item))
      : [];

    if (!normalized.length) {
      console.warn("Blog loader: Sanity returned zero normalized posts, using seeded fallback.");
      return enrichRelatedPosts(seededBlogPosts.map(mapSeededPost));
    }

    console.warn(`Blog loader: using Sanity content (${normalized.length} posts). First post: ${normalized[0]?.title}`);
    return enrichRelatedPosts(normalized);
  } catch (error) {
    console.error("Unable to load blog posts from Sanity; falling back to seeded blog data.", error);
    return enrichRelatedPosts(seededBlogPosts.map(mapSeededPost));
  }
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const posts = await loadBlogPosts();
  return posts.map(toSummary);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostPageData | null> {
  const posts = await loadBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getBlogSlugs(): Promise<{ slug: string }[]> {
  const posts = await loadBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
