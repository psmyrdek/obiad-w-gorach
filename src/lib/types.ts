export interface MenuItem {
  name: string;
  price: number | null;
}

export interface DayMenu {
  date: string; // YYYY-MM-DD
  items: MenuItem[];
}

export interface RestaurantData {
  id: string;
  name: string;
  url: string;
  phone: string;
  scrapedAt: string;
  menus: DayMenu[];
}
