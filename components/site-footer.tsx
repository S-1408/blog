import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contactEmail } from "@/lib/site-config";

export default function SiteFooter() {
  return (
    <footer className="site-footer page-width">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="brand"><span className="brand-mark">f<span>.</span></span><span className="brand-name">fieldnotes<span> / a personal journal</span></span></Link>
          <p>For the things worth noticing.</p>
        </div>
        <div className="footer-links">
          <Link href="/writing">The journal</Link>
          <Link href="/about">About Alex</Link>
          {contactEmail && <a href={`mailto:${contactEmail}`}>Get in touch <ArrowUpRight size={13} /></a>}
        </div>
        <span className="footer-flower" aria-hidden="true">✳</span>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Fieldnotes. Made with a little patience.</span>
        <span>Take what you need, leave a little kindness.</span>
      </div>
    </footer>
  );
}
