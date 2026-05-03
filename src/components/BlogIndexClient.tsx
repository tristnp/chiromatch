"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPostSummary, BlogTopic } from "@/types/blog";

const topicOrder: BlogTopic[] = [
  "Symptoms",
  "Insurance",
  "Timing",
  "Choosing care",
  "Appointments",
  "Starting point",
  "Logistics",
  "Decision"
];

const curatedFeaturedSlugs = [
  "can-whiplash-symptoms-start-next-day",
  "does-insurance-cover-chiropractic-care-after-car-accident",
  "how-soon-see-chiropractor-after-car-accident"
];

const curatedMostReadSlugs = [
  "can-whiplash-symptoms-start-next-day",
  "does-insurance-cover-chiropractic-care-after-car-accident",
  "how-soon-see-chiropractor-after-car-accident",
  "what-to-do-neck-hurts-after-car-accident",
  "what-to-expect-at-first-chiropractic-visit-after-collision"
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

function getTopicAccent(topic: string) {
  switch (topic) {
    case "Symptoms":
      return "Symptoms";
    case "Insurance":
      return "Insurance";
    case "Timing":
      return "Timing";
    case "Choosing care":
      return "Choosing Care";
    case "Appointments":
      return "Appointments";
    default:
      return topic;
  }
}

function pickPosts(posts: BlogPostSummary[], preferredSlugs: string[], count: number) {
  const preferred = preferredSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is BlogPostSummary => Boolean(post));

  const fallback = posts.filter((post) => !preferred.some((item) => item.slug === post.slug));
  return [...preferred, ...fallback].slice(0, count);
}

function searchMatches(post: BlogPostSummary, query: string) {
  const haystack = `${post.title} ${post.excerpt} ${post.topic}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function getDistinctStackReadTimes(posts: BlogPostSummary[]) {
  const used = new Set<number>();

  return posts.map((post, index) => {
    const base = Math.max(4, post.readTimeMinutes ?? 5);
    const slugScore = post.slug.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
    let candidate = Math.max(4, base + ((slugScore + index) % 3) - 1);

    while (used.has(candidate)) {
      candidate += 1;
    }

    used.add(candidate);
    return candidate;
  });
}

export function BlogIndexClient({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("All guides");
  const trimmedQuery = query.trim();
  const contentMotionKey = `${activeTopic}::${trimmedQuery || "all"}`;

  const featuredPosts = useMemo(() => pickPosts(posts, curatedFeaturedSlugs, 3), [posts]);
  const mostReadPosts = useMemo(() => pickPosts(posts, curatedMostReadSlugs, 5), [posts]);
  const stackReadTimes = useMemo(() => getDistinctStackReadTimes(featuredPosts), [featuredPosts]);

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.topic, (counts.get(post.topic) ?? 0) + 1);
    }
    return counts;
  }, [posts]);

  const visibleTopics = useMemo(
    () => topicOrder.filter((topic) => (topicCounts.get(topic) ?? 0) > 0),
    [topicCounts]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const queryMatch = trimmedQuery ? searchMatches(post, trimmedQuery) : true;
      const topicMatch = activeTopic === "All guides" ? true : post.topic === activeTopic;
      return queryMatch && topicMatch;
    });
  }, [posts, trimmedQuery, activeTopic]);

  const showFeaturedBlock = activeTopic === "All guides" && !trimmedQuery;
  const sectionTitle = activeTopic === "All guides" ? "All Guides" : getTopicAccent(activeTopic);

  const gridPosts = filteredPosts.filter((post) => !featuredPosts.some((featured) => featured.slug === post.slug));

  return (
    <main>
      <section className="motion-fade bg-[#f6f9fd] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="blog-home">
            <section className="blog-home__hero">
              <div className="blog-home__hero-copy">
                <p className="section-eyebrow">Patient guides</p>
                <h1 className="blog-home__title">
                  Clear answers after
                  <br />
                  a <span>car accident.</span>
                </h1>
                <p className="blog-home__description">
                  Practical guides on symptoms, insurance, timing, and how to find the right chiropractor — written for real
                  patients, not lawyers.
                </p>

                <label className="blog-home__search" aria-label="Search blog articles">
                  <span className="blog-home__search-icon" aria-hidden="true">
                    ⌕
                  </span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search articles, e.g. 'whiplash', 'insurance'..."
                  />
                </label>

                <div className="blog-home__topic-chips">
                  <button
                    type="button"
                    onClick={() => setActiveTopic("All guides")}
                    className={`blog-home__topic-chip ${activeTopic === "All guides" ? "is-active" : ""}`}
                  >
                    All guides <span>{posts.length}</span>
                  </button>
                  {visibleTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setActiveTopic(topic)}
                      className={`blog-home__topic-chip ${activeTopic === topic ? "is-active" : ""}`}
                    >
                      {topic} <span>{topicCounts.get(topic) ?? 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="blog-home__hero-stack" aria-hidden="true">
                {featuredPosts.map((post, index) => (
                  <article key={post.slug} className={`blog-home__stack-card blog-home__stack-card--${index + 1}`}>
                    <p className="blog-home__stack-topic">{post.topic}</p>
                    <h2 className="blog-home__stack-title">{post.title}</h2>
                    <p className="blog-home__stack-excerpt">{post.excerpt}</p>
                    <div className="blog-home__stack-meta">
                      <span>{stackReadTimes[index] ?? post.readTimeMinutes ?? 5} min read</span>
                      <span>Read →</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="blog-home__content">
              <div className="blog-home__main">
                {featuredPosts[0] ? (
                  <div className={`blog-home__featured-shell ${showFeaturedBlock ? "is-visible" : "is-hidden"}`}>
                    <article className="blog-home__featured">
                      <div className="blog-home__featured-visual">
                        <span className="blog-home__featured-badge">Editor&apos;s Pick</span>
                      </div>
                      <div className="blog-home__featured-copy">
                        <p className="blog-home__featured-topic">{getTopicAccent(featuredPosts[0].topic)}</p>
                        <h2>{featuredPosts[0].title}</h2>
                        <p>{featuredPosts[0].excerpt}</p>
                        <div className="blog-home__featured-meta">
                          <span>{featuredPosts[0].readTimeMinutes ?? 5} min read</span>
                          <span>{featuredPosts[0].topic}</span>
                        </div>
                        <Link href={`/blog/${featuredPosts[0].slug}`} className="blog-home__featured-link">
                          Read guide →
                        </Link>
                      </div>
                    </article>
                  </div>
                ) : null}

                <div className="blog-home__section-head">
                  <h2>{sectionTitle}</h2>
                  <p key={contentMotionKey} className="blog-home__section-count motion-fade">
                    {trimmedQuery || activeTopic !== "All guides" ? `${filteredPosts.length} matching articles` : `${posts.length} articles`}
                  </p>
                </div>

                <div key={contentMotionKey} className="blog-home__grid blog-home__grid--animated">
                  {gridPosts.map((post, index) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="blog-home__card"
                      style={{ animationDelay: `${Math.min(index, 7) * 45}ms` }}
                    >
                      <p className="blog-home__card-topic">{getTopicAccent(post.topic)}</p>
                      <h3>{post.title}</h3>
                      <p className="blog-home__card-excerpt">{post.excerpt}</p>
                      <div className="blog-home__card-footer">
                        <span>{post.readTimeMinutes ?? 5} min</span>
                        <span className="blog-home__card-arrow">→</span>
                      </div>
                    </Link>
                  ))}
                </div>

              </div>

              <aside className="blog-home__rail">
                <section className="blog-home__rail-cta">
                  <h2>
                    Ready to find a <span>chiropractor near you?</span>
                  </h2>
                  <p>We&apos;ll match you with an accident specialist in your area within 24 hours — at no cost to you.</p>
                  <Link href="/#match-form" className="button-primary blog-home__rail-cta-button">
                    Get Matched Free
                  </Link>
                  <p className="blog-home__rail-note">Free · Confidential · No obligation</p>
                </section>

                <section className="blog-home__rail-panel">
                  <p className="blog-home__rail-label">Most Read</p>
                  <div className="blog-home__most-read">
                    {mostReadPosts.map((post, index) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-home__most-read-item">
                        <span className="blog-home__most-read-rank">{String(index + 1).padStart(2, "0")}</span>
                        <span className="blog-home__most-read-copy">
                          <strong>{post.title}</strong>
                          <span>{post.topic}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="blog-home__rail-panel">
                  <p className="blog-home__rail-label">Browse by Topic</p>
                  <div className="blog-home__rail-topics">
                    {visibleTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setActiveTopic(topic)}
                        className={`blog-home__rail-topic ${activeTopic === topic ? "is-active" : ""}`}
                      >
                        {topic} <span>{topicCounts.get(topic) ?? 0}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </aside>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
