# AGENTS.md — kontext pre AI agentov (Claude Code a pod.)

Tento súbor naladí AI asistenta na projekt **fitted**. Si tu na to, aby si pomohol(la) vývojárovi, ktorý práve **preberá tento projekt** a chce v ňom pokračovať.

## Ako komunikovať

- **Odpovedaj po slovensky**, pokiaľ používateľ nepožiada inak. Je to slovensky hovoriaci vývojár, ktorý projekt preberá.
- Buď konkrétny a praktický: keď niečo vysvetľuješ, ukáž **presný súbor a miesto** v kóde.
- Keď ťa používateľ požiada o „prevedenie" niečím (setup, nová funkcia, oprava), veď ho **krok za krokom** a over si výsledok, než vyhlásiš hotovo.
- Podrobný používateľský návod je v **`NAVOD.md`** — pokojne naň odkazuj a vychádzaj z neho.

## ⚠️ Najdôležitejšie technické pravidlo

Projekt beží na **Expo SDK 56**. Pred písaním akéhokoľvek kódu si over presnú, **verziovanú** dokumentáciu na **https://docs.expo.dev/versions/v56.0.0/**. Expo API sa medzi verziami mení — nepíš z pamäte.

## Čo je to za projekt

**fitted** — AI pomocník do šatníka. Používateľ fotí oblečenie, AI ho štítkuje a skladá z neho outfity podľa príležitosti a počasia, plus generuje virtuálny „try-on" obrázok používateľa v danom outfite.

- Stav: **prototyp / v1**, beží **lokálne na telefóne** (žiadny backend, žiadne prihlasovanie, žiadna synchronizácia).
- Spúšťa sa cez **Expo Go** (naskenovať QR kód z `npx expo start`).
- Priečinok/`package.json name` je `sasa`, ale **značka a názov appky je „fitted"**.

## Zamknuté rozhodnutia (NEROZPORUJ ich, ak o to používateľ výslovne nepožiada)

- **Lokálne úložisko pre v1**: SQLite (`expo-sqlite`) na oblečenie/outfity, AsyncStorage (zustand persist) na profil/nastavenia, `expo-file-system` na obrázky. Žiadny base64 sa neukladá do DB.
- **Gemini na VŠETKU AI** (štítkovanie, generovanie outfitov, vylepšenie fotiek, try-on), volané priamo z appky cez `EXPO_PUBLIC_GEMINI_API_KEY`. Kľúč si pridáva používateľ sám. Je to prototypová úroveň — **pred vydaním do obchodu treba proxy backend** (kľúč je inak v balíku appky).
- **Open-Meteo** na počasie (bez kľúča).
- Spodná navigácia podľa brand booku: **Today · Closet · +FAB · Saved · You**.

## Mapa kódu

```
src/app/        – obrazovky (expo-router; cesta súboru = route)
                  (onboarding)/  (tabs)/  add-garment  garment/[id]
                  outfit/[id]  try-on/[outfitId]  dev/gallery
src/store/      – zustand stores: useProfileStore, useWardrobeStore,
                  useOutfitStore, useSettingsStore, useWeather(Store)
src/services/   – čistá logika (žiadne UI):
                  gemini/  (analyzeGarment, generateOutfits, enhanceGarment,
                            tryOn, client) · db.ts · images.ts · weather.ts · location.ts
src/components/ – sorbet/ (dizajn kit) · onboarding/ · closet/ · today/
src/theme/      – tokens.ts (farby/medzery) · typography.ts · motion.ts
src/types/      – TypeScript typy (Garment, Outfit, UserProfile, Slot, ...)
design/         – pôvodný „Sorbet" brand book (HTML prototypy, tokeny) = zdroj pravdy pre dizajn
```

**Architektúrne pravidlo**: obrazovky → zustand store → služba → (SQLite / file-system / Gemini / Open-Meteo). Obrazovky nikdy nevolajú Gemini ani DB priamo.

## Kde sa ladí kvalita

- **AI prompty** (najväčší vplyv) sú v `src/services/gemini/*.ts` — každá funkcia má svoj prompt a prípadne `SCHEMA`.
- **Modely** sú na jednom mieste v `src/services/gemini/client.ts` v objekte `MODELS` (`gemini-2.5-flash`, `gemini-2.5-flash-image`).
- **Kreativita** = parameter `temperature` v `generateContent` (`client.ts`).
- **Vzhľad/brand** = `src/theme/` + komponenty v `src/components/sorbet/`.

## Spustenie a kontroly

```bash
npm install
cp .env.example .env          # vložiť Gemini kľúč
npx expo start                # QR pre Expo Go
npx tsc --noEmit              # typová kontrola
npx expo lint                 # linter
# tvrdý reset dát: v appke You → clear all data (na webe aj vymazanie dát stránky v prehliadači)
```

Po každej zmene kódu spusti `npx tsc --noEmit` a `npx expo lint`.

## Známe nedokončené veci (časté témy otázok)

- Ikona a splash sú čiastočne Expo defaulty — predlohy sú v `design/`.
- Prepínač dennej pripomienky sa uloží, ale nič nenaplánuje (expo-notifications nefunguje v Expo Go na Androide — treba dev build).
- Generovanie outfitov ešte nebolo overené oproti živému Gemini API — to je prvé, čo treba preklikať po vložení kľúča.

## Ako previesť používateľa ďalej

Keď sa pýta „čo ďalej" alebo „ako z toho spravím reálnu appku", veď ho podľa kapitoly 10 v `NAVOD.md`:
1. proxy pre Gemini kľúč (nutné pred vydaním), 2. brandová ikona/splash, 3. dev build (EAS) kvôli notifikáciám, 4. otestovať a doladiť AI naživo, 5. produkčný build + publikácia (EAS), voliteľne backend/auth/sync (napr. Supabase).
