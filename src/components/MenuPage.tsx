import { useState } from "react";
import type { RestaurantData } from "../lib/types";
import { getWeekDates } from "../lib/menu";
import WeekNav from "./WeekNav";
import DayMenu from "./DayMenu";

interface Props {
  restaurants: RestaurantData[];
  today: string; // YYYY-MM-DD, passed from server
}

export default function MenuPage({ restaurants, today }: Props) {
  const weekDates = getWeekDates(new Date(today + "T12:00:00"));
  const initialDate = weekDates.includes(today) ? today : weekDates[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);

  return (
    <div className="space-y-6">
      <WeekNav
        dates={weekDates}
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
      <DayMenu restaurants={restaurants} date={selectedDate} />
    </div>
  );
}
