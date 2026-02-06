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
    <div className="space-y-4">
      {entries.map(({ restaurant, menu }) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          menu={menu}
        />
      ))}
    </div>
  );
}
