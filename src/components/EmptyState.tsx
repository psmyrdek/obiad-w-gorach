export default function EmptyState() {
  return (
    <div className="text-center py-16 px-6 animate-fadeIn">
      {/* Decorative mountain silhouette */}
      <svg
        className="w-24 h-16 mx-auto mb-6 text-paper-300"
        viewBox="0 0 120 60"
        fill="currentColor"
      >
        <path d="M0 60 L30 20 L45 35 L60 10 L75 30 L90 15 L120 60 Z" />
      </svg>

      <p className="font-display text-xl text-ink-600 mb-2">
        Brak menu na ten dzień
      </p>
      <p className="text-sm text-ink-400 max-w-xs mx-auto leading-relaxed">
        Restauracje nie opublikowały jeszcze menu. Sprawdź inny dzień lub wróć później.
      </p>
    </div>
  );
}
