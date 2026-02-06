# Obiad w Gorach

Lunch menu aggregator for Beskidy-area restaurants. Scrapes daily menus and displays them in a simple web app.

## Restaurants

- Garden Bar (Bielsko-Biala)
- U Babci (Bielsko-Biala)
- Magia Smaku (Bielsko-Biala)
- Smakuj Zycie (Lodygowice)
- Cubus Beskidy (Zarzecze)

## Tech stack

- Astro 5 with SSR on Cloudflare Pages
- React 19
- Tailwind CSS 3

## Development

```bash
npm install
npm run dev
```

## Scraping

```bash
npm run scrape
```

Runs automatically Mon-Fri at 05:00 UTC via GitHub Actions.

## Build

```bash
npm run build
```
