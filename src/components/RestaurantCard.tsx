import type { DayMenu, RestaurantData } from "../lib/types";
import { formatPrice } from "../lib/menu";

interface Props {
  restaurant: RestaurantData;
  menu: DayMenu;
  index: number;
}

export default function RestaurantCard({ restaurant, menu, index }: Props) {
  return (
    <article
      className="opacity-0 animate-stagger"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Restaurant header */}
      <header className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-800 leading-tight">
            <a
              href={restaurant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terra-500 transition-colors duration-200 inline-flex items-baseline gap-1.5 group"
            >
              {restaurant.name}
              <svg
                className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-40 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </h3>
          <a
            href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-sage-500 transition-colors mt-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {restaurant.phone}
          </a>
        </div>

        {/* Item count badge */}
        <span className="text-xs font-medium text-ink-400 bg-paper-200 px-2 py-1 rounded">
          {menu.items.length} {menu.items.length === 1 ? "danie" : menu.items.length < 5 ? "dania" : "dań"}
        </span>
      </header>

      {/* Menu items */}
      <ul className="space-y-0">
        {menu.items.map((item, i) => (
          <li
            key={i}
            className="flex justify-between gap-4 py-3 border-b border-paper-200 last:border-b-0 group"
          >
            <span className="text-[15px] text-ink-600 leading-relaxed group-hover:text-ink-800 transition-colors">
              {item.name}
            </span>
            <span className="price-tag text-terra-500 font-semibold whitespace-nowrap text-[15px] self-start">
              {formatPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
