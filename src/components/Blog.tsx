import Link from "next/link";
import { ActionBand } from "@/components/Sections";

type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  topic: string;
  searchIntent: string;
  answerIntro: string[];
  bodySections: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  cta: {
    label: string;
    href: string;
    title: string;
    accentLine: string;
  };
  relatedLinks: {
    label: string;
    href: string;
    description: string;
  }[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function BlogIndexPage({ posts }: { posts: BlogPost[] }) {
  const featured = posts.slice(0, 3);
  const archive = posts.slice(3);

  return (
    <main>
      <section className="motion-fade bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Patient guides</p>
            <h1 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.03em] text-[#12203f] sm:text-[4rem]">
              Clear answers after a car accident
            </h1>
            <p className="mt-6 text-[1.15rem] leading-8 text-[#536986]">
              Browse practical articles about soreness, whiplash, timing, insurance questions, and how to find the right chiropractor after a crash.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featured.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="surface-card flex flex-col p-7">
                <p className="text-sm font-black uppercase tracking-[0.08em] text-[#58b7dd]">{post.topic}</p>
                <h2 className="mt-4 text-[1.9rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">{post.title}</h2>
                <p className="mt-4 text-base leading-7 text-[#536986]">{post.excerpt}</p>
                <div className="mt-auto pt-6 text-sm font-semibold text-[#7a90aa]">{formatDate(post.publishDate)}</div>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {archive.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="surface-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-[#58b7dd]">{post.topic}</p>
                  <p className="text-sm font-semibold text-[#8da1bc]">{formatDate(post.publishDate)}</p>
                </div>
                <h2 className="mt-4 text-[1.45rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">{post.title}</h2>
                <p className="mt-4 text-[1rem] leading-7 text-[#536986]">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ActionBand
        title="Still not sure where to start?"
        accentLine="Request a match today."
        description="Use the same clear next step the rest of the site offers: request a local chiropractor match after your accident."
      />
    </main>
  );
}

export function BlogArticlePage({ post }: { post: BlogPost }) {
  return (
    <main>
      <section className="motion-fade bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="trust-pill">
              <span className="accent-dot" />
              {post.topic}
            </div>
            <nav className="mt-8 text-sm font-semibold text-[#8da1bc]">
              <Link href="/">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-[#536986]">{post.title}</span>
            </nav>
            <h1 className="mt-6 text-[3rem] font-black leading-[0.96] tracking-[-0.03em] text-[#12203f] sm:text-[4rem]">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#8da1bc]">
              <span>{formatDate(post.publishDate)}</span>
              <span>•</span>
              <span>{post.searchIntent}</span>
            </div>
            <p className="mt-8 text-[1.18rem] leading-8 text-[#536986]">{post.excerpt}</p>
          </div>

          <article className="blog-prose mt-12 max-w-4xl">
            {post.answerIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {post.bodySections.map((item) => (
              <section key={item.title} className="mt-10">
                <h2>{item.title}</h2>
                <p>{item.content}</p>
              </section>
            ))}
          </article>

          <section className="mt-14">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Related next steps</p>
              <h2 className="mt-4 text-[2.25rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">
                Keep moving with the right page
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {post.relatedLinks.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="surface-card p-6">
                  <p className="text-[1.15rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">{link.label}</p>
                  <p className="mt-3 text-sm leading-7 text-[#536986]">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <div className="max-w-3xl">
              <p className="section-eyebrow">FAQ</p>
              <h2 className="mt-4 text-[2.25rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">
                Questions people usually ask next
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {post.faqs.map((item, index) => (
                <details key={item.question} className={`surface-card p-0 ${index % 2 ? "motion-delay-1" : ""}`}>
                  <summary className="flex cursor-pointer items-start justify-between gap-4 p-6 text-left">
                    <span className="text-[1.2rem] font-black leading-tight tracking-[-0.03em] text-[#12203f]">{item.question}</span>
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#edf8fd] text-[#58b7dd]">
                      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-base leading-7 text-[#536986]">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>

      <ActionBand title={post.cta.title} accentLine={post.cta.accentLine} description={post.excerpt} primaryHref={post.cta.href} primaryLabel={post.cta.label} />
    </main>
  );
}
