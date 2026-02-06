import type { RestaurantData } from "../lib/types";
import { getRestaurantsWithMenuForDate } from "../lib/menu";
import RestaurantCard from "./RestaurantCard";
import EmptyState from "./EmptyState";

interface Props {
  restaurants: RestaurantData[];
  date: string;
}

export default function DayMenu({ restaurants, date }: Props) {
  const entries = getRestaurantsWithMenuForDate(restaurants, date);

  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Restaurant list with dividers */}
      <div className="divide-y-0">
        {entries.map(({ restaurant, menu }, index) => (
          <div
            key={restaurant.id}
            className={index > 0 ? "pt-8 mt-8 border-t border-paper-300" : ""}
          >
            <RestaurantCard
              restaurant={restaurant}
              menu={menu}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Footer count */}
      <p className="text-center text-ink-400 text-xs pt-8 mt-8 border-t border-paper-200">
        {entries.length} {entries.length === 1 ? "restauracja" : entries.length < 5 ? "restauracje" : "restauracji"} z menu
      </p>
    </div>
  );
}
