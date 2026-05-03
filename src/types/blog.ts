export type BlogTopic =
  | "Symptoms"
  | "Timing"
  | "Insurance"
  | "Choosing care"
  | "Appointments"
  | "Starting point"
  | "Logistics"
  | "Decision"
  | string;

export type BlogCta = {
  label: string;
  href: string;
  title: string;
  accentLine: string;
};

export type BlogRelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type BlogSummaryRef = {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string;
  topic: BlogTopic;
  searchIntent: string;
  featuredImage?: BlogImage | null;
  readTimeMinutes?: number;
};

export type BlogBlock =
  | { type: "intro"; paragraphs: string[] }
  | { type: "section"; title: string; content: string }
  | { type: "faq"; items: BlogFaq[] }
  | { type: "cta"; cta: BlogCta }
  | { type: "ctaBanner"; emoji?: string; headline: string; subheading: string; buttonLabel: string }
  | { type: "relatedLinks"; links: BlogRelatedLink[] }
  | { type: "image"; image: BlogImage; caption?: string }
  | { type: "quote"; quote: string; attribution?: string }
  | { type: "pullQuote"; quote: string; attribution?: string }
  | { type: "checklist"; title?: string; items: string[] }
  | { type: "comparison"; title?: string; rows: { label: string; value: string }[] }
  | { type: "highlight"; title?: string; content: string };

export type BlogPostSummary = BlogSummaryRef & {
  authorName: string;
  seoTitle: string;
  seoDescription: string;
};

export type BlogPostPageData = BlogPostSummary & {
  bodyBlocks: BlogBlock[];
  cta: BlogCta;
  relatedLinks: BlogRelatedLink[];
  relatedPosts: BlogSummaryRef[];
};
