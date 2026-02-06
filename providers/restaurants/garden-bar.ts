import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "garden-bar",
    name: "Garden Bar",
    url: "https://www.facebook.com/126626397494420",
    phone: "+48 691 409 510",
  },

  async scrape(): Promise<DayMenu[]> {
    console.log(`[garden-bar] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
