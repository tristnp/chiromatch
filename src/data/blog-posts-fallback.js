import { blogPosts as seededBlogPosts } from "./blog-posts-seeded.js";
import { evergreenBlogPosts } from "./blog-posts-evergreen.js";

const mergedPostsBySlug = new Map(seededBlogPosts.map((post) => [post.slug, post]));

for (const post of evergreenBlogPosts) {
  mergedPostsBySlug.set(post.slug, post);
}

export const blogPosts = Array.from(mergedPostsBySlug.values()).sort(
  (left, right) => new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime()
);

