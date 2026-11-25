"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { contactEmail } from "@/lib/site-config";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isWriting = pathname.startsWith("/writing");

  return (
    <header className="site-header page-width">
      <Link href="/" className="brand" aria-label="Fieldnotes home">
        <span className="brand-mark">f<span>.</span></span>
        <span className="brand-name">fieldnotes<span> / a personal journal</span></span>
      </Link>
      <button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav id="main-nav" className={`main-nav${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
        <Link onClick={() => setMenuOpen(false)} aria-current={pathname === "/" ? "page" : undefined} className={pathname === "/" ? "nav-active" : ""} href="/">Home</Link>
        <Link onClick={() => setMenuOpen(false)} aria-current={isWriting ? "page" : undefined} className={isWriting ? "nav-active" : ""} href="/writing">Writing</Link>
        <Link onClick={() => setMenuOpen(false)} aria-current={pathname === "/about" ? "page" : undefined} className={pathname === "/about" ? "nav-active" : ""} href="/about">About</Link>
        {contactEmail && <a onClick={() => setMenuOpen(false)} className="nav-note" href={`mailto:${contactEmail}`}>Say hello <ArrowUpRight size={13} /></a>}
      </nav>
    </header>
  );
}
