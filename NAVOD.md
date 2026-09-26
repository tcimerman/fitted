# Návod na prevzatie projektu fitted 🧑‍💻

Tento dokument je kompletný sprievodca pre vývojára, ktorý **preberá projekt fitted** a chce v ňom pokračovať. Je písaný tak, aby si nemusel(a) nič hádať: od nuly cez spustenie až po to, ako z prototypu spraviť reálnu appku v obchode.

Ak niečomu nerozumieš, otvor si projekt v **Claude Code** (alebo inom AI agentovi) — súbor `AGENTS.md` mu dá kompletný kontext a vie ťa previesť čímkoľvek z tohto návodu.

---

## Obsah

1. [Čo je fitted](#1-čo-je-fitted)
2. [Čo budeš potrebovať](#2-čo-budeš-potrebovať)
3. [Inštalácia krok za krokom](#3-inštalácia-krok-za-krokom)
4. [Gemini API kľúč a súbor .env](#4-gemini-api-kľúč-a-súbor-env)
5. [Spustenie appky](#5-spustenie-appky)
6. [Ako je appka postavená](#6-ako-je-appka-postavená)
7. [Čo appka momentálne vie](#7-čo-appka-momentálne-vie)
8. [Ako meniť a zlepšovať kvalitu](#8-ako-meniť-a-zlepšovať-kvalitu)
9. [Riešenie bežných problémov](#9-riešenie-bežných-problémov)
10. [Cesta k reálnej mobilnej appke](#10-cesta-k-reálnej-mobilnej-appke)
11. [Ako si pomôcť s Claude / AI agentom](#11-ako-si-pomôcť-s-claude--ai-agentom)

---

## 1. Čo je fitted

**fitted** je AI pomocník do šatníka. Používateľ si odfotí svoje oblečenie, appka ho rozpozná a oštítkuje, a potom z reálnych kúskov skladá outfity podľa príležitosti a počasia. Navrch dokáže vygenerovať obrázok, na ktorom daný outfit vidíš **na sebe** (virtuálny try-on).

Pár dôležitých faktov o aktuálnom stave:

- Je to **prototyp / v1**. Beží **lokálne na telefóne** — žiadny server, žiadne prihlasovanie, žiadna synchronizácia medzi zariadeniami.
- Všetka AI ide cez **Google Gemini**, volané priamo z appky.
- Počasie ide cez **Open-Meteo** (zadarmo, bez kľúča).
- Dizajn vychádza z brand booku **„FITTED / Sorbet"**, ktorý nájdeš v priečinku `design/` (originálne HTML/CSS prototypy + tokeny).

> ℹ️ Priečinok appky sa volá `sasa` a `package.json` má `"name": "sasa"`, ale **značka a názov appky je „fitted"**. Pokojne to neskôr zjednoť, nič to nerozbije.

---

## 2. Čo budeš potrebovať

| Nástroj | Na čo | Ako získať |
|---|---|---|
| **Node.js 20+** | spustenie projektu | https://nodejs.org (LTS verzia) |
| **npm** | inštalácia balíkov | je súčasťou Node.js |
| **Git** | stiahnutie kódu | https://git-scm.com |
| **Telefón s appkou Expo Go** | beh appky | App Store / Google Play, hľadaj „Expo Go" |
| **Gemini API kľúč** | AI funkcie | https://aistudio.google.com/apikey (zadarmo) |

Telefón a počítač musia byť **na rovnakej Wi-Fi sieti**, aby telefón videl vývojový server.

> 💡 Nepotrebuješ Xcode ani Android Studio. Vďaka Expo Go appka beží priamo na tvojom telefóne a stačí naskenovať QR kód. (Xcode/Android Studio budú treba až pri tvorbe reálneho buildu do obchodu — pozri kapitolu 10.)

---

## 3. Inštalácia krok za krokom

```bash
# 1. Stiahni kód (URL ti pošle majiteľ projektu)
git clone <URL-REPA>
cd sasa

# 2. Nainštaluj všetky závislosti
npm install
```

`npm install` môže trvať pár minút — sťahuje celé Expo SDK a React Native. Keď skončí bez červených chýb, máš hotovo.

---

## 4. Gemini API kľúč a súbor .env

Appka potrebuje kľúč na Google Gemini, inak AI funkcie len pekne „spia".

**Krok 1 — získaj kľúč:**
1. Choď na https://aistudio.google.com/apikey
2. Prihlás sa Google účtom
3. Klikni **Create API key** a kľúč si skopíruj

**Krok 2 — vlož kľúč do projektu:**

```bash
cp .env.example .env
```

Otvor súbor `.env` a vlož kľúč:

```env
EXPO_PUBLIC_GEMINI_API_KEY=sem_vloz_svoj_kluc
```

To je všetko. Súbor `.env` je v `.gitignore`, takže sa **nikdy nenahrá na GitHub** a tvoj kľúč zostane súkromný.

> ⚠️ **Bezpečnostná poznámka, ktorú si treba zapamätať.** Premenné s prefixom `EXPO_PUBLIC_` sa zabudujú priamo do balíka appky. To znamená, že ktokoľvek, kto si stiahne hotový build, vie kľúč vytiahnuť. Pre lokálne vyvíjanie a testovanie je to úplne v poriadku. Ale **predtým, než pustíš appku do App Store / Google Play, musíš AI volania presunúť za vlastný malý backend (proxy)** — viac v kapitole 10. Dovtedy používaj kľúč, ktorý má v Google Cloud nastavený limit útraty, nech ťa nič neprekvapí.

---

## 5. Spustenie appky

```bash
npx expo start
```

V termináli sa zobrazí **QR kód**:

- **iPhone**: otvor fotoaparát, namier na QR kód, klikni na notifikáciu → otvorí sa v Expo Go.
- **Android**: otvor appku **Expo Go** → **Scan QR code** → namier na kód.

Appka sa načíta na telefóne. Pri prvom spustení ťa prevedie onboardingom.

**Užitočné klávesy v termináli (počas behu `expo start`):**

| Klávesa | Čo spraví |
|---|---|
| `r` | reload appky |
| `m` | otvorí dev menu |
| `j` | otvorí debugger |
| `w` | spustí appku vo webovom prehliadači |

Web verzia (`w` alebo `npm run web`) je fajn na rýchle klikanie po UI, ale **AI funkcie a niektoré natívne veci sa najlepšie testujú na reálnom telefóne**.

---

## 6. Ako je appka postavená

### Technológie

- **Expo SDK 56** + **expo-router** (navigácia podľa súborov, podobne ako Next.js)
- **React Native 0.85** + **React 19**
- **TypeScript**
- **zustand** na stav appky (s ukladaním cez persist)
- **expo-sqlite** na databázu, **expo-file-system** na obrázky

### Mapa priečinkov

```
src/
├── app/                  # OBRAZOVKY (expo-router – cesta = súbor)
│   ├── (onboarding)/     #   prvotné nastavenie (email, meno, foto, ...)
│   ├── (tabs)/           #   hlavné taby: index=Today, closet, saved, you
│   ├── add-garment.tsx   #   pridanie kúsku oblečenia
│   ├── garment/[id].tsx  #   detail kúsku
│   ├── outfit/[id].tsx   #   detail outfitu
│   ├── try-on/[outfitId].tsx  # virtuálny try-on
│   └── dev/gallery.tsx   #   skrytá galéria komponentov (na vývoj)
│
├── store/                # STAV (zustand) – jediný zdroj pravdy
│   ├── useProfileStore   #   používateľ, fotky, preferencie
│   ├── useWardrobeStore  #   oblečenie
│   ├── useOutfitStore    #   outfity, obľúbené, história
│   ├── useSettingsStore  #   nastavenia (mesto, jednotky, prepínače)
│   └── useWeather(Store) #   počasie
│
├── services/             # ČISTÁ LOGIKA (žiadne UI)
│   ├── gemini/           #   všetky AI volania (pozri nižšie)
│   ├── db.ts             #   SQLite (db.web.ts = web verzia)
│   ├── images.ts         #   ukladanie/úprava obrázkov
│   ├── weather.ts        #   Open-Meteo
│   └── location.ts       #   GPS poloha
│
├── components/
│   ├── sorbet/           #   dizajnový kit (tlačidlá, čipy, nav, ...)
│   ├── onboarding/       #   komponenty onboardingu
│   ├── closet/           #   logika pridávania oblečenia
│   └── today/            #   karty outfitov
│
├── theme/                # BRAND TOKENY (farby, fonty, animácie)
│   ├── tokens.ts
│   ├── typography.ts
│   └── motion.ts
│
├── types/index.ts        # TypeScript typy (Garment, Outfit, UserProfile, ...)
└── utils/                # pomocné funkcie
```

### Ako tečú dáta

```
Obrazovka (src/app)
   ↓ číta / volá
zustand store (src/store)
   ↓ volá
služba (src/services)  ──►  SQLite / file-system / Gemini / Open-Meteo
```

Pravidlo: **obrazovky nikdy nevolajú Gemini ani databázu priamo.** Idú cez store, ten cez službu. Keď budeš niečo pridávať, drž sa tejto vrstvy.

### AI služby (`src/services/gemini/`)

| Súbor | Čo robí | Model |
|---|---|---|
| `client.ts` | jadro: kľúč, opakovania pri chybách, typy chýb, výber modelu | — |
| `analyzeGarment.ts` | z fotky oblečenia spraví štruktúrované štítky | `gemini-2.5-flash` |
| `generateOutfits.ts` | z príležitosti + počasia + šatníka spraví 2–3 outfity | `gemini-2.5-flash` |
| `enhanceGarment.ts` | prerenderuje kúsok na biele „studio" pozadie | `gemini-2.5-flash-image` |
| `tryOn.ts` | poskladá fotky používateľa + oblečenie do jedného obrázka | `gemini-2.5-flash-image` |

Modely sú definované na jednom mieste v `client.ts` v objekte `MODELS`.

---

## 7. Čo appka momentálne vie

| Obrazovka | Funkcie |
|---|---|
| **Onboarding** | email → meno → štýlový vibe → poloha/počasie → fotky postavy → fotka tváre → prvé kúsky. Dá sa prerušiť a vrátiť, fotky preskočiť. |
| **Today** | pozdrav, živé počasie, písanie príležitosti, prepínače slotov, 2–3 AI outfity, výmena kúskov ◀ ▶ (okamžitá), remix, obľúbené, „wear it ✨" → konfety + try-on. |
| **Closet** | mriežka oblečenia s vyhľadávaním a filtrami; každý kúsok AI oštítkovaný a prerenderovaný na biele pozadie. |
| **Saved** | obľúbené outfity + história „outfit dňa" s try-on obrázkami. |
| **You** | profil, prefotenie fotiek, štýlové preferencie, mesto/jednotky, prepínače, stav AI, vymazanie dát. |

### Čo ešte nie je hotové (známe „TODO")

- **Ikona a splash** appky sú zatiaľ čiastočne Expo defaulty — treba doplniť brandové.
- **Denná pripomienka**: prepínač v nastaveniach sa uloží, ale **zatiaľ nič reálne nenaplánuje** (expo-notifications nefunguje v Expo Go na Androide — treba dev build, pozri kapitolu 10).
- **Generovanie outfitov ešte nebolo otestované oproti živému Gemini API** (pôvodný autor nemal pri stavbe vložený kľúč). Toto je prvá vec, ktorú treba reálne preklikať, keď si vložíš kľúč.

---

## 8. Ako meniť a zlepšovať kvalitu

Tu sú hlavné „páčky", ktorými ovplyvníš, ako dobre appka funguje:

### a) Kvalita AI výstupov = prompty

Najväčší vplyv na to, aké dobré sú štítky, outfity a obrázky, majú **prompty**. Každý je v príslušnom súbore v `src/services/gemini/`:

- Chceš lepšie/inak skladané outfity? → uprav prompt a `SCHEMA` v **`generateOutfits.ts`**.
- Štítkovanie zaraďuje veci zle? → uprav prompt v **`analyzeGarment.ts`**.
- Biele studio fotky nevyzerajú dobre? → uprav `PROMPT` v **`enhanceGarment.ts`**.
- Try-on render nesedí? → uprav prompt a poradie/limit fotiek v **`tryOn.ts`**.

Postup je vždy ten istý: zmeň text promptu → ulož → v appke spusti danú akciu → pozri výsledok → dolaď. Pri promptoch buď konkrétny (presné inštrukcie fungujú lepšie než vágne).

### b) Výber modelu

V `src/services/gemini/client.ts` v objekte `MODELS` vieš prepnúť modely. Silnejší model = vyššia kvalita, ale pomalšie a drahšie. Pri zmene si over aktuálne názvy modelov v dokumentácii Google AI Studio.

### c) Kreativita vs. konzistentnosť

`generateContent` v `client.ts` prijíma `temperature`. Nižšia hodnota = stabilnejšie, predvídateľnejšie výstupy; vyššia = kreatívnejšie, ale rozkolísanejšie. Lad podľa toho, či chceš „bezpečné" alebo „odvážne" outfity.

### d) Vzhľad a brand

Všetko vizuálne (farby, fonty, zaoblenia, animácie) je v **`src/theme/`**:
- `tokens.ts` — farby, medzery, rádiusy
- `typography.ts` — fonty a veľkosti
- `motion.ts` — animácie

Komponenty sú v `src/components/sorbet/`. Originálny brand book (zdroj pravdy pre dizajn) je v `design/`.

### e) Po každej zmene spusti kontroly

```bash
npx tsc --noEmit     # nič nerozbil typovo?
npx expo lint        # štýl kódu OK?
```

---

## 9. Riešenie bežných problémov

| Problém | Riešenie |
|---|---|
| **„ai is napping" pri AI funkciách** | Nemáš vložený kľúč v `.env`, alebo si po jeho vložení nereštartoval(a) `expo start`. Reštartuj server (`Ctrl+C` a znova `npx expo start`). |
| **QR kód sa nenačíta / appka sa nepripojí** | Telefón a počítač musia byť na rovnakej Wi-Fi. Skús v termináli `npx expo start --tunnel`. |
| **„whoa, too fast" / rate limit** | Bezplatný Gemini má limity. Počkaj chvíľu, alebo si zvýš limit v Google AI Studio. |
| **Appka po zmene `.env` nevidí kľúč** | Premenné `.env` sa čítajú pri štarte — vždy reštartuj `expo start`. |
| **Zaseknutý stav / divné dáta** | V appke **You → vymazať všetky dáta**, alebo odinštaluj appku z Expo Go / vymaž dáta stránky v prehliadači (web). |
| **Chyby po `git pull`** | Spusti znova `npm install` (mohli pribudnúť závislosti). |
| **Denná pripomienka nič nerobí** | To je známe — notifikácie potrebujú dev build, nie Expo Go (kapitola 10). |

---

## 10. Cesta k reálnej mobilnej appke

Toto je prototyp v Expo Go. Aby z neho bola reálna appka v obchode, treba prejsť zhruba týmito krokmi (v poradí dôležitosti):

### Krok 1 — Schovaj Gemini kľúč za proxy (NUTNÉ pred vydaním)
Teraz je kľúč v balíku appky. Pred vydaním:
- postav malý backend (napr. serverless funkcia — Cloudflare Workers, Vercel, Firebase Functions),
- appka volá **tvoj** endpoint, ten zavolá Gemini s kľúčom uloženým na serveri,
- kľúč tým pádom nikdy neopustí server.
Toto je najdôležitejší krok — bez neho ti ktokoľvek vie ukradnúť a zneužiť kľúč.

### Krok 2 — Brandová ikona a splash screen
Doplň finálnu ikonu a splash do `assets/` a nastav ich v `app.json`. Predlohy sú v `design/` (napr. `app-icons.jsx`, `logo-favicon.jsx`).

### Krok 3 — Dev build (kvôli notifikáciám a natívnym funkciám)
Denná pripomienka (a ďalšie natívne veci) potrebuje **development build** namiesto Expo Go:
```bash
npm install -g eas-cli
eas build:configure
eas build --profile development --platform ios   # alebo android
```
V tomto builde dorob naplánovanie notifikácií cez `expo-notifications`.

### Krok 4 — Otestuj AI naživo a dolaď prompty
Vlož kľúč a reálne preklikaj: štítkovanie, generovanie outfitov, try-on. Dolaď prompty podľa kapitoly 8. (Toto je aj jediná veľká vec, ktorá ešte nebola overená oproti živému API.)

### Krok 5 — Produkčný build a publikácia
```bash
eas build --profile production --platform ios      # appka pre App Store
eas build --profile production --platform android  # appka pre Google Play
eas submit                                          # odoslanie do obchodu
```
Budeš potrebovať platený Apple Developer účet (99 USD/rok) a/alebo Google Play Console účet (jednorazovo 25 USD).

### Voliteľne — backend, prihlasovanie, synchronizácia
Ak budeš chcieť, aby používateľ mal dáta na viacerých zariadeniach alebo zálohu, pridaj backend (napr. **Supabase** — databáza + auth + úložisko obrázkov). Dnes je všetko len lokálne v telefóne.

> 📚 **Dôležité pri akejkoľvek zmene kódu**: tento projekt beží na konkrétnej verzii Expo (SDK 56). Vždy si over presnú, verziovanú dokumentáciu na **https://docs.expo.dev/versions/v56.0.0/** — API sa medzi verziami mení.

---

## 11. Ako si pomôcť s Claude / AI agentom

Najrýchlejší spôsob, ako sa v projekte zorientovať, je otvoriť ho v **Claude Code** (alebo inom AI agentovi, ktorý vie čítať súbory v repozitári).

- Súbor **`AGENTS.md`** (a `CLAUDE.md`, ktorý ho importuje) dá agentovi kompletný kontext — pozná architektúru, dôležité rozhodnutia aj tento návod.
- Pokojne sa pýtaj po slovensky, napríklad:
  - *„Vysvetli mi, ako funguje generovanie outfitov a kde je prompt."*
  - *„Chcem zmeniť hlavnú farbu appky na zelenú — čo mám upraviť?"*
  - *„Preveď ma krok za krokom cez vytvorenie proxy backendu pre Gemini kľúč."*
  - *„Prečo mi pri pridaní oblečenia píše chybu? Pomôž mi to odladiť."*

Agent vie čítať kód aj tento návod, takže ťa vie previesť konkrétne pre tento projekt — nielen všeobecne.

---

Veľa šťastia! Keď sa niekde zasekneš, začni pri kapitole 9, a ak to nestačí, opýtaj sa Claude priamo v projekte. ✨
