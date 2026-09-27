# OutfitSpin: next level (27. 9. 2026)

Z prototypu „fitted“ sa stal **OutfitSpin**: nové meno, onboarding, ktorý predáva, freemium s paywallom (zatiaľ mock nákup) a funkcie, ktoré ľudí vracajú do appky každý deň. Screenshoty celého toku sú v `docs/next-level/` (01 až 29, poradie = poradie v appke).

## 1. Premenovanie
- `app.json`: name `OutfitSpin`, slug a scheme `outfitspin`, `bundleIdentifier` a `package` `com.outfitspin.app`, texty povolení.
- `package.json` name `outfitspin`. Logo ako text: `SWordmark` (outfit + spin v brandových farbách).
- Doména outfitspin.com ešte **nie je kúpená** (kupuje sa iba s áno od Timura). Odkazy na terms/privacy a pozvánky už na ňu mieria.

## 2. Onboarding (17 krokov, `src/app/(onboarding)/`)
Poradie je v `ONBOARDING_STEPS` (`src/store/useProfileStore.ts`):

welcome → goals → struggle → mornings → style → name → location → insight → body-photos → face-photo → wardrobe → reminder → building → plan → email → paywall → done

- **Kvíz** (goals, struggle, mornings): odpovede sú v `components/onboarding/quiz.ts` a ukladajú sa do profilu. Personalizujú ďalšie obrazovky.
- **insight**: „90 hodín ročne späť“ vypočítané z odpovede, koľko minút ráno vyberá oblečenie.
- **building → plan**: krátka „stavím tvoj plán“ animácia a potom osobný plán (prvý spin z vlastného šatníka cez `localStylist`, štýl, čo pre ňu appka spraví).
- **email**: voliteľný, s validáciou, dá sa preskočiť.
- **Tlačidlo späť a progress** sú v hlavičke (`_layout.tsx`). Späť preskočí prechodné kroky (building). Keď appku zabije uprostred, pokračuje od kroku, kde skončila.
- Fotky, poloha, šatník a pripomienka sa dajú preskočiť, nič nie je povinné.

## 3. Monetizácia: OutfitSpin Plus
- **Ceny** (`src/services/purchases.ts` → `PLANS`): ročne 39,99 € so 7-dňovým trialom (vychádza 3,33 €/mes, „save 58 %“), mesačne 7,99 € bez trialu. V USA rovnaké čísla v $. **Finálne ceny potvrdí Timur.**
- **Free limity** (`src/store/useSubscriptionStore.ts` → `FREE_LIMITS`): 3 spiny denne, 3 try-ony mesačne, 30 kúskov v šatníku, plánovanie na dnes a zajtra. Plus: spiny bez limitu, 50 try-onov mesačne (fair use, každý render stojí peniaze), šatník bez limitu, celý týždeň dopredu.
- **Paywall** (`components/paywall/PaywallView.tsx`): jeden komponent, text podľa dôvodu (`onboarding`, `spins`, `tryon`, `closet`, `planner`, `profile`). Časová os trialu (dnes / deň 5 pripomienka / deň 7 platba), „no payment due now“, restore, terms, privacy. Soft: vždy sa dá zavrieť („continue with the free plan“ / „maybe later“).
- **Kde sa ukáže**: v onboardingu pred koncom, pri 4. spine za deň, pri try-one nad limit, pri plnom šatníku, pri plánovaní ďalej ako zajtra, z profilu (karta „try plus free for 7 days“).
- **MOCK nákup**: `purchasePlan()` iba simuluje obchod a uloží falošnú účtenku do AsyncStorage. Nič sa neplatí. Na paywalle je nápis „demo mode · purchases are simulated“.
- **Prechod na ostré platby**: v `purchases.ts` je návod na RevenueCat (`react-native-purchases`, treba EAS dev build, nie Expo Go). Obrazovky volajú iba `useSubscriptionStore`, takže sa menia len tri funkcie.

## 4. Retencia (dôvody vrátiť sa)
- **Séria** (`/streak`, `store/useStreak.ts`): počíta dni, keď si „oblečie“ outfit. Oheň s číslom na Today, obrazovka s týždňom a zdieľaním.
- **Plánovač týždňa** (`/planner`, `store/usePlannerStore.ts`): outfit na každý deň dopredu. Free dnes a zajtra, ostatné dni zamknuté za Plus.
- **Pozvi kamaráta** (`/invite`): kód a odkaz `outfitspin.com/i/<KÓD>`, „daj mesiac, dostaneš mesiac“. **Zatiaľ iba UI**, odmeny treba backend.
- **Ranná pripomienka** v onboardingu (čas sa uloží). Naozajstné plánovanie notifikácií potrebuje dev build (expo-notifications).
- **Offline spin** (`services/localStylist.ts`): bez Gemini kľúča appka poskladá outfity pravidlami (teplota, príležitosť, štýl), takže funguje hneď. S kľúčom ide plný AI stylista.
- **Today**: počítadlo zostávajúcich spinov („2 of 3 free spins left today · go unlimited“).

## 5. Pre vývoj
- `dev/gallery` (dole v You): prepínač free/plus, vyčerpanie a reset limitov, **load demo closet** (12 kúskov, `services/demoCloset.ts`).
- Kontroly: `npx tsc --noEmit` a `npx expo lint` sú čisté. Web preklikaný celý (free cesta aj mock nákup) bez chýb v konzole.

## 6. Čo ešte chýba pred vydaním
1. RevenueCat + produkty v App Store Connect a Play Console (ceny potvrdiť).
2. Proxy pre Gemini kľúč (návrh: Vercel). Bez neho nesmie ísť appka do obchodu.
3. Backend na pozvánky, e-maily (profil, upozornenie pred koncom trialu) a waitlist webu.
4. Notifikácie (dev build), ikona a splash v brande OutfitSpin.
5. Kúpiť outfitspin.com, terms a privacy stránky.
6. Otestovať AI naživo s Gemini kľúčom (štítkovanie, spiny, try-on).
