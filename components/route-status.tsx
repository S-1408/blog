"use client";

import Link from "next/link";
import { useEffect } from "react";

export function RouteLoading({ kicker }: { kicker: string }) {
  return (
    <section className="not-found page-width route-status" aria-busy="true" aria-live="polite">
      <span className="section-kicker">{kicker}</span>
      <h1 className="route-status-pulse">Turning the<br /><em>pages…</em></h1>
      <p>Gathering the notes for you.</p>
    </section>
  );
}

export function RouteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="not-found page-width route-status" role="alert">
      <span className="section-kicker">Something went wrong</span>
      <h1>The notebook<br /><em>won&apos;t open.</em></h1>
      <p>We couldn&apos;t load this page just now. It&apos;s probably temporary, so try again in a moment.</p>
      <div className="route-status-actions">
        <button type="button" className="text-link text-link-button" onClick={() => retry()}>
          Try again <span aria-hidden="true">↻</span>
        </button>
        <Link href="/writing" className="text-link">Back to the journal <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
