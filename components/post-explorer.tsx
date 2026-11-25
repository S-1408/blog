"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { PostSummary } from "@/lib/contracts";

export default function PostExplorer({ posts, compact = false }: { posts: PostSummary[]; compact?: boolean }) {
  const [activeCategory, setActiveCategory] = useState("All notes");
  const [query, setQuery] = useState("");
  const categories = useMemo(
    () => ["All notes", ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === "All notes" || post.category === activeCategory;
      const matchesSearch =
        !normalizedQuery ||
        `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, posts, query]);

  return (
    <div className={`post-explorer${compact ? " post-explorer-compact" : ""}`}>
      <div className="explorer-controls">
        <div className="category-tabs" role="group" aria-label="Filter by category">
          {categories.map((category) => (
            <button key={category} aria-pressed={activeCategory === category} className={activeCategory === category ? "category-active" : ""} onClick={() => setActiveCategory(category)} type="button">
              {category}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {filteredPosts.length} {filteredPosts.length === 1 ? "note" : "notes"} found
        </p>
        {!compact && (
          <label className="search-field">
            <Search size={15} aria-hidden="true" />
            <input aria-label="Search writing" onChange={(event) => setQuery(event.target.value)} placeholder="Find a note..." value={query} />
            {query && <button aria-label="Clear search" onClick={() => setQuery("")} type="button"><X size={14} /></button>}
          </label>
        )}
      </div>
      {filteredPosts.length > 0 ? (
        <div className="post-grid">
          {filteredPosts.slice(0, compact ? 3 : undefined).map((post, index) => (
            <Link className={`post-card post-card-tone-${(index % 3) + 1}`} href={`/writing/${post.slug}`} key={post.slug}>
              <div className="post-card-art" aria-hidden="true">
                <span className="post-art-shape post-art-shape-one" />
                <span className="post-art-shape post-art-shape-two" />
                <span className="post-art-mark">{index % 3 === 1 ? "◌" : index % 3 === 2 ? "⌁" : "✳"}</span>
                <span className="post-art-index">Nº {String(post.number).padStart(2, "0")}</span>
              </div>
              <div className="post-card-body">
                <div className="post-meta">
                  <span>{post.category}</span><span className="meta-divider">·</span><time dateTime={post.isoDate}>{post.date}</time>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div className="post-card-bottom">
                  <span>{post.readingTime} min read</span><span className="post-arrow"><ArrowRight size={16} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-search">
          <span>Nothing in the notebook just yet.</span>
          <button type="button" onClick={() => { setActiveCategory("All notes"); setQuery(""); }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
