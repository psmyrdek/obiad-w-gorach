import type { Provider, DayMenu } from "../types.js";
import { fetchRssFeed, loadCachedFeed, saveFeed, RSS_FEEDS } from "../lib/rss.js";
import { parseMenuText } from "../ai/parse-menu.js";

const provider: Provider = {
  config: {
    id: "garden-bar",
    name: "Garden Bar",
    url: "https://www.facebook.com/126626397494420",
    phone: "+48 691 409 510",
  },

  async scrape(): Promise<DayMenu[] | null> {
    const text = await fetchRssFeed(RSS_FEEDS.GARDEN_BAR);
    console.log(`[garden-bar] Fetched ${text.length} chars from RSS`);

    const cached = loadCachedFeed("garden-bar");
    if (cached === text) {
      console.log(`[garden-bar] RSS unchanged, skipping AI parsing`);
      return null;
    }

    saveFeed("garden-bar", text);
    return parseMenuText(text);
  },
};

export default provider;
