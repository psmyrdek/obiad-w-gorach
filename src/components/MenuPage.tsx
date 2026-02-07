import { useState } from "react";
import type { RestaurantData } from "../lib/types";
import { getWeekDates } from "../lib/menu";
import WeekNav from "./WeekNav";
import DayMenu from "./DayMenu";

interface Props {
  restaurants: RestaurantData[];
  today: string;
}

export default function MenuPage({ restaurants, today }: Props) {
  const weekDates = getWeekDates(new Date(today + "T12:00:00"));
  const initialDate = weekDates.includes(today) ? today : weekDates[weekDates.length - 1];
  const [selectedDate, setSelectedDate] = useState(initialDate);

  return (
    <div>
      <WeekNav
        dates={weekDates}
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
      <div key={selectedDate} className="animate-fadeIn">
        <DayMenu restaurants={restaurants} date={selectedDate} />
      </div>
    </div>
  );
}
