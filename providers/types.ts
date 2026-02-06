export interface ProviderConfig {
  id: string;
  name: string;
  url: string;
  phone: string;
}

export interface MenuItem {
  name: string;
  price: number | null;
}

export interface DayMenu {
  date: string; // YYYY-MM-DD
  items: MenuItem[];
}

export interface RestaurantMenu {
  id: string;
  name: string;
  url: string;
  phone: string;
  scrapedAt: string; // ISO 8601
  menus: DayMenu[];
}

export interface Provider {
  config: ProviderConfig;
  scrape: () => Promise<DayMenu[] | null>;
}
