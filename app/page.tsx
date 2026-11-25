import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import PostExplorer from "@/components/post-explorer";
import { getPosts } from "@/lib/posts";

export default async function HomePage() {
  const posts = await getPosts();
  const featured = posts[0];

  return (
    <>
      <section className="hero-section page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A little corner of the internet</div>
          <h1>Notes on making<br />a <em>life.</em></h1>
          <p className="hero-description">
            Thoughts on creative work, thoughtful living, and finding a little more meaning in the everyday.
          </p>
          <a className="text-link hero-link" href="#writing">
            Explore the writing <ArrowDown size={15} strokeWidth={1.8} />
          </a>
        </div>
        <div className="hero-art" aria-label="Abstract illustration of a sun setting over rolling hills" role="img">
          <div className="art-sun" />
          <div className="art-hill art-hill-back" />
          <div className="art-hill art-hill-front" />
          <span className="art-caption">Somewhere, slowly</span>
          <span className="art-index">01 / 04</span>
        </div>
        <div className="hero-note">
          <span className="note-line" />
          <span>Written slowly, read whenever.</span>
        </div>
      </section>

      {featured && (
        <section className="featured-section page-width">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Start here</span>
              <h2>A recent thought</h2>
            </div>
            <span className="section-number">01 — A note to begin</span>
          </div>
          <Link className="featured-card" href={`/writing/${featured.slug}`}>
            <div className="featured-art">
              <div className="featured-orbit orbit-one" />
              <div className="featured-orbit orbit-two" />
              <div className="featured-center"><span>✳</span></div>
              <span className="featured-art-note">A study in paying attention</span>
            </div>
            <div className="featured-copy">
              <div className="post-meta">
                <span>{featured.category}</span><span className="meta-divider">·</span><time>{featured.date}</time>
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <div className="featured-bottom">
                <span className="text-link">Read the story <ArrowRight size={15} /></span>
                <span>{featured.readingTime} min read</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section id="writing" className="writing-section page-width">
        <div className="section-heading writing-heading">
          <div>
            <span className="section-kicker">The journal</span>
            <h2>Things I&apos;ve been thinking about</h2>
          </div>
          <Link href="/writing" className="text-link all-writing-link">All writing <ArrowUpRight size={15} /></Link>
        </div>
        <PostExplorer posts={posts} compact />
      </section>

      <section className="about-strip">
        <div className="about-inner page-width">
          <span className="about-label">A note from the author</span>
          <div className="about-content">
            <p>I&apos;m Alex — writer, curious person, and collector of half-finished notebooks. This is where the loose threads come together.</p>
            <Link href="/about" className="text-link">A little more about me <ArrowRight size={15} /></Link>
          </div>
          <div className="about-stamp" aria-hidden="true">A<br />✳<br />L</div>
        </div>
      </section>
    </>
  );
}
