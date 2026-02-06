import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "cubus-beskidy",
    name: "Cubus Beskidy",
    url: "https://cubus-beskidy.pl",
    phone: "+48 33 863 13 05",
  },

  async scrape(): Promise<DayMenu[]> {
    console.log(`[cubus-beskidy] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
