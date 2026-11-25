# Fieldnotes

A personal blog built with the Next.js App Router, TypeScript and Tailwind CSS. Posts come from the **Fieldnotes Blog API** (`../blog-app-api`), which owns the Markdown content.

## Running the blog and the API locally

The blog fetches all its data from the API, at runtime **and at build time**, so start the API first.

**1. API** (terminal 1)

```powershell
cd "..\blog-app-api"
npm install
Copy-Item .env.example .env      # set ADMIN_API_KEY and REVALIDATE_SECRET
npm run dev                      # http://localhost:4000, Swagger UI at /api-docs
```

**2. Blog** (terminal 2)

```powershell
cd "..\blog-app"
npm install
Copy-Item .env.example .env.local   # API_URL=http://localhost:4000, same REVALIDATE_SECRET as the API
npm run dev                         # http://localhost:3001
```

The two apps share one secret:

| Blog `.env.local` | API `.env` |
| --- | --- |
| `API_URL=http://localhost:4000` | `PORT=4000` |
| `REVALIDATE_SECRET=<same value>` | `REVALIDATE_SECRET=<same value>` |
| (blog origin) `http://localhost:3001` | `ALLOWED_ORIGINS=http://localhost:3001` and `REVALIDATE_URL=http://localhost:3001/api/revalidate` |

### Testing on-demand revalidation

`next dev` doesn't cache data, so to see the webhook work, use a production build with the API running:

```powershell
npm run build
npm start
```

Then create, update or delete a post through the API (see the API README or Swagger UI). The API calls `POST /api/revalidate` on the blog with the tags `posts` and `post:<slug>`, and the change appears on the next request. Without the webhook, pages still refresh at least once an hour.

## How data flows

- `lib/contracts/`: zod schemas and types for every API response (`PostSummary`, `Post`, `Tag`, `Author`, `Pagination`, the error body, the revalidation payload). It's self-contained (imports only `zod` and sibling files, enforced by ESLint) so it can move to a shared package.
- `lib/api/`: the only place that calls `fetch`. A small typed client with a base URL from `API_URL`, a timeout (`API_TIMEOUT_MS`, default 8 s), response validation against the contracts, and `ApiError` with kinds `config | timeout | network | http | validation`.
- `lib/posts.ts`: the functions pages use: `getPosts`, `getPostsPage`, `getPost`, `getPostSlugs`, `getRelatedPosts`, `getTags`, `getTag` and `getPostsByTag`. Categories are presented as tags.
- Pages are Server Components. Fetches are cached with the tags `posts` and `post:<slug>` and a 1-hour `revalidate`. Post pages are pre-rendered with `generateStaticParams`, new posts render on first request, and unknown slugs return `notFound()`.
- `/`, `/writing` and `/writing/[slug]` each have a `loading.tsx` and an `error.tsx`. Pages already cached keep serving if the API goes down.

## Configuration

See `.env.example`. `NEXT_PUBLIC_SITE_URL` is the canonical URL used for metadata, the sitemap and robots. On Vercel, `VERCEL_URL` is the fallback, and local development defaults to `http://localhost:3001`. Set `NEXT_PUBLIC_CONTACT_EMAIL` to show the email links.

### Multi-Zones (serving under `/blog`)

Set both of these:

```env
NEXT_PUBLIC_BASE_PATH=/blog
NEXT_PUBLIC_SITE_URL=https://example.com/blog
```

The API's `REVALIDATE_URL` then becomes `https://example.com/blog/api/revalidate`. Rules for keeping the blog zone-ready:

- Build absolute URLs with `absoluteUrl()` from `lib/site-config.ts`. Never hardcode a domain, and don't use `new URL("/x", base)`, which drops the base path.
- Link internal pages with `next/link`, which adds the base path automatically. Link the portfolio (`/`, `/projects`, `/resume`) with a plain `<a>`, because it lives in another zone.
- Colors and fonts are CSS variables (design tokens) in `app/globals.css` `:root`. Use `var(--token)` in styles, never a hex value.

## Writing a post

Posts are Markdown files owned by the API (`../blog-app-api/content/posts`). Add them through the API's `POST /api/posts` (which also refreshes the blog), or drop in a `.md` file with this frontmatter:

```yaml
---
title: "A thoughtful title"
description: "A short summary for the article and search results."
category: "Creativity"
date: "2025-03-18"
author: "Alex Morgan"   # optional; defaults to the API's DEFAULT_AUTHOR_NAME
---
```

Files added directly on disk don't trigger the webhook. They appear within an hour, or call `/api/revalidate` yourself.

## Available scripts

- `npm run dev`: start the development server
- `npm run build`: create a production build (the API must be running)
- `npm start`: serve the production build
- `npm run lint`: run ESLint
- `npm run typecheck`: run the TypeScript checker
