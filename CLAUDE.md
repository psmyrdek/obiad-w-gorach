# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Obiad w Górach** — a Polish lunch menu aggregator for restaurants in the Beskidy mountain area. Fetches daily menus via RSS feeds (powered by FetchRSS), parses them with AI (Google Gemini via OpenRouter), and displays them on a server-rendered Astro site.

**Tech stack:** Astro 5 (SSR) + React 19 + Tailwind CSS 3, hosted on Cloudflare Pages. Scraping uses RSS feeds via FetchRSS service and Vercel AI SDK for LLM parsing.

**Production URL:** https://obiadwgorach.pages.dev

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production (Astro SSR → dist/)
npm run preview  # Preview production build locally
npm run scrape   # Run all scrapers (requires .env, overwrites src/data/menus/*.json)
```

## Architecture

CQRS-style data flow — scraping and presentation are separate concerns:

```
Facebook pages → FetchRSS (RSS feeds) → AI parser (text or images) → JSON files → Astro content collection → React UI
```

### Data flow in detail

1. `npm run scrape` runs `scripts/scrape.ts` which loads `.env` and calls `providers/run.ts`
2. Each provider in `providers/restaurants/*.ts` fetches an RSS feed via `providers/lib/rss.ts` (FetchRSS converts Facebook pages to RSS)
3. RSS content is compared against a cached copy (`providers/data/rss/{id}.xml`); if unchanged, the provider returns `null` and existing JSON is preserved
4. Changed content is parsed by `providers/ai/parse-menu.ts` using Google Gemini 3 Flash via OpenRouter — either as text (`parseMenuText`) or images (`parseMenuImages`)
5. Structured `DayMenu[]` data is written to `src/data/menus/{id}.json`
6. Astro content collection (`src/content.config.ts`) reads JSON files via glob loader with Zod validation
7. `src/pages/index.astro` fetches the collection server-side and passes data + `today` date to `MenuPage.tsx` React island (`client:load`)

### Directory structure

```
├── src/
│   ├── components/          # React components (MenuPage, WeekNav, DayMenu, RestaurantCard, EmptyState)
│   ├── pages/index.astro    # Single page entry point
│   ├── layouts/Layout.astro # HTML shell with fonts, header, footer
│   ├── lib/
│   │   ├── types.ts         # View-side types (RestaurantData, DayMenu, MenuItem)
│   │   └── menu.ts          # Date utilities, Polish locale helpers, sorting
│   ├── styles/global.css    # Tailwind + custom utilities (paper texture, animations)
│   ├── data/menus/*.json    # Scraped restaurant data (5 files)
│   └── content.config.ts    # Astro 5 content collection config (glob loader)
├── providers/
│   ├── restaurants/         # 5 restaurant scrapers + index.ts registry
│   ├── ai/
│   │   ├── parse-menu.ts    # LLM menu parser: text + image modes (Gemini via OpenRouter)
│   │   └── parsing-prompt.ts # Polish-language parsing instructions
│   ├── lib/
│   │   ├── rss.ts           # RSS feed fetching, caching, image extraction (default scraping method)
│   │   └── facebook.ts      # Legacy Playwright Facebook scraper (unused)
│   ├── data/rss/            # Cached RSS XML files for change detection
│   ├── types.ts             # Scraper-side types (Provider, ProviderConfig, DayMenu, MenuItem)
│   └── run.ts               # Orchestrator: runs all providers, writes JSON (skips unchanged feeds)
├── scripts/
│   ├── scrape.ts            # Entry point for scraping (loads .env)
│   └── test-facebook.ts     # Manual Facebook scraper test
├── e2e/                     # Playwright E2E tests
├── .github/workflows/
│   ├── deploy.yml           # Build & deploy on push to main
│   └── scrape-and-deploy.yml # Scheduled Mon-Fri 09:00 UTC scrape + deploy
└── .claude/                 # Claude Code skills & commands
```

### Current restaurants (5 providers)

| ID | Name | Area |
|----|------|------|
| `garden-bar` | Garden Bar | Bielsko-Biała |
| `u-babci` | U Babci | Bielsko-Biała |
| `magia-smaku` | Magia Smaku | Bielsko-Biała |
| `smakuj-zycie` | Smakuj Życie | Łodygowice |
| `cubus-beskidy` | Cubus Beskidy | Zarzecze |

## Key Files

| File | Purpose |
|------|---------|
| `providers/types.ts` | `Provider`, `ProviderConfig`, `MenuItem`, `DayMenu`, `RestaurantMenu` interfaces (scraper side) |
| `src/lib/types.ts` | `RestaurantData`, `DayMenu`, `MenuItem` interfaces (view side, mirrors provider types) |
| `src/lib/menu.ts` | `getWeekDates()`, `formatPrice()`, `getRestaurantsWithMenuForDate()`, Polish day labels |
| `providers/restaurants/index.ts` | Provider registry — add new providers here |
| `providers/ai/parse-menu.ts` | AI parsing with `google/gemini-3-flash-preview` via OpenRouter (text + image modes) |
| `providers/ai/parsing-prompt.ts` | Polish-language prompt: extract soups + daily specials, skip main courses |
| `providers/lib/rss.ts` | RSS feed fetching, caching, image URL extraction — default scraping method |
| `providers/lib/facebook.ts` | Legacy Playwright Facebook scraper (unused, kept for reference) |
| `providers/run.ts` | Orchestrator: iterates providers, writes JSON (skips unchanged feeds when scrape returns `null`) |
| `src/content.config.ts` | Astro 5 content collection: glob loader + Zod schema |
| `src/pages/index.astro` | Server page: fetches collection, renders React island |
| `src/components/MenuPage.tsx` | Root React component: date state + week navigation |

## Adding a New Restaurant Provider

1. Set up an RSS feed for the Facebook page via FetchRSS and add the URL to `RSS_FEEDS` in `providers/lib/rss.ts`
2. Create `providers/restaurants/{slug}.ts` exporting a default `Provider` object
3. Register the import in `providers/restaurants/index.ts`
4. Run `npm run scrape` to generate the initial JSON file in `src/data/menus/`

Provider template (text-based RSS parsing):

```typescript
import type { Provider, DayMenu } from "../types.js";
import { fetchRssFeed, loadCachedFeed, saveFeed, RSS_FEEDS } from "../lib/rss.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "slug",
    name: "Restaurant Name",
    url: "https://www.facebook.com/YOUR_PAGE_ID",
    phone: "+48 ...",
  },
  async scrape(): Promise<DayMenu[] | null> {
    const text = await fetchRssFeed(RSS_FEEDS.YOUR_FEED_KEY);
    const cached = loadCachedFeed("slug");
    if (cached === text) return null; // Feed unchanged
    saveFeed("slug", text);
    return parseMenuText(text);
  },
};
export default provider;
```

For image-based providers (e.g. Cubus Beskidy), use `extractImageUrls()` + `fetchImage()` from `providers/lib/rss.ts` and `parseMenuImages()` from `providers/ai/parse-menu.ts`.

## Environment Variables

Required in `.env` (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key (for AI menu parsing) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Pages deployment |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages deployment |

## CI/CD

Two GitHub Actions workflows:

- **`deploy.yml`** — Triggers on push to `main` or manual dispatch. Builds Astro and deploys to Cloudflare Pages.
- **`scrape-and-deploy.yml`** — Runs Mon-Fri at 09:00 UTC (10:00 CET). Fetches RSS feeds, commits updated JSON to `main`, builds, and deploys.

## Design System

Editorial magazine aesthetic with warm, refined tones:

- **Fonts:** Playfair Display (headings, serif) + Source Sans 3 (body, sans-serif)
- **Colors:** `paper` (cream bg), `ink` (warm brown text), `terra` (rust accents), `sage` (forest greens)
- **Animations:** `fadeIn`, `slideUp`, staggered entrance animations with cubic-bezier easing
- **Texture:** SVG noise overlay on paper background (3% opacity)

Tailwind config extends defaults with these custom tokens. See `tailwind.config.mjs`.

## Conventions

- **Polish UI:** All user-facing text is in Polish. Day labels are Pn/Wt/Śr/Cz/Pt. Currency is "zł".
- **Weekdays only:** The app shows Mon-Fri menus. No weekend support.
- **Price null = "nie podano":** A `null` price means the item is included in a set meal price, displayed as "nie podano".
- **Sorting:** Menu items are sorted by price descending (most expensive first), nulls last.
- **TypeScript:** Strict mode via `astro/tsconfigs/strict`. ESM modules (`"type": "module"`).
- **No linter/formatter configured:** No ESLint or Prettier in the project.
- **Imports use `.js` extension:** TypeScript files import with `.js` suffix (ESM convention).

## Gotchas

- Running `npm run scrape` **overwrites** JSON files — but providers returning `null` (unchanged feed) preserve existing data.
- RSS feeds are provided by **FetchRSS** (`fetchrss.com`), a third-party service that converts Facebook pages to RSS. Feed URLs are hardcoded in `providers/lib/rss.ts`.
- RSS XML is cached in `providers/data/rss/` for change detection. If the feed hasn't changed, AI parsing is skipped.
- Content collection config is at `src/content.config.ts` (Astro 5 convention), not `src/content/config.ts`.
- Dev server runs on port **3000** (configured in `astro.config.mjs`), not Astro's default 4321.
- The AI parser prompt is specifically tuned for Polish lunch menus — it extracts soups and daily specials while skipping permanent main course items.
- Two separate type systems exist: `providers/types.ts` (scraper) and `src/lib/types.ts` (view). They mirror each other but are not shared.
- `smakuj-zycie` provider is currently disabled (no RSS feed available).
