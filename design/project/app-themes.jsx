// app-themes.jsx — theme tokens for FITTED app screens. Exports: fittedAppThemes
// Each theme drives both AppHome and AppCloset.

const SCH = "'Schibsted Grotesk', sans-serif";

const fittedAppThemes = {
  /* A · Atelier — quiet luxury */
  atelier: {
    id: "atelier",
    bg: "#F5F0E6", fg: "#1C1812", muted: "#8A7F6B", rule: "#Dcd2bf",
    accent: "#6E2B27", accentFg: "#F5F0E6", cardBg: "#FFFDF8", tileBg: "#F7F2E8", chipBg: "#EFE9DB", chipFg: "#1C1812",
    navBg: "#FFFDF8", weatherBg: "#EAE0CC", weatherFg: "#6E2B27", weatherIcon: "sun",
    displayFont: "'Marcellus', serif", bodyFont: "'Mulish', sans-serif",
    cardRadius: 6, btnRadius: 4, headTrack: "0.04em", greetingSize: 32,
    outline: false, hardShadow: false, upper: true, lowerHead: false,
    cardShadow: "none", ghostBg: "",
    dateStr: "Tuesday · 12 May", greeting: "Good morning, Mara", weather: "17° · Clear all day",
    outfitName: "The Gallery Day", match: 96,
    why: "Light layers for a mild, dry day — and the camel coat hasn't been worn in three weeks.",
    items: [
      { type: "coat", color: "#B98E5A", label: "Camel coat" },
      { type: "sweater", color: "#EDE7DA", label: "Cream knit" },
      { type: "pants", color: "#2E3A4A", label: "Straight denim" },
      { type: "shoe", color: "#5A4632", label: "Loafers" },
    ],
    ctaPrimary: "Wear this", ctaSecondary: "Restyle",
    closetTitle: "Wardrobe", closetCta: "Compose outfit", matchHint: "Best matches for 17° & clear",
    closet: [
      { type: "coat", color: "#B98E5A", match: 96 }, { type: "tee", color: "#EDE7DA", sel: true }, { type: "jacket", color: "#6E2B27" },
      { type: "pants", color: "#2E3A4A", sel: true }, { type: "shoe", color: "#5A4632", sel: true }, { type: "dress", color: "#8A7F6B" },
      { type: "sweater", color: "#9AA98C", match: 88 }, { type: "skirt", color: "#3A332A" }, { type: "tote", color: "#5A4632" },
    ],
  },

  /* B · Pop — playful energy */
  pop: {
    id: "pop",
    bg: "#FFF4E4", fg: "#211C16", muted: "#9A8C77", rule: "#211C16",
    accent: "#FF5A1F", accentFg: "#FFF4E4", cardBg: "#FFFBF2", tileBg: "#FFF4E4", chipBg: "#2742F5", chipFg: "#FFF4E4",
    navBg: "#FFFBF2", weatherBg: "#FFD75E", weatherFg: "#211C16", weatherIcon: "sun",
    displayFont: "'Bricolage Grotesque', sans-serif", bodyFont: SCH,
    cardRadius: 22, btnRadius: 999, headTrack: "-0.02em", greetingSize: 34,
    outline: true, hardShadow: true, upper: false, lowerHead: true,
    cardShadow: "6px 6px 0 #211C16", ghostBg: "",
    dateStr: "TUE · MAY 12", greeting: "morning, mara!", weather: "☀️ 17° · sunny-ish",
    outfitName: "big tee energy", match: 94,
    why: "It's sunny and your white-tee-and-denim-jacket combo is undefeated. Worn 0× this month!",
    items: [
      { type: "jacket", color: "#2742F5", label: "Denim jacket" },
      { type: "tee", color: "#FFFFFF", label: "White tee" },
      { type: "pants", color: "#3B7A4E", label: "Cargo pants" },
      { type: "shoe", color: "#FF5A1F", label: "Retro kicks" },
    ],
    ctaPrimary: "wear it!", ctaSecondary: "remix",
    closetTitle: "my closet", closetCta: "build the fit!", matchHint: "🔥 top matches for today",
    closet: [
      { type: "jacket", color: "#2742F5", match: 94 }, { type: "tee", color: "#FFFFFF", sel: true }, { type: "sweater", color: "#FFD75E" },
      { type: "pants", color: "#3B7A4E", sel: true }, { type: "shoe", color: "#FF5A1F", sel: true }, { type: "dress", color: "#F2C7C0" },
      { type: "skirt", color: "#2742F5", match: 81 }, { type: "tote", color: "#FF5A1F" }, { type: "hat", color: "#3B7A4E" },
    ],
  },

  /* D · Riviera — warm elegance */
  riviera: {
    id: "riviera",
    bg: "#FBF3E3", fg: "#33231A", muted: "#9A8164", rule: "#E5D6BC",
    accent: "#D2603C", accentFg: "#FBF3E3", cardBg: "#FFFBF1", tileBg: "#F6ECD8", chipBg: "#EAD9B8", chipFg: "#33231A",
    navBg: "#FFFBF1", weatherBg: "#E3EBF0", weatherFg: "#33688F", weatherIcon: "sun",
    displayFont: "'Young Serif', serif", bodyFont: SCH,
    cardRadius: 22, btnRadius: 999, headTrack: "-0.01em", greetingSize: 32,
    outline: false, hardShadow: false, upper: false, lowerHead: false,
    cardShadow: "0 12px 26px rgba(51,35,26,.08)", ghostBg: "",
    dateStr: "Tuesday · 12 May", greeting: "Morning, sunshine", weather: "22° · golden hour all day",
    outfitName: "The Terrace Look", match: 95,
    why: "Warm and bright calls for linen — and you rated this exact set five stars in Lisbon.",
    items: [
      { type: "jacket", color: "#C97F52", label: "Linen shirt" },
      { type: "tee", color: "#F3EAD7", label: "Cream tee" },
      { type: "pants", color: "#E7Dcc4", label: "Cream trousers" },
      { type: "shoe", color: "#8A5A35", label: "Woven loafers" },
    ],
    ctaPrimary: "Wear this", ctaSecondary: "Shuffle",
    closetTitle: "Wardrobe", closetCta: "Compose outfit", matchHint: "Sunniest matches for 22°",
    closet: [
      { type: "jacket", color: "#C97F52", match: 95 }, { type: "tee", color: "#F3EAD7", sel: true }, { type: "sweater", color: "#33688F" },
      { type: "pants", color: "#E7Dcc4", sel: true }, { type: "shoe", color: "#8A5A35", sel: true }, { type: "dress", color: "#D2603C" },
      { type: "skirt", color: "#9A8164", match: 84 }, { type: "tote", color: "#C97F52" }, { type: "hat", color: "#E7Dcc4" },
    ],
  },

  /* F · Bloom — soft & fresh */
  bloom: {
    id: "bloom",
    bg: "#FAF7F0", fg: "#3B3028", muted: "#A09384", rule: "#E8E0D2",
    accent: "#E2745B", accentFg: "#FFFEFA", cardBg: "#FFFEFA", tileBg: "#F4EFE6", chipBg: "#C8D8AE", chipFg: "#3B3028",
    navBg: "#FFFEFA", weatherBg: "#C5D8E8", weatherFg: "#3B3028", weatherIcon: "cloud",
    displayFont: "'Bricolage Grotesque', sans-serif", bodyFont: SCH,
    cardRadius: 26, btnRadius: 999, headTrack: "-0.025em", greetingSize: 32,
    outline: false, hardShadow: false, upper: false, lowerHead: true,
    cardShadow: "0 14px 30px rgba(59,48,40,.07)", ghostBg: "#C8D8AE",
    dateStr: "Tuesday · 12 May", greeting: "hey, you", weather: "14° · soft breeze",
    outfitName: "today, gently", match: 92,
    why: "Cool and breezy — the oat cardigan keeps you cozy until the sun breaks through around two.",
    items: [
      { type: "sweater", color: "#E4D7BE", label: "Oat cardigan" },
      { type: "dress", color: "#FFFFFF", label: "White dress" },
      { type: "shoe", color: "#F2C7C0", label: "Ballet flats" },
      { type: "tote", color: "#C8D8AE", label: "Canvas tote" },
    ],
    ctaPrimary: "wear this", ctaSecondary: "swap",
    closetTitle: "closet", closetCta: "make the look", matchHint: "comfiest matches for 14°",
    closet: [
      { type: "sweater", color: "#E4D7BE", match: 92 }, { type: "dress", color: "#FFFFFF", sel: true }, { type: "jacket", color: "#C5D8E8" },
      { type: "shoe", color: "#F2C7C0", sel: true }, { type: "tote", color: "#C8D8AE", sel: true }, { type: "pants", color: "#A09384" },
      { type: "skirt", color: "#F2C7C0", match: 80 }, { type: "tee", color: "#E2745B" }, { type: "hat", color: "#C8D8AE" },
    ],
  },

  /* C · Midnight — sleek tech */
  midnight: {
    id: "midnight",
    bg: "#0E0F13", fg: "#F2F3F5", muted: "#9CA1AB", rule: "#262932",
    accent: "#D6FF4B", accentFg: "#0E0F13", cardBg: "#1B1D24", tileBg: "#14161C", chipBg: "rgba(214,255,75,.1)", chipFg: "#D6FF4B",
    navBg: "#14161C", weatherBg: "rgba(214,255,75,.12)", weatherFg: "#D6FF4B", weatherIcon: "sun",
    displayFont: "'Space Grotesk', sans-serif", bodyFont: "'Space Grotesk', sans-serif",
    cardRadius: 18, btnRadius: 12, headTrack: "-0.02em", greetingSize: 30,
    outline: false, hardShadow: false, upper: true, lowerHead: false,
    cardShadow: "none", ghostBg: "",
    dateStr: "TUE · 12 MAY", greeting: "3 strong options today", weather: "17°C · CLEAR",
    outfitName: "Fit 01 / 03", match: 94,
    why: "Matched to clear skies, your style profile, and a 2pm meeting on your calendar.",
    items: [
      { type: "jacket", color: "#23262F", label: "Black overshirt" },
      { type: "tee", color: "#6B7180", label: "Grey tee" },
      { type: "pants", color: "#2C303A", label: "Tapered trousers" },
      { type: "shoe", color: "#15171D", label: "Chunky boots" },
    ],
    ctaPrimary: "Wear this", ctaSecondary: "Next fit",
    closetTitle: "CLOSET", closetCta: "Generate outfit", matchHint: "TOP MATCHES · 17°C CLEAR",
    closet: [
      { type: "jacket", color: "#23262F", match: 94 }, { type: "tee", color: "#6B7180", sel: true }, { type: "sweater", color: "#3A4150" },
      { type: "pants", color: "#2C303A", sel: true }, { type: "shoe", color: "#15171D", sel: true }, { type: "coat", color: "#1F222B" },
      { type: "skirt", color: "#4A4035", match: 79 }, { type: "tote", color: "#2C303A" }, { type: "hat", color: "#3A4150" },
    ],
  },
};

window.fittedAppThemes = fittedAppThemes;
