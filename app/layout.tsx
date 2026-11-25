import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { siteBaseUrl } from "@/lib/site-config";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteBaseUrl,
  title: {
    default: "Fieldnotes — Notes on making a life",
    template: "%s — Fieldnotes",
  },
  description:
    "A personal journal about creative work, thoughtful living, and finding meaning in the everyday.",
  openGraph: {
    title: "Fieldnotes — Notes on making a life",
    description:
      "A personal journal about creative work, thoughtful living, and finding meaning in the everyday.",
    type: "website",
    siteName: "Fieldnotes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fieldnotes — Notes on making a life",
    description: "Notes on creative work, thoughtful living, and the everyday.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <div className="site-shell">
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
