import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "magia-smaku",
    name: "Magia Smaku",
    url: "https://www.magiasmakubielsko.pl",
    phone: "+48 33 497 08 05",
  },

  async scrape(): Promise<DayMenu[]> {
    console.log(`[magia-smaku] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
