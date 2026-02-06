import type { RestaurantData, DayMenu } from "./types";

const POLISH_DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt"] as const;

const POLISH_DAY_FULL = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
] as const;

export function getWeekDates(today: Date = new Date()): string[] {
  const day = today.getDay(); // 0=Sun, 1=Mon, ...
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export function getTodayDate(now: Date = new Date()): string {
  return now.toISOString().split("T")[0];
}

export function getDayLabel(index: number): string {
  return POLISH_DAYS[index] ?? "";
}

export function getDayFullName(index: number): string {
  return POLISH_DAY_FULL[index] ?? "";
}

export function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${day}.${month}`;
}

export function formatPrice(price: number | null): string {
  if (price === null) return "w cenie";
  return `${price} zł`;
}

export function getMenuForDate(
  restaurant: RestaurantData,
  date: string
): DayMenu | undefined {
  return restaurant.menus.find((m) => m.date === date);
}

function sortItemsByPrice(items: DayMenu["items"]): DayMenu["items"] {
  return [...items].sort((a, b) => {
    if (a.price === null && b.price === null) return 0;
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return b.price - a.price;
  });
}

export function getRestaurantsWithMenuForDate(
  restaurants: RestaurantData[],
  date: string
): { restaurant: RestaurantData; menu: DayMenu }[] {
  const results: { restaurant: RestaurantData; menu: DayMenu }[] = [];
  for (const restaurant of restaurants) {
    const menu = getMenuForDate(restaurant, date);
    if (menu && menu.items.length > 0) {
      results.push({
        restaurant,
        menu: { ...menu, items: sortItemsByPrice(menu.items) },
      });
    }
  }
  return results;
}
