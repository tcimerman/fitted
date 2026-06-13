// brand-sheets-2.jsx — round 2: three more brand-book sheets for FITTED
// Builds on A (Atelier) + B (Pop). Uses shared primitives from brand-sheets.jsx.
// Exports: SheetRiviera, SheetZine, SheetBloom (to window)

const { BBLabel, BBSwatches, BBTypeRow, BBVoice, BBSection } = window;

/* ---------- Direction D · Riviera (Atelier × Pop) ---------- */

const rivieraTheme = {
  bg: "#FBF3E3", fg: "#33231A", muted: "#9A8164", rule: "#E5D6BC",
  accent: "#D2603C", azure: "#33688F", sand: "#EAD9B8",
  labelFont: "'Schibsted Grotesk', sans-serif", voiceFont: "'Young Serif', serif",
  swatchRadius: 12,
};

function SheetRiviera() {
  const t = rivieraTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      {/* Cover */}
      <div style={{ textAlign: "center", padding: "22px 0 52px", position: "relative" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.azure, textTransform: "uppercase", fontWeight: 700, marginBottom: 22 }}>Brand Direction D · A × B</div>
        <div style={{ fontFamily: "'Young Serif', serif", fontSize: 86, lineHeight: 1, letterSpacing: "-0.01em" }}>
          Fitted<span style={{ color: t.accent }}>.</span>
        </div>
        <div style={{ fontFamily: t.labelFont, fontSize: 20, fontWeight: 500, color: t.muted, marginTop: 16 }}>
          Dress like the sun is out — even when it isn’t.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 26 }}>
          {[t.accent, t.azure, t.sand].map((c) => (
            <span key={c} style={{ width: 38, height: 10, borderRadius: 999, background: c, display: "inline-block" }}></span>
          ))}
        </div>
      </div>

      {/* Logo */}
      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1.5px solid ${t.fg}`, borderRadius: 18, display: "grid", placeItems: "center", height: 170, background: "#FFFBF1" }}>
            <span style={{ fontFamily: "'Young Serif', serif", fontSize: 38 }}>Fitted<span style={{ color: t.accent }}>.</span></span>
          </div>
          <div style={{ border: `1.5px solid ${t.fg}`, borderRadius: 18, display: "grid", placeItems: "center", height: 170, background: t.azure }}>
            <span style={{ fontFamily: "'Young Serif', serif", fontSize: 38, color: "#FBF3E3" }}>Fitted<span style={{ color: t.sand }}>.</span></span>
          </div>
          <div style={{ border: `1.5px solid ${t.fg}`, borderRadius: 18, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50% 50% 26px 26px", background: t.accent,
              display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "'Young Serif', serif", fontSize: 50, color: "#FBF3E3" }}>F</span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Atelier’s serif warmth meets Pop’s friendliness: title case with the period, set in Young Serif.
          The icon’s awning shape — arched top, soft base — is the recurring motif for cards and photo masks.
        </p>
      </BBSection>

      {/* Color */}
      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Linen", hex: "#FBF3E3", role: "Canvas", border: true },
          { name: "Cacao", hex: "#33231A", role: "Text & outlines" },
          { name: "Terracotta", hex: "#D2603C", role: "Hero accent" },
          { name: "Sea", hex: "#33688F", role: "Secondary accent" },
          { name: "Sand", hex: "#EAD9B8", role: "Muted surfaces", border: true },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          A sun-washed palette: terracotta carries actions, sea handles links and info, sand fills quiet surfaces. Warmer than Atelier, calmer than Pop.
        </p>
      </BBSection>

      {/* Type */}
      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Young Serif" spec="Display · headings, 26–86px"
          sample="Pack light, dress warm"
          style={{ fontFamily: "'Young Serif', serif", fontSize: 40, lineHeight: 1.1 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Schibsted Grotesk Bold" spec="Subheads & buttons · 15–22px"
          sample="Linen shirt weather has arrived"
          style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 23, lineHeight: 1.2 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Schibsted Grotesk" spec="Body & UI · 13–16px, weights 400/500"
          sample="22° and golden. The striped linen shirt with cream trousers — you wore it in Lisbon and rated it five stars."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      {/* Voice */}
      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Morning, sunshine. It’s a linen kind of day." },
          { ctx: "Suggestion", copy: "The striped shirt misses you — and today’s weather agrees." },
          { ctx: "Empty closet", copy: "An empty rail is just a vacation waiting to be packed." },
        ]}></BBVoice>
      </BBSection>

      {/* UI */}
      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            background: "#FFFBF1", border: `1.5px solid ${t.fg}`, borderRadius: "26px 26px 18px 18px",
            padding: "22px 24px", width: 320,
          }}>
            <div style={{ display: "inline-block", fontFamily: t.labelFont, fontSize: 11.5, fontWeight: 700, color: t.azure, background: "rgba(51,104,143,.1)", borderRadius: 999, padding: "5px 12px", marginBottom: 10 }}>22° · golden hour all day</div>
            <div style={{ fontFamily: "'Young Serif', serif", fontSize: 24, marginBottom: 6 }}>The Terrace Look</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 18 }}>striped linen shirt · cream trousers · woven loafers</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: t.accent, color: "#FBF3E3",
                border: "none", borderRadius: 999, padding: "13px 24px", cursor: "pointer",
              }}>Wear this</button>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: "transparent", color: t.fg,
                border: `1.5px solid ${t.fg}`, borderRadius: 999, padding: "13px 24px", cursor: "pointer",
              }}>Shuffle</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["Work", "Dinner", "Weekend"].map((c, i) => (
                <span key={c} style={{
                  fontFamily: t.labelFont, fontSize: 13, fontWeight: 600, padding: "9px 16px",
                  borderRadius: 999, border: `1.5px solid ${i === 0 ? t.fg : t.rule}`,
                  background: i === 0 ? t.sand : "transparent", color: t.fg,
                }}>{c}</span>
              ))}
            </div>
            <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
              Arched “awning” corners on cards, pill buttons, ink outlines — Pop’s friendliness wearing Atelier’s tailoring.
            </p>
          </div>
        </div>
      </BBSection>
    </div>
  );
}

/* ---------- Direction E · Zine (Atelier, louder) ---------- */

const zineTheme = {
  bg: "#F4F2EC", fg: "#161410", muted: "#7E7A6E", rule: "#D9D4C6",
  accent: "#E0312E",
  labelFont: "'Space Grotesk', sans-serif", voiceFont: "'Cormorant Garamond', serif",
  swatchRadius: 0,
};

function SheetZine() {
  const t = zineTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      {/* Cover */}
      <div style={{ padding: "10px 0 50px", position: "relative" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>Brand Direction E</div>
        <div style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 96, lineHeight: 0.92, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
          FIT<span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>ted</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
          <span style={{
            fontFamily: t.labelFont, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            background: t.accent, color: "#F4F2EC", padding: "6px 12px", transform: "rotate(-1.5deg)", display: "inline-block",
          }}>Issue № 001</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 24 }}>the daily wardrobe paper</span>
        </div>
      </div>

      {/* Logo */}
      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1px solid ${t.fg}`, display: "grid", placeItems: "center", height: 170, background: "#FBFAF6" }}>
            <span style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 38, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              FIT<span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>ted</span>
            </span>
          </div>
          <div style={{ border: `1px solid ${t.fg}`, display: "grid", placeItems: "center", height: 170, background: t.fg }}>
            <span style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 38, letterSpacing: "-0.04em", color: "#F4F2EC", textTransform: "uppercase" }}>
              FIT<span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, textTransform: "none", letterSpacing: 0, color: t.accent }}>ted</span>
            </span>
          </div>
          <div style={{ border: `1px solid ${t.fg}`, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{
              width: 96, height: 96, background: "#FBFAF6", border: `1.5px solid ${t.fg}`,
              display: "grid", placeItems: "center", transform: "rotate(-3deg)",
              boxShadow: `4px 4px 0 ${t.accent}`,
            }}>
              <span style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 40, letterSpacing: "-0.04em" }}>F<span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}>t</span></span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Two voices in one word: shouty grotesque caps cut with an italic serif whisper — a magazine masthead, not a logo.
          Elements sit slightly rotated, like clippings taped to a moodboard.
        </p>
      </BBSection>

      {/* Color */}
      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Newsprint", hex: "#F4F2EC", role: "Canvas", border: true },
          { name: "Ink", hex: "#161410", role: "Text & blocks" },
          { name: "Red Pen", hex: "#E0312E", role: "Accent & marks" },
          { name: "Fog", hex: "#D9D4C6", role: "Rules & dividers", border: true },
          { name: "Bone", hex: "#FBFAF6", role: "Cards", border: true },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Essentially black-and-white printing with one red pen. Red is an editor’s mark — circling today’s pick, underlining a note, stamping “worn.”
        </p>
      </BBSection>

      {/* Type */}
      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Space Grotesk Bold Caps" spec="Display · headlines, 26–96px, tight"
          sample="WHAT TO WEAR, AND WHY"
          style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 38, letterSpacing: "-0.03em", lineHeight: 1 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Cormorant Garamond Italic" spec="Standfirsts & captions · 18–26px"
          sample="— in which your closet is interviewed about the weather."
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 25, lineHeight: 1.3 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Space Grotesk" spec="Body & UI · 13–16px, weights 400/500"
          sample="17°, clear skies. Today's spread: the wool overshirt story, continued from last Thursday. Critics agree it pairs with everything."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      {/* Voice */}
      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Today’s edition: clear skies, strong opinions." },
          { ctx: "Suggestion", copy: "Front page material: the wool overshirt returns after a two-week hiatus." },
          { ctx: "Empty closet", copy: "Blank issue. Every great wardrobe starts with a first clipping." },
        ]}></BBVoice>
      </BBSection>

      {/* UI */}
      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            background: "#FBFAF6", border: `1px solid ${t.fg}`, padding: "22px 24px", width: 320,
            transform: "rotate(-0.6deg)", boxShadow: `5px 5px 0 rgba(22,20,16,.12)`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${t.fg}`, paddingBottom: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: t.labelFont, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Today’s Edition</span>
              <span style={{ fontFamily: t.labelFont, fontSize: 10.5, letterSpacing: "0.1em", color: t.muted }}>17° · CLEAR</span>
            </div>
            <div style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 23, letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1.05, marginBottom: 6 }}>The Overshirt Returns</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, color: t.muted, marginBottom: 16 }}>wool overshirt · grey tee · ecru chinos · derbies</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                fontFamily: t.labelFont, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                background: t.fg, color: "#F4F2EC", border: "none", padding: "13px 20px", cursor: "pointer",
              }}>Run it</button>
              <button style={{
                fontFamily: t.labelFont, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                background: "transparent", color: t.accent, border: `1px solid ${t.accent}`, padding: "13px 20px", cursor: "pointer",
              }}>Revise</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["OFFICE", "OPENING", "OFF-DUTY"].map((c, i) => (
                <span key={c} style={{
                  fontFamily: t.labelFont, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", padding: "9px 14px",
                  border: `1px solid ${t.fg}`, background: i === 0 ? t.fg : "transparent",
                  color: i === 0 ? "#F4F2EC" : t.fg, transform: i === 1 ? "rotate(1deg)" : "none",
                }}>{c}</span>
              ))}
            </div>
            <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
              Atelier turned up: same paper-and-ink restraint, but with masthead energy — slight rotations, hard offset shadows, editor’s red.
            </p>
          </div>
        </div>
      </BBSection>
    </div>
  );
}

/* ---------- Direction F · Bloom (Pop, gentler) ---------- */

const bloomTheme = {
  bg: "#FAF7F0", fg: "#3B3028", muted: "#A09384", rule: "#E8E0D2",
  accent: "#E2745B", pistachio: "#C8D8AE", peony: "#F2C7C0", sky: "#C5D8E8",
  labelFont: "'Schibsted Grotesk', sans-serif", voiceFont: "'Bricolage Grotesque', sans-serif",
  swatchRadius: 22,
};

function SheetBloom() {
  const t = bloomTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      {/* Cover */}
      <div style={{ textAlign: "center", padding: "22px 0 52px" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: 22 }}>Brand Direction F</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {[t.pistachio, t.peony, t.sky, t.pistachio, t.peony].map((c, i) => (
            <span key={i} style={{
              width: 30, height: 44, background: c, display: "inline-block",
              borderRadius: i % 2 === 0 ? "50% 50% 12px 12px" : "12px 12px 50% 50%",
            }}></span>
          ))}
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 84, lineHeight: 1, letterSpacing: "-0.025em" }}>fitted</div>
        <div style={{ fontFamily: t.labelFont, fontSize: 20, fontWeight: 500, color: t.muted, marginTop: 14 }}>
          Get dressed gently.
        </div>
      </div>

      {/* Logo */}
      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 28, display: "grid", placeItems: "center", height: 170, background: "#FFFEFA" }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.025em" }}>fitted</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 28, display: "grid", placeItems: "center", height: 170, background: t.pistachio }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.025em", color: t.fg }}>fitted</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 28, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50% 50% 28px 28px", background: t.peony,
              display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 48, color: t.fg }}>f</span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Pop’s lowercase confidence, minus the shouting: no period, no outlines, no hard shadows.
          The petal shape (arched top, rounded base) recurs as photo masks for garments.
        </p>
      </BBSection>

      {/* Color */}
      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Oat", hex: "#FAF7F0", role: "Canvas", border: true },
          { name: "Cocoa", hex: "#3B3028", role: "Text" },
          { name: "Coral", hex: "#E2745B", role: "Accent & actions" },
          { name: "Pistachio", hex: "#C8D8AE", role: "Calm surfaces" },
          { name: "Peony", hex: "#F2C7C0", role: "Warm surfaces" },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Sorbet tones over oat milk. Pistachio and peony alternate as card fills; coral is reserved for the one tap that matters.
        </p>
      </BBSection>

      {/* Type */}
      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Bricolage Grotesque Bold" spec="Display · headings, 26–84px"
          sample="soft launch your style"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 42, letterSpacing: "-0.025em", lineHeight: 1 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Bricolage Grotesque Medium" spec="Subheads · 17–24px"
          sample="a cardigan kind of afternoon"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, fontSize: 24, letterSpacing: "-0.01em", lineHeight: 1.2 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Schibsted Grotesk" spec="Body & UI · 13–16px, weights 400/500"
          sample="14° with a soft breeze. The oat cardigan over your white dress keeps you cozy until the sun comes through around two."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      {/* Voice */}
      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Hey, you. It’s sweater weather — the good kind." },
          { ctx: "Suggestion", copy: "The oat cardigan would love to come along today." },
          { ctx: "Empty closet", copy: "A fresh start! Add your comfiest piece first." },
        ]}></BBVoice>
      </BBSection>

      {/* UI */}
      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            background: "#FFFEFA", border: `1px solid ${t.rule}`, borderRadius: 28,
            padding: "22px 24px", width: 320, boxShadow: "0 14px 30px rgba(59,48,40,.07)",
          }}>
            <div style={{ display: "inline-block", fontFamily: t.labelFont, fontSize: 11.5, fontWeight: 600, color: t.fg, background: t.sky, borderRadius: 999, padding: "5px 12px", marginBottom: 10 }}>14° · soft breeze</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: "-0.02em", marginBottom: 6 }}>today, gently</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 18 }}>oat cardigan · white dress · ballet flats · canvas tote</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: t.accent, color: "#FFFEFA",
                border: "none", borderRadius: 999, padding: "13px 24px", cursor: "pointer",
              }}>wear this</button>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 600, background: t.pistachio, color: t.fg,
                border: "none", borderRadius: 999, padding: "13px 24px", cursor: "pointer",
              }}>swap a piece</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[["cozy day", t.peony], ["studio", t.pistachio], ["errands", "transparent"]].map(([c, bg]) => (
                <span key={c} style={{
                  fontFamily: t.labelFont, fontSize: 13, fontWeight: 600, padding: "9px 16px",
                  borderRadius: 999, border: bg === "transparent" ? `1px solid ${t.rule}` : "1px solid transparent",
                  background: bg, color: t.fg,
                }}>{c}</span>
              ))}
            </div>
            <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
              Pop with the volume at 30%: same shapes and lowercase warmth, but airy shadows, sorbet fills, and slower, softer motion.
            </p>
          </div>
        </div>
      </BBSection>
    </div>
  );
}

Object.assign(window, { SheetRiviera, SheetZine, SheetBloom });
