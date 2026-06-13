# fitted — tvoj fit, ale zábavnejšie ✨

AI pomocník do šatníka, postavený v **Expo** (primárne iOS, funguje aj Android a web). Odfotíš si oblečenie, povieš appke o svojom dni a ona ti vyskladá outfity **z vecí, ktoré naozaj vlastníš** — s ohľadom na počasie, s výmenou jednotlivých kúskov a s AI „try-on" náhľadom, kde vidíš *seba* v danom outfite.

Appka implementuje **FITTED Sorbet brand book** (pozri priečinok `design/`): fonty Gabarito × Hanken Grotesk, cukríková paleta, pružná animácia, hravý kamarátsky tón písaný malými písmenami.

> 📖 **Si nový v tomto projekte a chceš ho prevziať?** Otvor **[`NAVOD.md`](./NAVOD.md)** — je to kompletný návod po slovensky: od inštalácie cez to, ako appka funguje, až po to, ako z nej spraviť reálnu appku v App Store / Google Play.
>
> 🤖 **Pracuješ s Claude / AI agentom?** Súbor **[`AGENTS.md`](./AGENTS.md)** ho naladí na tento projekt — pozná architektúru, dôležité rozhodnutia a vie ťa krok za krokom previesť.

---

## Rýchly štart

```bash
npm install
cp .env.example .env       # potom doň vlož svoj Gemini kľúč
npx expo start             # naskenuj QR kód appkou Expo Go
```

Bezplatný Gemini API kľúč získaš na **https://aistudio.google.com/apikey**.

> ⚠️ **Pozor na kľúč.** Kľúč je napojený cez `EXPO_PUBLIC_GEMINI_API_KEY`, čo znamená, že sa **zabuduje priamo do balíka appky**. Pre tento lokálny prototyp je to v poriadku, ale **takto NIKDY nepúšťaj produkčný build do obchodu** — najprv schovaj AI volania za malý proxy backend (detaily v `NAVOD.md`). Appka beží aj bez kľúča — AI funkcie len ukážu milé hlášky typu „ai is napping".

---

## Čo appka vie

- **Onboarding** — email → meno → štýlový vibe → poloha/počasie → fotky postavy (spredu/zboku/zozadu) → fotka tváre → prvé kúsky do šatníka. Dá sa prerušiť a vrátiť sa, fotky sa dajú preskočiť.
- **Today (Dnes)** — pozdrav + živé počasie (Open-Meteo, bez kľúča), políčko na napísanie príležitosti („pracovná porada, potom večera…"), prepínače slotov (vrch/spodok/topánky/ponožky/doplnky/vrchné oblečenie), 2–3 prejditeľné AI návrhy outfitov s výmenou kúskov cez ◀ ▶ (okamžitá, bez ďalších API volaní), remix, obľúbené a **wear it ✨** → konfety + try-on render.
- **Closet (Šatník)** — vyhľadávateľná a filtrovateľná mriežka. Každý pridaný kúsok AI oštítkuje (kategória, farby, štýl, teplota, formálnosť) a na pozadí ho prerenderuje ako čistú „studio" fotku na bielom pozadí.
- **Saved (Uložené)** — obľúbené + história „outfit dňa" s try-on obrázkami.
- **You (Ty)** — profil, prefotenie fotiek, štýlové preferencie, mesto/jednotky, prepínače, stav AI, vymazanie všetkých dát. (Skrytý odkaz na galériu komponentov je úplne dole.)

---

## Architektúra v skratke

- **Lokálne v1**: žiadny backend. SQLite (`expo-sqlite`) na oblečenie/outfity, AsyncStorage na profil/nastavenia (zustand persist), `expo-file-system` na všetky obrázky. Žiadny base64 sa nikdy neukladá do databázy.
- **AI**: Gemini cez obyčajný `fetch` — `gemini-2.5-flash` na vizuálne štítkovanie + uvažovanie nad outfitmi (štruktúrované JSON s následnou kontrolou ID), `gemini-2.5-flash-image` na vylepšenie produktových fotiek a virtuálny try-on.
- **Vrstvy**: obrazovky (`src/app`) → zustand stores (`src/store`) → čisté služby (`src/services`). Brand tokeny v `src/theme`, Sorbet komponenty v `src/components/sorbet`.

---

## Kontroly

```bash
npx tsc --noEmit     # typová kontrola
npx expo lint        # linter
```
