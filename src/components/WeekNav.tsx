import { getDayLabel, formatDate } from "../lib/menu";

interface Props {
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
}

export default function WeekNav({ dates, selected, onSelect }: Props) {
  return (
    <nav className="mb-8">
      <div className="flex gap-1 justify-center overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide sm:gap-2">
        {dates.map((date, i) => {
          const isActive = date === selected;
          return (
            <button
              key={date}
              onClick={() => onSelect(date)}
              className={`
                group relative flex flex-col items-center min-w-[3.75rem] px-3 py-3
                transition-all duration-200 active:scale-95
                ${isActive
                  ? "text-ink-800"
                  : "text-ink-400 hover:text-ink-600"
                }
              `}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest mb-1">
                {getDayLabel(i)}
              </span>
              <span className={`
                text-xl font-display font-semibold tabular-nums
                ${isActive ? "text-terra-500" : ""}
              `}>
                {formatDate(date)}
              </span>

              {/* Active indicator */}
              <span className={`
                absolute -bottom-0.5 left-1/2 -translate-x-1/2
                h-0.5 bg-terra-500 rounded-full
                transition-all duration-200
                ${isActive ? "w-6 opacity-100" : "w-0 opacity-0"}
              `} />

              {/* Hover state */}
              <span className={`
                absolute inset-0 rounded-lg bg-paper-200/50
                transition-opacity duration-200
                ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"}
              `} />
            </button>
          );
        })}
      </div>

      {/* Decorative rule */}
      <div className="flex items-center gap-3 mt-4 px-2">
        <div className="flex-1 h-px bg-paper-300" />
        <svg className="w-4 h-4 text-paper-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <div className="flex-1 h-px bg-paper-300" />
      </div>
    </nav>
  );
}
