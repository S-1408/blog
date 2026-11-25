import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found page-width">
      <span className="section-kicker">404 · A wrong turn</span>
      <h1>This page wandered<br /><em>off somewhere.</em></h1>
      <p>The note you&apos;re looking for might have moved, or maybe it never made it into the notebook.</p>
      <Link href="/writing" className="text-link">Back to the journal <span aria-hidden="true">→</span></Link>
    </section>
  );
}
