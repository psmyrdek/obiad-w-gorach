import type { Provider, DayMenu } from "../types.js";

const provider: Provider = {
  config: {
    id: "pod-gruszka",
    name: "Restauracja Pod Gruszką",
    url: "https://facebook.com/restauracjapodgruszka",
    phone: "+48 12 422 68 60",
  },

  async scrape(): Promise<DayMenu[]> {
    // TODO: implement actual scraping from Facebook/website
    console.log(`[pod-gruszka] Scraping not yet implemented, returning empty.`);
    return [];
  },
};

export default provider;
