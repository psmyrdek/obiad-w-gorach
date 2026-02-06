import type { DayMenu, RestaurantData } from "../lib/types";
import { formatPrice } from "../lib/menu";

interface Props {
  restaurant: RestaurantData;
  menu: DayMenu;
}

export default function RestaurantCard({ restaurant, menu }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="mb-3">
        <h3 className="font-semibold text-lg">
          <a
            href={restaurant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 hover:underline"
          >
            {restaurant.name}
          </a>
        </h3>
        <a
          href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          {restaurant.phone}
        </a>
      </div>
      <ul className="space-y-1.5">
        {menu.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-4">
            <span className="text-gray-800">{item.name}</span>
            <span className="text-gray-500 whitespace-nowrap text-sm">
              {formatPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
