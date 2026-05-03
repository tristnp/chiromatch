import Image from "next/image";
import Link from "next/link";
import { citySeoRecords } from "@/data/city-seo-records";
import { BlogLeadForm } from "@/components/BlogLeadForm";
import type { BlogBlock, BlogCta, BlogFaq, BlogImage, BlogPostPageData, BlogPostSummary, BlogSummaryRef } from "@/types/blog";

const topicOrder = [
  "Symptoms",
  "Timing",
  "Insurance",
  "Choosing care",
  "Appointments",
  "Starting point",
  "Logistics",
  "Decision"
];

const blogCityLinkSlugs = [
  "houston-tx",
  "dallas-tx",
  "austin-tx",
  "denver-co",
  "atlanta-ga",
  "phoenix-az",
  "los-angeles-ca",
  "san-diego-ca",
  "chicago-il",
  "miami-fl",
  "seattle-wa",
  "las-vegas-nv",
  "nashville-tn",
  "portland-or",
  "sacramento-ca"
];

const topicStyles: Record<
  string,
  { accent: string; panel: string; chip: string; icon: string; kicker: string }
> = {
  Symptoms: {
    accent: "from-[#58b7dd] to-[#8fd6ef]",
    panel: "bg-[#f2fbff]",
    chip: "bg-[#dff4fd] text-[#2b9ac6]",
    icon: "✦",
    kicker: "Symptom guide"
  },
  Timing: {
    accent: "from-[#7cb7ff] to-[#bdd8ff]",
    panel: "bg-[#f5f9ff]",
    chip: "bg-[#e7f0ff] text-[#4d79cc]",
    icon: "◷",
    kicker: "Timing"
  },
  Insurance: {
    accent: "from-[#7fd1ee] to-[#c6eef8]",
    panel: "bg-[#f1fbff]",
    chip: "bg-[#dff4fd] text-[#2b9ac6]",
    icon: "$",
    kicker: "Insurance"
  },
  "Choosing care": {
    accent: "from-[#f2a638] to-[#f8c972]",
    panel: "bg-[#fff9ef]",
    chip: "bg-[#fff1d1] text-[#b97716]",
    icon: "→",
    kicker: "Finding care"
  },
  Appointments: {
    accent: "from-[#7fd1ee] to-[#d5f5ff]",
    panel: "bg-[#f4fbff]",
    chip: "bg-[#e4f7ff] text-[#2b9ac6]",
    icon: "□",
    kicker: "First visit"
  },
  "Starting point": {
    accent: "from-[#5f90ff] to-[#9dc0ff]",
    panel: "bg-[#f3f7ff]",
    chip: "bg-[#e7efff] text-[#4365b5]",
    icon: "◎",
    kicker: "Starting point"
  },
  Logistics: {
    accent: "from-[#8acac4] to-[#cfeeea]",
    panel: "bg-[#f3fcfb]",
    chip: "bg-[#e3f7f5] text-[#2d8d86]",
    icon: "≡",
    kicker: "Practical details"
  },
  Decision: {
    accent: "from-[#ffb37a] to-[#ffd6b8]",
    panel: "bg-[#fff8f3]",
    chip: "bg-[#ffe8d8] text-[#bd6f2c]",
    icon: "?",
    kicker: "Decision guide"
  }
};

function getTopicStyle(topic: string) {
  return (
    topicStyles[topic] ?? {
      accent: "from-[#58b7dd] to-[#a7e0f4]",
      panel: "bg-[#f4fbff]",
      chip: "bg-[#e3f7ff] text-[#2b9ac6]",
      icon: "•",
      kicker: "Guide"
    }
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

function topicAnchor(topic: string) {
  return topic
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function groupPosts(posts: BlogPostSummary[]) {
  const grouped = posts.reduce<Record<string, BlogPostSummary[]>>((acc, post) => {
    if (!acc[post.topic]) {
      acc[post.topic] = [];
    }

    acc[post.topic].push(post);
    return acc;
  }, {});

  return topicOrder.filter((topic) => grouped[topic]?.length).map((topic) => ({
    topic,
    posts: grouped[topic]
  }));
}

function getRelatedPosts(posts: BlogPostSummary[], currentPost: BlogPostPageData) {
  if (currentPost.relatedPosts.length) {
    return currentPost.relatedPosts.slice(0, 4);
  }

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .sort((left, right) => Number(right.topic === currentPost.topic) - Number(left.topic === currentPost.topic))
    .slice(0, 4)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishDate: post.publishDate,
      topic: post.topic,
      searchIntent: post.searchIntent,
      featuredImage: post.featuredImage
    }));
}

function getIntroParagraphs(post: BlogPostPageData) {
  return post.bodyBlocks
    .filter((block): block is Extract<BlogBlock, { type: "intro" }> => block.type === "intro")
    .flatMap((block) => block.paragraphs);
}

function getFaqs(post: BlogPostPageData): BlogFaq[] {
  return post.bodyBlocks
    .filter((block): block is Extract<BlogBlock, { type: "faq" }> => block.type === "faq")
    .flatMap((block) => block.items);
}

function getCta(post: BlogPostPageData): BlogCta {
  return (
    post.bodyBlocks.find((block): block is Extract<BlogBlock, { type: "cta" }> => block.type === "cta")?.cta ?? post.cta
  );
}

function getRelatedLinks(post: BlogPostPageData) {
  return (
    post.bodyBlocks.find(
      (block): block is Extract<BlogBlock, { type: "relatedLinks" }> => block.type === "relatedLinks"
    )?.links ?? post.relatedLinks
  );
}

function getArticleBlocks(post: BlogPostPageData) {
  return post.bodyBlocks.filter((block) =>
    ["section", "image", "quote", "pullQuote", "ctaBanner", "checklist", "comparison", "highlight"].includes(block.type)
  );
}

function getNavigableSections(post: BlogPostPageData) {
  return getArticleBlocks(post)
    .flatMap((block) => {
      switch (block.type) {
        case "section":
          return [{ label: block.title, anchor: topicAnchor(block.title) }];
        case "checklist":
          return block.title ? [{ label: block.title, anchor: topicAnchor(block.title) }] : [];
        case "comparison":
          return block.title ? [{ label: block.title, anchor: topicAnchor(block.title) }] : [];
        case "highlight":
          return block.title ? [{ label: block.title, anchor: topicAnchor(block.title) }] : [];
        default:
          return [];
      }
    })
    .slice(0, 8);
}

const blogCityLinks = blogCityLinkSlugs
  .map((slug) => citySeoRecords.find((record) => record.slug === slug))
  .filter((record): record is (typeof citySeoRecords)[number] => Boolean(record))
  .map((record) => ({
    slug: record.slug,
    label: `${record.city} ${record.stateCode}`
  }));

function BlogImageFrame({
  image,
  className,
  priority = false
}: {
  image: BlogImage;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`blog-image-frame ${className ?? ""}`}>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="blog-image-frame__image"
        priority={priority}
      />
    </div>
  );
}

function BlogCardImage({ image, featured }: { image?: BlogImage | null; featured?: boolean }) {
  if (!image) {
    return null;
  }

  return (
    <div className={`blog-card__image-wrap ${featured ? "blog-card__image-wrap--featured" : ""}`}>
      <BlogImageFrame image={image} className="blog-card__image-frame" priority={featured} />
    </div>
  );
}

function renderArticleBlock(block: BlogBlock) {
  switch (block.type) {
    case "section":
      return (
        <section key={block.title} id={topicAnchor(block.title)} className="blog-article-section">
          <h2>{block.title}</h2>
          <p>{block.content}</p>
        </section>
      );
    case "image":
      return (
        <figure key={block.image.url} className="blog-inline-image">
          <BlogImageFrame image={block.image} className="blog-inline-image__frame" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    case "quote":
      return (
        <blockquote key={block.quote} className="blog-quote-block">
          <p>{block.quote}</p>
          {block.attribution ? <footer>{block.attribution}</footer> : null}
        </blockquote>
      );
    case "pullQuote":
      return (
        <blockquote key={`${block.quote}-${block.attribution ?? ""}`} className="blog-pull-quote">
          <p>{block.quote}</p>
          {block.attribution ? <footer>{block.attribution}</footer> : null}
        </blockquote>
      );
    case "ctaBanner":
      return (
        <section key={`${block.headline}-${block.subheading}`} className="blog-inline-cta">
          <div className="blog-inline-cta__icon" aria-hidden="true">
            {block.emoji ?? "✦"}
          </div>
          <div className="blog-inline-cta__copy">
            <p className="blog-inline-cta__headline">{block.headline}</p>
            <p className="blog-inline-cta__subheading">{block.subheading}</p>
          </div>
          <a href="#blog-match-form" className="button-primary blog-inline-cta__button">
            {block.buttonLabel}
          </a>
        </section>
      );
    case "checklist":
      return (
        <section
          key={`${block.title ?? "checklist"}-${block.items.join("|")}`}
          id={block.title ? topicAnchor(block.title) : undefined}
          className="blog-structured-block"
        >
          {block.title ? <h2>{block.title}</h2> : null}
          <ul className="blog-checklist">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      );
    case "comparison":
      return (
        <section
          key={`${block.title ?? "comparison"}-${block.rows.map((row) => row.label).join("|")}`}
          id={block.title ? topicAnchor(block.title) : undefined}
          className="blog-structured-block"
        >
          {block.title ? <h2>{block.title}</h2> : null}
          <div className="blog-comparison">
            {block.rows.map((row) => (
              <div key={row.label} className="blog-comparison__row">
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </section>
      );
    case "highlight":
      return (
        <section
          key={`${block.title ?? "highlight"}-${block.content}`}
          id={block.title ? topicAnchor(block.title) : undefined}
          className="blog-highlight"
        >
          {block.title ? <h2>{block.title}</h2> : null}
          <p>{block.content}</p>
        </section>
      );
    default:
      return null;
  }
}

export function BlogArticlePage({ post, posts }: { post: BlogPostPageData; posts: BlogPostSummary[] }) {
  const relatedPosts = getRelatedPosts(posts, post);
  const style = getTopicStyle(post.topic);
  const introParagraphs = getIntroParagraphs(post);
  const faqs = getFaqs(post);
  const cta = getCta(post);
  const nextLinks = getRelatedLinks(post);
  const articleBlocks = getArticleBlocks(post);
  const navigableSections = getNavigableSections(post);

  return (
    <main>
      <section className="motion-fade bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="blog-article-shell">
            <div className="blog-article-main">
              <div className="blog-article-hero">
                <div className={`blog-article-hero__panel bg-gradient-to-br ${style.accent}`}>
                  {post.featuredImage ? <BlogImageFrame image={post.featuredImage} className="blog-article-hero__image" priority /> : null}
                  <div className="blog-article-hero__meta">
                    <span className={`blog-card__chip ${style.chip}`}>{post.topic}</span>
                    <span className="blog-card__date">{formatDate(post.publishDate)}</span>
                  </div>
                  <p className="blog-article-hero__kicker">{style.kicker}</p>
                  <h1 className="blog-article-hero__title">{post.title}</h1>
                  <p className="blog-article-hero__excerpt">{post.excerpt}</p>
                  <div className="blog-article-hero__intent">{post.searchIntent}</div>
                </div>
              </div>

              <article className="blog-article-body">
                {introParagraphs.length ? (
                  <section className="blog-prose">
                    {introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ) : null}

                {navigableSections.length ? (
                  <div className="blog-article-jump">
                    <p className="blog-article-jump__eyebrow">Jump to a section</p>
                    <div className="blog-article-jump__links">
                      {navigableSections.map((section) => (
                        <a key={section.anchor} href={`#${section.anchor}`}>
                          {section.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                <section className="blog-prose">{articleBlocks.map((block) => renderArticleBlock(block))}</section>

                <section className="blog-reading-panel">
                  <div className="blog-section-heading">
                    <div>
                      <p className="blog-section-heading__kicker">Related reading</p>
                      <h2 className="blog-section-heading__title">Keep reading without losing the thread</h2>
                    </div>
                  </div>
                  <div className="blog-topic-grid">
                    {relatedPosts.map((relatedPost: BlogSummaryRef) => {
                      const relatedStyle = getTopicStyle(relatedPost.topic);
                      return (
                        <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="blog-card">
                          <div className={`blog-card__mini-banner bg-gradient-to-r ${relatedStyle.accent}`} />
                          <BlogCardImage image={relatedPost.featuredImage} />
                          <div className="blog-card__body">
                            <div className="blog-card__topline">
                              <span className={`blog-card__chip ${relatedStyle.chip}`}>{relatedPost.topic}</span>
                              <span className="blog-card__date">{formatDate(relatedPost.publishDate)}</span>
                            </div>
                            <h3 className="blog-card__title">{relatedPost.title}</h3>
                            <p className="blog-card__excerpt">{relatedPost.excerpt}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>

                <section className="blog-next-steps">
                  <div className="blog-section-heading">
                    <div>
                      <p className="blog-section-heading__kicker">Next steps</p>
                      <h2 className="blog-section-heading__title">Use the page that fits what you need now</h2>
                    </div>
                  </div>
                  <div className="blog-next-steps__grid">
                    {nextLinks.map((link) => (
                      <Link key={link.href + link.label} href={link.href} className="blog-next-steps__card">
                        <p className="blog-next-steps__title">{link.label}</p>
                        <p className="blog-next-steps__description">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>

                {faqs.length ? (
                  <section className="blog-faq-panel">
                    <div className="blog-section-heading">
                      <div>
                        <p className="blog-section-heading__kicker">FAQ</p>
                        <h2 className="blog-section-heading__title">Questions people usually ask next</h2>
                      </div>
                    </div>
                    <div className="blog-faq-grid">
                      {faqs.map((item) => (
                        <details key={item.question} className="blog-faq-card">
                          <summary>
                            <span>{item.question}</span>
                            <span className="blog-faq-card__icon">+</span>
                          </summary>
                          <p>{item.answer}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="blog-cta">
                  <div className="blog-cta__inner">
                    <p className="blog-cta__eyebrow">Ready when you are</p>
                    <h2 className="blog-cta__title">
                      {cta.title}
                      <br />
                      <span>{cta.accentLine}</span>
                    </h2>
                    <p className="blog-cta__description">{post.excerpt}</p>
                    <Link href={cta.href} className="button-primary">
                      {cta.label}
                    </Link>
                  </div>
                </section>

                <section className="blog-city-links">
                  <div className="blog-city-links__inner">
                    <div className="blog-section-heading blog-section-heading--inverse">
                      <div>
                        <p className="blog-section-heading__kicker">Near you</p>
                        <h2 className="blog-section-heading__title">Find a Chiropractor Near You</h2>
                      </div>
                    </div>
                    <div className="blog-city-links__grid">
                      {blogCityLinks.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/chiropractor-after-car-accident/${city.slug}`}
                          className="blog-city-links__pill"
                        >
                          {city.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              </article>
            </div>

            <aside className="blog-article-sidebar">
              <BlogLeadForm pageSource={`/blog/${post.slug}`} />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
