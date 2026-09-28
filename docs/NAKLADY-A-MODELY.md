# OutfitSpin: náklady na AI a výber modelov

Stav k 27. 9. 2026. Všetky ceny sú v USD za volanie, pokiaľ nie je uvedené inak. Každá cena má zdroj v zozname na konci (číslo v hranatých zátvorkách) a všetky zdroje boli overené 27. 9. 2026. Čo sa nedalo overiť, je označené **neoverené**. Kurz: 1 € = 1,1367 $ (referenčný kurz ECB z 24. 9. 2026 [22]).

## 0. Čo appka dnes naozaj volá (z kódu)

| Volanie | Súbor | Model | Vstup | Kedy |
|---|---|---|---|---|
| analyzeGarment | `src/services/gemini/analyzeGarment.ts` | `gemini-2.5-flash` | fotka zmenšená na 768 px + prompt, JSON schéma | pri každom pridaní kúsku (`useIngestGarment.ts`) |
| enhanceGarment | `src/services/gemini/enhanceGarment.ts` | `gemini-2.5-flash-image` | fotka 1024 px, výstup obrázok | automaticky pre **každý** kúsok cez `queueEnhancement` |
| generateOutfits | `src/services/gemini/generateOutfits.ts` | `gemini-2.5-flash` | iba text: celý katalóg šatníka (JSON riadok na kúsok), počasie, príležitosť; pri chybe druhý pokus | každý spin, ak je nastavený kľúč (`useOutfitStore.spin`) |
| generateTryOn | `src/services/gemini/tryOn.ts` | `gemini-2.5-flash-image` | až 8 obrázkov po 768 px (tvár, postava spredu, bok, kúsky) | na obrazovke `try-on/[outfitId].tsx` |

Postrehy z kódu, ktoré menia náklady:
- `client.ts` nenastavuje `thinkingConfig`, takže `gemini-2.5-flash` premýšľa v predvolenom režime a premýšľacie tokeny sa platia ako výstup [1][3]. Pri spine je to väčšina ceny.
- V `buildPrompt` je katalóg šatníka **až za** riadkami s počasím a príležitosťou. Tie sa menia pri každom spine, takže sa nedá využiť automatická vyrovnávacia pamäť (cache) na zhodný začiatok promptu.
- Offline stylista (`src/services/localStylist.ts`) už existuje a skladá outfity pravidlami (teplota, príležitosť, štýl) zadarmo. Dnes sa použije iba vtedy, keď chýba kľúč.
- Limity (`useSubscriptionStore.ts`) sa počítajú iba lokálne v AsyncStorage. Preinštalovanie appky ich vynuluje a kľúč `EXPO_PUBLIC_GEMINI_API_KEY` je v balíku appky. Bez servera (proxy) sa náklady na free užívateľov nedajú ustrážiť, nech zvolíme akýkoľvek model.
- `gemini-2.5-flash-image` Google vypína 2. 10. 2026, odporúčaná náhrada je `gemini-3.1-flash-image` [2]. Zmena je **nutná** o 5 dní, inak prestane fungovať úprava fotiek aj skúšanie.

## 1. Cenník, z ktorého počítame

### Google Gemini API (platená úroveň) [1]
| Model | Vstup / 1M tok. | Výstup / 1M tok. | Dávkovo a Flex | Poznámka |
|---|---|---|---|---|
| gemini-2.5-flash | 0,30 | 2,50 | 0,15 / 1,25 | bez dátumu vypnutia [2] |
| gemini-2.5-flash-lite | 0,10 | 0,40 | 0,05 / 0,20 | Google obmedzuje prístup k modelom 2.5 na účty, ktoré ich už aktívne používali [2] |
| gemini-3.1-flash-lite | 0,25 | 1,50 | 0,125 / 0,75 | vypnutie 7. 5. 2027, náhrada 3.5-flash-lite [2] |
| gemini-3.5-flash-lite | 0,30 | 2,50 | 0,15 / 1,25 | predvolene „minimal“ premýšľanie [3] |
| gemini-3-flash (preview) | 0,50 | 3,00 | 0,25 / 1,50 | |
| gemini-3.8-flash | 0,75 | 3,75 | 0,375 / 1,875 | |
| Gemma 4 (cez Gemini API) | zadarmo | zadarmo | platená úroveň neexistuje | iba bezplatná úroveň s jej podmienkami |

Obrazové modely [1][4]:
| Model | Cena za obrázok | Dávkovo | Poznámka |
|---|---|---|---|
| gemini-2.5-flash-image (končí 2. 10.) | 0,039 | 0,0195 | |
| gemini-3.1-flash-image (Nano Banana 2) | 0,045 pri 512 px, 0,067 pri 1K, 0,101 pri 2K | polovica | do 10 predmetov a 4 osôb ako predloha [4] |
| gemini-3.1-flash-lite-image (Nano Banana 2 Lite) | 0,0336 pri 1K (iba 1K) | polovica | do 14 predmetov ako predloha [4], bezplatná úroveň nie je |
| gemini-3-pro-image (Nano Banana Pro) | 0,134 pri 1K a 2K | polovica | |

Ďalšie fakty: vstupný obrázok stojí 258 tokenov za dlaždicu 768×768 [5]; Gemini 3 má parameter `media_resolution` na zníženie tokenov za obrázok [5]. Dávkový režim má cieľ do 24 hodín a zľavu 50 % a podporuje aj obrazové modely [6]. Flex má zľavu 50 %, odozvu 1 až 15 minút, beží „podľa možností“ a obrazové modely **nepodporuje** [7].

### OpenAI [8][9]
| Model | Cena |
|---|---|
| gpt-5-nano | 0,05 vstup / 0,40 výstup za 1M tok. |
| gpt-5-mini | 0,25 / 2,00 |
| gpt-5.4-nano | 0,20 / 1,25 |
| gpt-4.1-nano | 0,10 / 0,40 |
| gpt-image-1-mini | 0,005 (nízka), 0,011 (stredná), 0,036 (vysoká) za 1024×1024; 0,006 / 0,015 / 0,052 za 1024×1536; vstupný obrázok 2,50 za 1M tok. |
| gpt-image-2 | cenu za obrázok sa nepodarilo overiť (**neoverené**) |

### Otvorené modely na videnie [10][11]
- DeepInfra: Llama-4-Scout 0,10 / 0,30, Qwen3-VL-30B-A3B 0,15 / 0,60, Qwen3-VL-235B 0,20 / 0,88 za 1M tok. [10]
- Groq: vizuálny model `qwen/qwen3.8-27b`, obrázok = 2048 vstupných tokenov, max. 3 obrázky na požiadavku [11]. Cenu sa nepodarilo overiť (**neoverené**).
- OpenRouter: modely `:free` majú limit 50 požiadaviek denne, po nákupe kreditu 10 $ je to 1000 denne, vždy max. 20 za minútu [12]. Na produkčnú appku nevhodné.

### Virtuálne skúšanie a úprava fotiek u tretích strán [13][14][15][16][17]
| Služba | Cena | Viac kúskov naraz | Komerčne |
|---|---|---|---|
| FASHN v1.6 (fal) | 0,075 za generovanie, 864×1296 | nie, jeden kúsok na volanie | áno [13] |
| FASHN priamo | od 0,075, pri záväzku efektívne cca 0,049 [14]; Try-On Max = 4 kredity [15] | nie | áno |
| Kling Kolors v1.5 (fal) | 0,07 | nie | áno [16] |
| fal image-apps-v2 virtual try-on | 0,04 | nie | áno [17] |
| FLUX Virtual Try-On Pro (fal) | 0,0375 za MP vstupu | nie | áno [14] |
| Leffa (fal) | 0,10 | nie | áno, v teste menil tvár [14] |
| Nano Banana 2 edit (fal) | 0,08 za 1K (512 px 0,75×, 2K 1,5×), do 14 predlôh | áno | áno [18] |
| Seedream 4.5 edit (fal) | 0,04 | áno | áno [19] |
| Qwen Image Edit Plus (fal) | 0,03 za MP | áno (ukážka s 3 obrázkami) | áno [19] |
| FLUX.1 Kontext max multi (fal) | 0,08, max. 2 obrázky | iba 2 | áno [19] |
| IDM-VTON (Replicate) | 0,024, cca 17 s | nie | **nie**, licencia CC BY-NC-SA [20] |
| CatVTON (fal) | 0,00125 za sekundu výpočtu | nie | **nie**, iba výskum [14] |
| kie.ai Nano Banana 2 | „od 0,04“ [21]; presný cenník sa nepodarilo načítať (**neoverené**) | áno | sprostredkovateľ |
| kie.ai Nano Banana 2 Lite | uvádza oficiálnu cenu 0,034, odozva cca 4 s [21] | áno | sprostredkovateľ |

Odstránenie pozadia: remove.bg 0,05 až 0,20 za obrázok, Bria RMBG 2.0 na fal 0,018, BiRefNet v2 na fal 0,0008 za sekundu výpočtu (údaje z porovnania fal, **cena remove.bg neoverená priamo**) [23].

### V telefóne zadarmo [24][25][26][27]
- **iOS 17+ Vision** (`VNGenerateForegroundInstanceMaskRequest`) a **Android ML Kit Subject Segmentation** (beta, cez Google Play services, minSdk 24) vystrihnú kúsok z pozadia v telefóne. Pre Expo existujú moduly `expo-background-removal` a `expo-ai-kit` (MIT); potrebujú vlastný build (dev build/EAS), nie Expo Go [24][25].
- **Apple Foundation Models**: od iOS 27 (vyšiel 14. 9. 2026 [26]) prijímajú aj obrázok a vedia vrátiť štruktúrovaný výstup (`@Generable`), iba na zariadeniach s Apple Intelligence [27]. Balík pre React Native bol v júni 2026 „na ceste“ [28], aktuálny stav **neoverený**.
- **Gemini Nano (ML Kit GenAI Prompt API)**: text aj obrázok na vstupe, najlepšie na Pixel 10, podpora aj Pixel 8+, Samsung S24+ a ďalšie [29].
- Kvalita týchto modelov na štítkovanie oblečenia **nie je overená**. Treba otestovať na 30 reálnych fotkách.

## 2. A) Lacnejšie alternatívy pre každé volanie

Odhad tokenov: štítkovanie cca 1500 vstupných tokenov (obrázok 768 px + prompt), 200 výstupných; spin s 30 kúskami cca 3100 vstupných a 450 výstupných, s premýšľaním 2.5 Flash odhadom +2000 tokenov (odhad, reálne číslo treba zmerať z `usageMetadata`).

### analyzeGarment (štítkovanie kúsku)
| Možnosť | Cena za kúsok | Poznámka |
|---|---|---|
| Dnes: 2.5 Flash s premýšľaním | cca 0,0025 | |
| 2.5 Flash bez premýšľania (`thinkingBudget: 0`) | cca 0,001 | voľbu 0 potvrdzuje staršia dokumentácia, aktuálna stránka ju neuvádza (**neoverené**) [3] |
| **3.1 Flash-Lite, minimal** | **cca 0,0008** | odporúčané; vypnutie v máji 2027, ID modelu držať v konfigurácii |
| 2.5 Flash-Lite | cca 0,0002 | najlacnejšie od Googlu, ale nový projekt k nemu nemusí mať prístup [2] |
| gpt-5-nano | cca 0,0002 | druhý poskytovateľ, kvalita **neoverená** |
| Llama-4-Scout / Qwen3-VL na DeepInfra | pod 0,001 | kvalita a stabilita **neoverené** |
| Apple FM (iOS 27) / Gemini Nano | 0 | iba novšie telefóny, kvalita **neoverená**, cloud ako záloha |

Úspora je malá v dolároch (30 kúskov = 0,075 $ → 0,02 $), ale je jednoduchá.

### enhanceGarment (produktová fotka): najväčší jednorazový náklad
| Možnosť | Cena za kúsok | 30 kúskov |
|---|---|---|
| Dnes 2.5 Flash Image | 0,039 | 1,17 |
| Po 2. 10. vynútene 3.1 Flash Image 1K | 0,067 | 2,01 |
| 3.1 Flash-Lite Image 1K | 0,0336 | 1,01 |
| to isté v dávkovom režime (hotové do 24 h) | 0,0168 | 0,50 |
| Bria RMBG na fal / BiRefNet | 0,018 / zlomky centu | 0,54 / pod 0,1 |
| **Vystrihnutie v telefóne + biele pozadie a tieň v appke** | **0** | **0** |

Odporúčanie: štandardne vystrihnúť v telefóne (Vision / ML Kit), zložiť na biele pozadie s jemným tieňom lokálne. AI „štúdiovú fotku“ nechať ako tlačidlo pre Plus (alebo 3 kusy pre free), na 3.1 Flash-Lite Image, prípadne dávkovo cez noc.

### generateOutfits (spin)
| Možnosť | Cena za spin (30 kúskov) |
|---|---|
| Dnes 2.5 Flash s premýšľaním | cca 0,007 (plus druhý pokus pri chybe) |
| 2.5 Flash bez premýšľania | cca 0,002 |
| **3.1 Flash-Lite, minimal** | **cca 0,0016** (pri 200 kúskoch cca 0,005) |
| 3.1 Flash-Lite cez Flex | cca 0,0008, ale odozva minúty, na spin nevhodné |
| 2.5 Flash-Lite / gpt-5-nano | cca 0,0005 |
| Gemma 4 cez Gemini API | 0, ale iba bezplatná úroveň s neznámymi limitmi a použitím dát na zlepšovanie mimo EHP [1][30] |
| **Lokálny stylista (už v kóde)** | **0** |

Vyrovnávacia pamäť: presunúť pevné inštrukcie a katalóg na začiatok promptu, meniace sa veci (počasie, príležitosť, zakázané kombinácie) na koniec. Cena uloženého kontextu je pri 3.1 Flash-Lite 0,025 za 1M tok. oproti 0,25 [1]. Pri 30 kúskoch je úspora malá, pri veľkých šatníkoch Plus citeľná. Explicitné ukladanie má aj poplatok za uloženie (**výška neoverená**), preto stačí automatické.

### tryOn (virtuálne skúšanie): hlavná wow funkcia
| Možnosť | Cena za obrázok | Viac kúskov | Poznámka |
|---|---|---|---|
| Dnes 2.5 Flash Image | 0,039 + vstup | áno | končí 2. 10. |
| 3.1 Flash Image 512 px | 0,045 + cca 0,003 vstup | áno | na telefón postačí, lacnejšie než 1K |
| 3.1 Flash Image 1K | 0,067 + cca 0,003 | áno | priama náhrada |
| **3.1 Flash-Lite Image 1K** | **0,0336 + cca 0,002** | áno, 14 predmetov | zachovanie tváre osoby **neoverené**, Google pri Lite neuvádza počet osôb [4] |
| Nano Banana Pro | 0,134 + cca 0,013 | áno | najvyššia kvalita od Googlu |
| gpt-image-1-mini stredná | 0,011 (+ vstupné obrázky) | áno | lacné, vernosť tváre **neoverená** |
| Seedream 4.5 edit (fal) | 0,04 | áno | kvalita tváre **neoverená** |
| FASHN / Kolors / image-apps-v2 | 0,04 až 0,075 **za kúsok** | nie | celý outfit = 2 až 4 volania, teda 0,08 až 0,30 |
| IDM-VTON, CatVTON | 0,024 / zlomky centu | nie | **nesmú sa použiť komerčne** |

Záver: na celé outfity sú špecializované VTON modely drahšie, lebo berú jeden kúsok na volanie. Najvýhodnejšia je rodina Nano Banana 2, konkrétne Lite (0,034) ako predvolená a 3.1 Flash Image ako „HD“ verzia.

## 3. B) Architektonické úspory

1. **Spin bez AI pre free.** `localStylist` už existuje. Free: neobmedzené lokálne spiny + 1 „AI stylista dňa“ denne. Plus: AI spiny bez limitu. Úspora pri plnom využití free: 90 × 0,007 = 0,63 $ mesačne na užívateľa → 0,05 $.
2. **Úprava fotky v telefóne** namiesto obrazového modelu pre každý kúsok. Úspora 1 až 2 $ na nového užívateľa.
3. **Proxy server** (je aj tak povinný pred vydaním, `NEXT-LEVEL.md` bod 6.2). Limity počítať na serveri podľa účtu alebo zariadenia (App Attest / Play Integrity), kľúč nikdy v appke. Bez toho sa dá appka zneužiť ako bezplatný generátor obrázkov na náš účet.
4. **Vyrovnávacia pamäť výsledkov.** Skúšanie: kľúč = hash(fotka postavy + zoznam ID kúskov). Ten istý outfit sa nerenderuje dvakrát. Spin: pri rovnakom šatníku, dni a príležitosti vrátiť uložený výsledok.
5. **Predgenerovanie cez dávkový režim** (50 % zľava, do 24 h [6]): v noci pre Plus „zajtrajší outfit na tebe“ za 0,017 (Lite) alebo 0,034 (3.1 Flash 1K). Ráno je hotový a prvé otvorenie appky má wow efekt.
6. **Menšie rozlíšenie.** Skúšanie na 512 px pri 3.1 Flash (0,045 namiesto 0,067), vstupné obrázky 768 px stačia, na Gemini 3 nastaviť `media_resolution`. Posielať iba tvár + postavu spredu, bok iba ak treba.
7. **Premýšľanie vypnúť alebo na minimum** všade, kde ide o štruktúrovaný JSON.
8. **Bezplatné úrovne poskytovateľov nepoužívať v produkcii s fotkami ľudí.** Bezplatná úroveň Gemini: obsah sa používa na zlepšovanie produktov Google a môžu ho čítať ľudskí hodnotitelia; výnimka je EHP, UK a Švajčiarsko, kde platia podmienky platenej úrovne [30]. Obrazové modely 3.1 bezplatnú úroveň nemajú vôbec [1]. Limit Flash-Lite 500 požiadaviek denne uvádza iba tretia strana [31], oficiálne limity sú až v AI Studio (**neoverené**).

## 4. C) Kvalita, rýchlosť, riziká

**Kvalita skúšania.** Google Nano Banana 2 a Pro sú jediné overené možnosti, ktoré spracujú tvár, postavu aj viac kúskov naraz v jednom volaní [4]. FASHN a Kolors majú dobrú vernosť vzorov a textu na kúsku [13][16], ale po jednom kúsku. Lite, gpt-image-1-mini a Seedream sú lacnejšie, ich vernosť tváre na našich fotkách je **neoverená**. Návrh testu: 20 outfitov × 4 modely (Lite, 3.1 Flash 512 px, 3.1 Flash 1K, gpt-image-1-mini stredná) stojí cca 3 $ a rozhodne to s istotou.

**Rýchlosť.** kie.ai uvádza pre Lite cca 4 s na 1K obrázok [21], IDM-VTON cca 17 s [20]. Ostatné časy sa nepodarilo overiť. Flex (minúty) a dávkový režim (do 24 h) sú iba na predgenerovanie [6][7]. Textové volania na Flash-Lite s minimálnym premýšľaním sú rýchlejšie ako dnešný 2.5 Flash s premýšľaním (**konkrétne čísla neoverené**).

**Riziká.**
- **Vek 18+.** Podmienky Gemini API zakazujú použitie v appke, ktorá je určená alebo pravdepodobne používaná osobami pod 18 rokov [30]. Módna appka s tínedžermi je presne tento prípad. Treba vekovú hranicu 18+ v obchode aj v onboardingu, alebo iného poskytovateľa pre mladších (podmienky OpenAI **neoverené**).
- **Súkromie fotiek tela.** Iba platené úrovne, žiadni sprostredkovatelia bez jasných podmienok. Fotky neukladať na serveri dlhšie, ako trvá generovanie. Do privacy policy uviesť poskytovateľa a účel.
- **Sprostredkovatelia (kie.ai, lacné „API brány“).** Ceny sú nízke, ale podmienky spracovania dát, stabilita a súlad so zmluvou Google sú neisté. Na fotky ľudí nie. Porovnávací článok uvádza pre Nano Banana 2 ceny od 0,002 do 0,055 $ podľa brány [32], čo samo svedčí o neštandardnom pôvode.
- **Nekomerčné licencie.** IDM-VTON a CatVTON sa nesmú použiť [14][20].
- **Vypínanie modelov.** 2.5 Flash Image končí 2. 10. 2026, 3.1 Flash-Lite 7. 5. 2027 [2]. ID modelov držať na serveri (proxy), aby sa dali meniť bez vydania appky.
- **Vodoznak.** Všetky obrázky z Gemini majú SynthID [4]. Pri zdieľaní na sociálne siete to nevadí, ale je dobré to vedieť.

## 5. D) Tri zostavy

Predpoklady: free užívateľ na maxime = využije všetky limity; typický = 40 % limitov (predpoklad). Plus: 150 AI spinov a 20 nových kúskov mesačne. Tržba po DPH 20 % (SK, v iných krajinách iná) a 15 % pre obchod: mesačný plán 5,66 € = **6,43 $**, ročný plán 2,36 € mesačne = **2,68 $**, mix 70 % ročných / 30 % mesačných = **3,81 $** (mix je predpoklad). Bod zlomu = podiel platiacich z aktívnych, pri ktorom marža Plus pokryje free užívateľov. Neráta sa server, RevenueCat ani marketing.

### Zostava 1: Najlacnejšia
- Free: iba lokálne spiny, vystrihnutie fotky v telefóne, štítkovanie 3.1 Flash-Lite, 1 skúšanie mesačne na 3.1 Flash-Lite Image.
- Plus: AI spiny 3.1 Flash-Lite, 30 skúšaní na Lite, bez AI produktových fotiek.
- **Free: 0,035 $/mes** (typicky 0,014), jednorazovo 0,02 $. **Plus: 1,30 $/mes** max, typicky 0,52 $.
- Marža: mesačný plán 80 % (max) až 92 %, ročný 51 až 81 %. Bod zlomu 0,4 % (mix, typicky) až 2,5 % (ročný, max).
- Slabina: free užívateľ skoro nezažije wow (1 skúšanie), horšia konverzia.

### Zostava 2: Vyvážená (odporúčaná)
- Free: neobmedzené lokálne spiny + **1 AI spin denne** (3.1 Flash-Lite, minimal), vystrihnutie v telefóne, štítkovanie 3.1 Flash-Lite, **3 skúšania mesačne na 3.1 Flash-Lite Image**.
- Plus: AI spiny bez limitu, **30 skúšaní mesačne** (Lite; „HD“ na 3.1 Flash Image 1K sa ráta za 2), 20 AI produktových fotiek mesačne (Lite), nočné predgenerovanie dávkovo.
- **Free: 0,15 $/mes** max (typicky 0,06 $), jednorazovo 0,02 $. **Plus: 1,99 $/mes** max, typicky 0,79 $.
- Marža: mesačný plán 69 % (max) až 88 % (typicky); ročný 26 až 70 %; mix 48 až 79 %.
- **Bod zlomu: 2,0 % konverzie pri typickom používaní (mix plánov)**, 3,1 % keby všetci brali ročný plán, 7,7 % v najhoršom prípade (všetci na maxime).

### Zostava 3: Najkvalitnejšia
- Free: 3 AI spiny denne (3.1 Flash-Lite), 3 skúšania na 3.1 Flash Image 1K, AI produktová fotka každého kúsku (Lite Image).
- Plus: 50 skúšaní na 3.1 Flash Image 1K (voliteľne Pro za 0,134), AI fotky kúskov.
- **Free: 0,35 $/mes** (typicky 0,14 $), jednorazovo **1,05 $**. **Plus: 4,44 $/mes** max, typicky 1,78 $.
- Ročný plán je pri plnom využití **stratový** (−1,76 $ mesačne), bod zlomu pri mixe a typickom používaní 6,5 %, pri ročnom 13,5 %.

### Pre porovnanie: dnešný stav po vynútenej zmene na 3.1 Flash Image
Free 0,84 $/mes max + 2,08 $ jednorazovo, Plus 5,94 $/mes max. Ročný plán aj mix sú pri plnom využití stratové, bod zlomu pri typickom mixe 19 %. **Dnešné nastavenie limitov (50 skúšaní v Plus pri ročnej cene 39,99 €) sa bez zmeny modelov nezaplatí.**

### Odporúčanie
**Zostava 2 (vyvážená).** Free užívateľ stojí 6 až 15 centov mesačne a zažije aj AI stylistu, aj 3 skúšania na sebe (wow moment na konverziu). Bod zlomu okolo 2 % je dosiahnuteľný (bežne uvádzané konverzie freemium áp sú v jednotkách percent, **neoverené**). Ak test kvality ukáže, že Lite nezachová tvár, prepnúť skúšanie na 3.1 Flash Image 512 px (0,048): free sa zvýši na 0,19 $ max a Plus pri 30 skúšaniach na 2,38 $.

## 6. E) Ako môžu modely zlepšiť appku

| Nápad | Model | Cena | Prínos |
|---|---|---|---|
| Viac kúskov z jednej fotky (celý outfit alebo skriňa) s rámčekmi, vystrihnutie v telefóne | 3.1 Flash-Lite | cca 0,001 za fotku | rýchlejší onboarding, viac kúskov = lepšie spiny |
| Farebná typológia z fotky tváre (jar, leto, jeseň, zima) a odporúčané farby | 3.1 Flash-Lite | cca 0,001 jednorazovo | osobné, zdieľateľné, vstup do stylistu |
| „Čo mi chýba“: analýza šatníka a 3 kúsky, ktoré by odomkli najviac outfitov, s partnerskými odkazmi | 3.1 Flash-Lite | cca 0,002 | **nový príjem** (provízie) bez nákladov na obrázky |
| Hodnotenie outfitu zo selfie v zrkadle (skóre + tip) | 3.1 Flash-Lite | cca 0,001 | denný dôvod otvoriť appku |
| Nočné „zajtrajší outfit na tebe“ | 3.1 Flash-Lite Image dávkovo | 0,017 | wow ráno, iba Plus |
| Skúšanie v HD alebo na scéne (kancelária, pláž) | 3.1 Flash Image 2K / Pro | 0,101 / 0,134 | prémiová funkcia, ráta sa za viac kreditov |
| Import z e-shopu alebo bločku (screenshot → kúsok) | 3.1 Flash-Lite | cca 0,001 | pridanie kúskov bez fotenia |
| Súkromné štítkovanie v telefóne (Apple FM na iOS 27, Gemini Nano) | on-device | 0 | marketing „fotky neopustia telefón“, kvalita **neoverená** |
| Krátke video outfitu (Veo 3.1 Lite) | Veo | cena **neoverená** | viralita na TikTok, iba za extra kredity |

## 7. Top zmeny v kóde (poradie)

1. **`client.ts` a všetky volania:** pridať `thinkingConfig` (minimal / budget 0), prepnúť `MODELS.reasoning` na `gemini-3.1-flash-lite` a `MODELS.image` na `gemini-3.1-flash-lite-image` s voliteľným `gemini-3.1-flash-image` pre HD. Termín: pred 2. 10. 2026. Model ID nech prichádza zo servera.
2. **`useOutfitStore.spin`:** free = `spinLocally` + 1 AI spin denne, Plus = AI. V `buildPrompt` presunúť inštrukcie a katalóg na začiatok a meniace sa údaje na koniec.
3. **`enhanceGarment.ts` / `useIngestGarment.ts`:** zrušiť automatickú AI úpravu každého kúsku, nahradiť vystrihnutím v telefóne (`expo-background-removal` alebo `expo-ai-kit`, potrebný dev build); AI štúdiová fotka iba na tlačidlo.
4. **Proxy server + limity na serveri** (už v zozname pred vydaním): kľúč preč z appky, počítadlá podľa účtu, vyrovnávacia pamäť skúšaní podľa hash, meranie `usageMetadata` pre skutočné náklady.
5. **`useSubscriptionStore.ts`:** `PLUS_LIMITS.tryOnsPerMonth` z 50 na 30 (HD = 2), veková hranica 18+ v onboardingu a v obchode.

## Zdroje (všetky overené 27. 9. 2026)

1. Gemini API, cenník: https://ai.google.dev/gemini-api/docs/pricing
2. Gemini API, vypínanie modelov: https://ai.google.dev/gemini-api/docs/deprecations
3. Gemini API, premýšľanie: https://ai.google.dev/gemini-api/docs/thinking
4. Gemini API, generovanie obrázkov: https://ai.google.dev/gemini-api/docs/image-generation
5. Gemini API, porozumenie obrázkom (tokeny): https://ai.google.dev/gemini-api/docs/image-understanding
6. Gemini API, dávkový režim: https://ai.google.dev/gemini-api/docs/batch-api
7. Gemini API, Flex: https://ai.google.dev/gemini-api/docs/flex-inference
8. OpenAI, cenník: https://developers.openai.com/api/docs/pricing
9. OpenAI, gpt-image-1-mini: https://developers.openai.com/api/docs/models/gpt-image-1-mini
10. DeepInfra, cenník: https://deepinfra.com/pricing
11. Groq, vizuálne modely: https://console.groq.com/docs/vision
12. OpenRouter, limity: https://openrouter.zendesk.com/hc/en-us/articles/39501163636379-OpenRouter-Rate-Limits-What-You-Need-to-Know
13. fal, FASHN v1.6: https://fal.ai/models/fal-ai/fashn/tryon/v1.6
14. fal, prehľad API na skúšanie (2. 7. 2026): https://fal.ai/learn/tools/best-virtual-try-on-apis-2026 a https://fashn.ai/pricing
15. FASHN, Try-On Max: https://fashn.ai/changelog/api-try-on-max-endpoint-now-available
16. fal, Kling Kolors v1.5: https://fal.ai/models/fal-ai/kling/v1-5/kolors-virtual-try-on
17. fal, image-apps-v2 virtual try-on: https://fal.ai/models/fal-ai/image-apps-v2/virtual-try-on
18. fal, Nano Banana 2 edit: https://fal.ai/models/fal-ai/nano-banana-2/edit
19. fal, Seedream 4.5 edit / Qwen Image Edit Plus / FLUX Kontext max multi: https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit , https://fal.ai/models/fal-ai/qwen-image-edit-plus , https://fal.ai/models/fal-ai/flux-pro/kontext/max/multi
20. Replicate, IDM-VTON: https://replicate.com/cuuupid/idm-vton
21. kie.ai, Nano Banana 2 a Lite: https://kie.ai/nano-banana-2 , https://kie.ai/nano-banana-2-lite
22. ECB kurz (cez prehľad): https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
23. fal, odstraňovače pozadia 2026: https://fal.ai/learn/tools/best-background-remover-apis-2026
24. expo-background-removal: https://github.com/Tomatopastesectionman8912/expo-background-removal
25. expo-ai-kit, vízia: https://expo-ai-kit.dev/guides/vision
26. iOS 27 vyšiel 14. 9. 2026: https://www.macrumors.com/2026/09/09/apple-announces-ios-27-release-date/
27. Foundation Models s obrázkom v iOS 27: https://blakecrosley.com/blog/foundation-models-image-input-ios-27 a https://developer.apple.com/videos/play/wwdc2026/241/
28. Callstack, on-device AI po WWDC 2026: https://www.callstack.com/blog/on-device-ai-after-wwdc-2026-whats-new
29. ML Kit GenAI Prompt API: https://developers.google.com/ml-kit/genai/prompt/android
30. Podmienky Gemini API: https://ai.google.dev/gemini-api/terms
31. Bezplatné limity Gemini (tretia strana): https://pecollective.com/tools/gemini-free-tier-guide/
32. Porovnanie brán Nano Banana (jún 2026): https://pctechmag.com/2026/06/the-2026-value-guide-to-nano-banana-apis-9-platforms-compared-on-cost-effectiveness/
