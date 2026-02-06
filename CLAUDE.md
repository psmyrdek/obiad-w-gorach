# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (port 4321, may auto-select next available)
npm run build    # Build for production
npm run scrape   # Run all scrapers (overwrites src/data/menus/*.json)
```

## Architecture

Lunch menu aggregator using CQRS-style data flow:

```
Providers (scrape) → JSON files → Astro content collection → React UI
```

**Data flow:**
1. `npm run scrape` calls `scripts/scrape.ts` → `providers/run.ts`
2. Each provider in `providers/restaurants/*.ts` exports `{ config, scrape() }` returning `DayMenu[]`
3. Scraped data written to `src/data/menus/{id}.json`
4. Astro content collection (`src/content.config.ts`) reads JSON via glob loader
5. `index.astro` fetches collection, passes to `MenuPage.tsx` React island with server-determined `today` date

**Key files:**
- `providers/types.ts` - Provider/MenuItem/DayMenu/RestaurantMenu interfaces (scraper side)
- `src/lib/types.ts` - RestaurantData/DayMenu/MenuItem (view side, mirrors provider types)
- `src/lib/menu.ts` - Date utilities, Polish locale helpers (Pn/Wt/Śr/Cz/Pt, "zł" prices)
- `providers/restaurants/index.ts` - Provider registry (add new providers here)

## Adding a New Restaurant Provider

1. Create `providers/restaurants/{slug}.ts` exporting a `Provider` object
2. Register in `providers/restaurants/index.ts`
3. Run `npm run scrape` to generate initial JSON

Provider template:
```typescript
import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "slug",
    name: "Restaurant Name",
    url: "https://...",
    phone: "+48 ...",
  },
  async scrape(): Promise<DayMenu[]> {
    // Return array of { date: "YYYY-MM-DD", items: [{ name, price }] }
    return [];
  },
};
export default provider;
```

## Gotchas

- Running `npm run scrape` overwrites JSON files - if providers return empty, sample data is lost
- Content collection config is at `src/content.config.ts` (Astro 5 convention, not `src/content/config.ts`)
- `price: null` displays as "w cenie" (included in price) in the UI
