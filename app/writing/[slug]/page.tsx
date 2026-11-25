import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/posts";
import { contactEmail } from "@/lib/site-config";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

// Posts published after the build are rendered on first request, then cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.isoDate,
      authors: [post.author.name],
      tags: [post.category],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const otherPosts = await getRelatedPosts(post.slug, 2);

  return (
    <article className="article-page">
      <header className="article-header page-width">
        <Link href="/writing" className="back-link"><ArrowLeft size={15} /> All writing</Link>
        <div className="post-meta article-meta">
          <span>{post.category}</span><span className="meta-divider">·</span><time dateTime={post.isoDate}>{post.date}</time><span className="meta-divider">·</span><span>{post.readingTime} min read</span>
        </div>
        <h1>{post.title}</h1>
        <p className="article-deck">{post.description}</p>
        <div className="article-byline">
          <div className="author-avatar" aria-hidden="true">{post.author.name.charAt(0)}</div>
          <div><strong>{post.author.name}</strong><span>Writer of Fieldnotes</span></div>
        </div>
      </header>
      <div className="article-art page-width">
        <div className="article-art-sun" />
        <div className="article-art-hill article-art-hill-one" />
        <div className="article-art-hill article-art-hill-two" />
        <span>{post.category} / FIELDNOTE NO. {String(post.number).padStart(2, "0")}</span>
      </div>
      <div className="article-content-wrap">
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        <aside className="article-signoff">
          <span className="signoff-mark">✳</span>
          <p>Thanks for spending a little time here.</p>
          {contactEmail && <a href={`mailto:${contactEmail}`} className="text-link">Say hello <ArrowUpRight size={14} /></a>}
        </aside>
      </div>
      <section className="more-writing page-width">
        <div className="section-heading">
          <div><span className="section-kicker">Keep wandering</span><h2>A couple more notes</h2></div>
          <Link href="/writing" className="text-link">All writing <ArrowUpRight size={15} /></Link>
        </div>
        <div className="more-writing-grid">
          {otherPosts.map((item) => (
            <Link className="more-post" href={`/writing/${item.slug}`} key={item.slug}>
              <span className="section-kicker">{item.category} · {item.readingTime} min</span>
              <h3>{item.title}</h3>
              <span className="text-link">Read note <ArrowRightIcon /></span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

function ArrowRightIcon() {
  return <ArrowUpRight size={14} />;
}
