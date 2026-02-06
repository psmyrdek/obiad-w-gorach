export interface WeekContext {
  weekDates: [string, string, string, string, string];
  today: string;
}

export interface ParsingPromptInputs extends WeekContext {
  menuText: string;
}

export function buildParsingPrompt({
  weekDates,
  today,
  menuText,
}: ParsingPromptInputs): string {
  return `

  Wykonaj parsowanie menu na podstawie tekstu:
  ${menuText}

  Wybieraj wyłącznie dania dnia oraz zupy.

  Jeśli danie nie ma ceny, ustaw cenę na null.

  Dzisiejsza data to: ${today}

  Dopasuj daty do dni tygodnia:
    Poniedziałek = ${weekDates[0]},
    Wtorek = ${weekDates[1]},
    Środa = ${weekDates[2]},
    Czwartek = ${weekDates[3]},
    Piątek = ${weekDates[4]},

  Jeśli post wyraźnie wskazuje dzień tygodnia (np. "Poniedziałek", "Wtorek", "Piątek"), użyj odpowiedniej daty z powyższego mapowania.
  Jeśli post nie wskazuje konkretnego dnia, załóż że dotyczy dnia dzisiejszego (${today}).

  PRZYKŁADOWY WPIS:

  Piątek to idealny moment, żeby dobrze zjeść i na chwilę zwolnić 😌🍽️
U nas dziś jak zawsze pachnący, domowy rosołek, który rozgrzewa od pierwszej łyżki 🥣
  Chrupiąca rybka panierowana – złota, delikatna i zawsze trafiona 🐟✨
  ✅ Zupa :
  🥣 Rosół 9zł
  🥣 Pieczarkowa  8zł
  DANIA DNIA:
  📌 Eskalopki drobiowe z sosem pieczarkowym , ziemniaki, surówki ,kompot +zupa 29zł 😋
  📌Rybka panierowana ( morszczuk), ziemniaki, surówki,  kompot + zupa 35zł 😋
  🍽️ DANIA GŁÓWNE NA DZIŚ:
  🍝Makaron penne ze świeżym szpinakiem , kurczakiem , pomidorkami koktailowymi z czosnkiem na oliwie z oliwek,  kompot 30zł 😋
  🐟Łosoś grillowany z ziemniakami opiekanymi, surówki,  kompot  30zł😋
  🥩 Kotlet schabowy z sosem pieczarkowym , ziemniaki,  surówki,  kompot 32zł 😋
  🐥Nugetsy z frytkami i sosem kentucky, surówki, kompot 33zł😋
  🍜 Ramen Polski ,kompot 28zł 😋

  OCZEKIWANE POZYCJE DO POBRANIA:
  - Zupy (Rosół, Pieczarkowa)
  - Dnia dnia (Eskalopki drobiowe, Morszczuk panierowany)

  DO POMINIĘCIA:
  - Dania główne (Makaron penne, Łosoś grillowany, Kotlet schabowy, Nugetsy z frytkami)
  - Dania dnia (Ramen Polski)
  `;
}

export function buildImageParsingPrompt({
  weekDates,
  today,
}: WeekContext): string {
  return `Przeanalizuj poniższe zdjęcia menu restauracji. Wyodrębnij nazwy dań i ceny w złotych (PLN).

Wybieraj wyłącznie dania dnia oraz zupy. Pomiń dania z menu głównego (stałego).

Jeśli danie nie ma ceny, ustaw cenę na null.

Dzisiejsza data to: ${today}

Dopasuj daty do dni tygodnia:
  Poniedziałek = ${weekDates[0]},
  Wtorek = ${weekDates[1]},
  Środa = ${weekDates[2]},
  Czwartek = ${weekDates[3]},
  Piątek = ${weekDates[4]},

Jeśli zdjęcie wyraźnie wskazuje dzień tygodnia, użyj odpowiedniej daty.
Jeśli nie wskazuje konkretnego dnia, załóż że dotyczy dnia dzisiejszego (${today}).`;
}
