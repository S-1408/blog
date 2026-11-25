import type { Metadata } from "next";
import PostExplorer from "@/components/post-explorer";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Browse notes on creative work, thoughtful living, and finding meaning in the everyday.",
};

export default async function WritingPage() {
  const posts = await getPosts();

  return (
    <section className="archive-section page-width">
      <div className="archive-intro">
        <span className="section-kicker">The journal · {posts.length} notes</span>
        <h1>Words for the<br /><em>in-between.</em></h1>
        <p>A growing collection of thoughts, questions, and things worth remembering.</p>
      </div>
      <PostExplorer posts={posts} />
    </section>
  );
}
