import { getDayLabel, formatDate } from "../lib/menu";

interface Props {
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
}

export default function WeekNav({ dates, selected, onSelect }: Props) {
  return (
    <nav className="flex gap-2 justify-center flex-wrap">
      {dates.map((date, i) => {
        const isActive = date === selected;
        return (
          <button
            key={date}
            onClick={() => onSelect(date)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {getDayLabel(i)} {formatDate(date)}
          </button>
        );
      })}
    </nav>
  );
}
