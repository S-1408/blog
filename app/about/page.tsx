import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { contactEmail } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "A little about Alex, the writer behind Fieldnotes.",
};

export default function AboutPage() {
  return (
    <section className="about-page page-width">
      <div className="about-page-aside">
        <div className="about-portrait" aria-label="Abstract portrait illustration" role="img">
          <div className="portrait-sun" /><div className="portrait-shape" /><span>A.</span>
        </div>
        <span className="section-kicker">A face behind the notes</span>
      </div>
      <div className="about-page-copy">
        <span className="section-kicker">A little about me</span>
        <h1>Hello, I&apos;m Alex.<br /><em>Glad you&apos;re here.</em></h1>
        <p className="about-lead">I&apos;m a writer and curious person who believes the ordinary deserves a closer look.</p>
        <p>For a long time, I thought I needed to have everything figured out before I could write anything down. Turns out, the unfinished thoughts are often the interesting ones.</p>
        <p>Fieldnotes is a home for those thoughts: small observations, creative experiments, and reminders to pay attention. I write about making things, making space, and finding your own pace.</p>
        <p>When I&apos;m not writing, you&apos;ll find me walking the long way home, attempting to keep a plant alive, or adding another notebook to the pile.</p>
        <div className="about-contact">
          {contactEmail && <a className="text-link" href={`mailto:${contactEmail}`}><Mail size={15} /> Drop me a note</a>}
          <Link className="text-link" href="/writing">Browse the journal <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
