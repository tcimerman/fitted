// brand-sheets.jsx — three brand-book sheets for FITTED
// Exports: SheetAtelier, SheetPop, SheetMidnight (to window)

/* ---------- shared primitives ---------- */

function BBLabel({ theme, n, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 12,
      borderTop: `1px solid ${theme.rule}`, paddingTop: 14, marginBottom: 22,
    }}>
      <span style={{
        fontFamily: theme.labelFont, fontSize: 11, letterSpacing: "0.18em",
        color: theme.muted, textTransform: "uppercase",
      }}>{n}</span>
      <span style={{
        fontFamily: theme.labelFont, fontSize: 11, letterSpacing: "0.18em",
        color: theme.fg, textTransform: "uppercase", fontWeight: 600,
      }}>{children}</span>
    </div>
  );
}

function BBSwatches({ theme, colors }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${colors.length}, 1fr)`, gap: 14 }}>
      {colors.map((c) => (
        <div key={c.hex} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            height: 96, background: c.hex, borderRadius: theme.swatchRadius,
            border: c.border ? `1px solid ${theme.rule}` : "none",
          }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: theme.labelFont, fontSize: 12.5, fontWeight: 600, color: theme.fg }}>{c.name}</span>
            <span style={{ fontFamily: theme.monoFont || theme.labelFont, fontSize: 11.5, color: theme.muted, letterSpacing: "0.04em" }}>{c.hex}</span>
            <span style={{ fontFamily: theme.labelFont, fontSize: 11.5, color: theme.muted }}>{c.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BBTypeRow({ theme, sample, family, spec, style }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 200px", gap: 24,
      alignItems: "baseline", padding: "14px 0", borderBottom: `1px dashed ${theme.rule}`,
    }}>
      <div style={style}>{sample}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: theme.labelFont, fontSize: 12, fontWeight: 600, color: theme.fg }}>{family}</span>
        <span style={{ fontFamily: theme.labelFont, fontSize: 11.5, color: theme.muted }}>{spec}</span>
      </div>
    </div>
  );
}

function BBVoice({ theme, lines }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 18, alignItems: "baseline" }}>
          <span style={{ fontFamily: theme.labelFont, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.muted }}>{l.ctx}</span>
          <span style={{ fontFamily: theme.voiceFont, fontSize: 19, color: theme.fg, lineHeight: 1.45 }}>{l.copy}</span>
        </div>
      ))}
    </div>
  );
}

function BBSection({ children, style }) {
  return <div style={{ marginBottom: 44, ...style }}>{children}</div>;
}

/* ---------- Direction A · Atelier ---------- */

const atelierTheme = {
  bg: "#F5F0E6", fg: "#1C1812", muted: "#8A7F6B", rule: "#D8CFBC",
  accent: "#6E2B27", brass: "#A98C4B",
  labelFont: "'Mulish', sans-serif", voiceFont: "'Cormorant Garamond', serif",
  swatchRadius: 0,
};

function AtelierHanger({ size = 44, color = "#F5F0E6" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 10c-3 0-5 2-5 4.6 0 1.9 1.2 3.2 2.6 4.1 1 .7 1.4 1.3 1.4 2.3v1" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"></path>
      <path d="M23 22 L7 33.5c-1.4 1-.7 3.1 1 3.1h32c1.7 0 2.4-2.1 1-3.1L25 22" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"></path>
    </svg>
  );
}

function SheetAtelier() {
  const t = atelierTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      {/* Cover */}
      <div style={{ textAlign: "center", padding: "26px 0 54px" }}>
        <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: 11, letterSpacing: "0.34em", color: t.brass, textTransform: "uppercase", marginBottom: 26 }}>Brand Direction A</div>
        <div style={{ fontFamily: "'Marcellus', serif", fontSize: 84, letterSpacing: "0.22em", lineHeight: 1, marginLeft: "0.22em" }}>FITTED</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 23, color: t.accent, marginTop: 18 }}>Dressed well, every day.</div>
        <div style={{ width: 64, height: 1, background: t.brass, margin: "30px auto 0" }}></div>
      </div>

      {/* Logo */}
      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "stretch" }}>
          <div style={{ border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{ fontFamily: "'Marcellus', serif", fontSize: 34, letterSpacing: "0.2em", marginLeft: "0.2em" }}>FITTED</div>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{
              width: 92, height: 92, borderRadius: "50%", border: `1px solid ${t.fg}`,
              display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "'Marcellus', serif", fontSize: 44, lineHeight: 1 }}>F</span>
            </div>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", height: 170, background: t.fg }}>
            <div style={{
              width: 92, height: 92, borderRadius: 22, background: t.accent,
              display: "grid", placeItems: "center", boxShadow: "0 10px 24px rgba(28,24,18,.35)",
            }}>
              <AtelierHanger color="#F5F0E6"></AtelierHanger>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          The wordmark is set in Marcellus, generously tracked — never bolded, never condensed.
          The monogram circle is reserved for garment tags and loading states; the hanger mark lives on the app icon only.
        </p>
      </BBSection>

      {/* Color */}
      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Ivory", hex: "#F5F0E6", role: "Canvas", border: true },
          { name: "Ink", hex: "#1C1812", role: "Text & frames" },
          { name: "Oxblood", hex: "#6E2B27", role: "Accent & actions" },
          { name: "Brass", hex: "#A98C4B", role: "Details & dividers" },
          { name: "Stone", hex: "#C9C0AE", role: "Muted surfaces" },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Ivory dominates — roughly 80% of any screen. Oxblood appears once per view, on the single most important action. Brass is for hairlines, never fills.
        </p>
      </BBSection>

      {/* Type */}
      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Marcellus" spec="Display · headings, 28–84px, tracked +0.08em"
          sample="Your Tuesday, composed"
          style={{ fontFamily: "'Marcellus', serif", fontSize: 40, letterSpacing: "0.08em", lineHeight: 1.1 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Cormorant Garamond Italic" spec="Editorial accents · pull-quotes, 18–24px"
          sample="A wardrobe that thinks ahead of the weather."
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 25, lineHeight: 1.3 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Mulish" spec="Body & UI · 13–16px, weights 400/600"
          sample="Light wool blazer, cream knit, straight-leg denim. 17° and clear by noon — no layer needed after lunch."
          style={{ fontFamily: "'Mulish', sans-serif", fontSize: 15.5, lineHeight: 1.6, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      {/* Voice */}
      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Good morning. Today calls for something light." },
          { ctx: "Suggestion", copy: "The camel coat hasn’t left the rail in three weeks — it would suit today." },
          { ctx: "Empty closet", copy: "Your wardrobe awaits its first piece." },
        ]}></BBVoice>
      </BBSection>

      {/* UI */}
      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            background: "#FFFDF8", border: `1px solid ${t.rule}`, padding: "22px 24px", width: 320,
          }}>
            <div style={{ fontFamily: t.labelFont, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: t.brass, marginBottom: 8 }}>Today · 17° Clear</div>
            <div style={{ fontFamily: "'Marcellus', serif", fontSize: 24, letterSpacing: "0.04em", marginBottom: 6 }}>The Gallery Day</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.55, marginBottom: 18 }}>Camel coat · cream knit · straight denim · loafers</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                fontFamily: t.labelFont, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                background: t.accent, color: "#F5F0E6", border: "none", padding: "13px 22px", cursor: "pointer",
              }}>Wear this</button>
              <button style={{
                fontFamily: t.labelFont, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                background: "transparent", color: t.fg, border: `1px solid ${t.fg}`, padding: "13px 22px", cursor: "pointer",
              }}>Restyle</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["Work", "Evening", "Weekend"].map((c, i) => (
                <span key={c} style={{
                  fontFamily: t.labelFont, fontSize: 12, letterSpacing: "0.08em", padding: "9px 16px",
                  border: `1px solid ${i === 0 ? t.fg : t.rule}`, color: i === 0 ? t.bg : t.fg,
                  background: i === 0 ? t.fg : "transparent",
                }}>{c}</span>
              ))}
            </div>
            <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
              Square corners everywhere. Hairline borders instead of shadows. The interface should feel like a well-set page in a lookbook.
            </p>
          </div>
        </div>
      </BBSection>
    </div>
  );
}

/* ---------- Direction B · Pop ---------- */

const popTheme = {
  bg: "#FFF4E4", fg: "#211C16", muted: "#9A8C77", rule: "#EBD9BF",
  accent: "#FF5A1F", cobalt: "#2742F5", butter: "#FFD75E",
  labelFont: "'Schibsted Grotesk', sans-serif", voiceFont: "'Schibsted Grotesk', sans-serif",
  swatchRadius: 18,
};

function SheetPop() {
  const t = popTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      {/* Cover */}
      <div style={{ padding: "10px 0 50px", position: "relative" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.cobalt, textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>Brand Direction B</div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 96, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
          fitted<span style={{ color: t.accent }}>.</span>
        </div>
        <div style={{ fontFamily: t.labelFont, fontSize: 21, fontWeight: 500, marginTop: 16, maxWidth: 420 }}>
          Your closet, but it finally <em style={{ fontStyle: "normal", background: t.butter, padding: "0 6px", borderRadius: 6 }}>talks back</em>.
        </div>
        <div style={{
          position: "absolute", right: 8, top: 36, width: 96, height: 96, borderRadius: "50%",
          background: t.accent, color: "#FFF4E4", display: "grid", placeItems: "center",
          fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 15,
          transform: "rotate(12deg)", textAlign: "center", lineHeight: 1.15,
        }}>wear<br />it!</div>
      </div>

      {/* Logo */}
      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `2px solid ${t.fg}`, borderRadius: 22, display: "grid", placeItems: "center", height: 170, background: "#FFFBF2" }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 38, letterSpacing: "-0.03em" }}>fitted<span style={{ color: t.accent }}>.</span></span>
          </div>
          <div style={{ border: `2px solid ${t.fg}`, borderRadius: 22, display: "grid", placeItems: "center", height: 170, background: t.cobalt }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 38, letterSpacing: "-0.03em", color: "#FFF4E4" }}>fitted<span style={{ color: t.butter }}>.</span></span>
          </div>
          <div style={{ border: `2px solid ${t.fg}`, borderRadius: 22, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 26, background: t.accent, color: "#FFF4E4",
              display: "grid", placeItems: "center", fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800, fontSize: 54, boxShadow: `6px 6px 0 ${t.fg}`,
            }}>f<span style={{ color: t.butter }}>.</span></div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Always lowercase, always with the period — the brand speaks in full sentences. The hard offset shadow is the signature; never use soft blurs.
        </p>
      </BBSection>

      {/* Color */}
      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Cream", hex: "#FFF4E4", role: "Canvas", border: true },
          { name: "Tangerine", hex: "#FF5A1F", role: "Hero accent" },
          { name: "Cobalt", hex: "#2742F5", role: "Secondary pop" },
          { name: "Butter", hex: "#FFD75E", role: "Highlights" },
          { name: "Espresso", hex: "#211C16", role: "Text & outlines" },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Tangerine and Cobalt never touch — Cream or Espresso always sits between them. Butter is a highlighter pen: words, badges, underlines.
        </p>
      </BBSection>

      {/* Type */}
      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Bricolage Grotesque ExtraBold" spec="Display · headings, 28–96px, tight"
          sample="big fit energy"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 44, letterSpacing: "-0.03em", lineHeight: 1 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Bricolage Grotesque SemiBold" spec="Subheads · 18–24px"
          sample="Tuesday wants the denim jacket"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 24, lineHeight: 1.15 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Schibsted Grotesk" spec="Body & UI · 13–16px, weights 400/500/700"
          sample="It's 17° and sunny — your white tee + denim jacket combo is undefeated in this weather. You've worn it 0 times this month."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      {/* Voice */}
      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Morning! Let’s make the sidewalk a runway." },
          { ctx: "Suggestion", copy: "That green cardigan? It’s been benched too long. Start it today." },
          { ctx: "Empty closet", copy: "Nothing here yet — snap your first piece and let’s go." },
        ]}></BBVoice>
      </BBSection>

      {/* UI */}
      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            background: "#FFFBF2", border: `2px solid ${t.fg}`, borderRadius: 24,
            padding: "22px 24px", width: 320, boxShadow: `6px 6px 0 ${t.fg}`,
          }}>
            <div style={{ display: "inline-block", fontFamily: t.labelFont, fontSize: 11.5, fontWeight: 700, background: t.butter, borderRadius: 999, padding: "5px 12px", marginBottom: 10 }}>☀️ 17° · sunny-ish</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 25, letterSpacing: "-0.02em", marginBottom: 6 }}>today’s fit</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 18 }}>white tee · denim jacket · cargo pants · retro sneakers</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: t.accent, color: "#FFF4E4",
                border: `2px solid ${t.fg}`, borderRadius: 999, padding: "12px 22px", cursor: "pointer",
                boxShadow: `3px 3px 0 ${t.fg}`,
              }}>wear it!</button>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: "transparent", color: t.fg,
                border: `2px solid ${t.fg}`, borderRadius: 999, padding: "12px 22px", cursor: "pointer",
              }}>remix 🔁</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[["class", t.cobalt, "#FFF4E4"], ["date night", t.accent, "#FFF4E4"], ["gym", "transparent", t.fg]].map(([c, bg, fg]) => (
                <span key={c} style={{
                  fontFamily: t.labelFont, fontSize: 13, fontWeight: 700, padding: "9px 16px",
                  borderRadius: 999, border: `2px solid ${t.fg}`, background: bg, color: fg,
                }}>{c}</span>
              ))}
            </div>
            <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
              Everything is a sticker: 2px outlines, hard shadows, pill shapes. Motion is springy — things bounce in, never fade in.
            </p>
          </div>
        </div>
      </BBSection>
    </div>
  );
}

/* ---------- Direction C · Midnight ---------- */

const midnightTheme = {
  bg: "#0E0F13", fg: "#F2F3F5", muted: "#9CA1AB", rule: "#262932",
  accent: "#D6FF4B", surface: "#1B1D24",
  labelFont: "'Space Grotesk', sans-serif", monoFont: "'JetBrains Mono', monospace",
  voiceFont: "'Space Grotesk', sans-serif",
  swatchRadius: 10,
};

function SheetMidnight() {
  const t = midnightTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      {/* Cover */}
      <div style={{ padding: "10px 0 50px" }}>
        <div style={{ fontFamily: t.monoFont, fontSize: 11, letterSpacing: "0.22em", color: t.accent, textTransform: "uppercase", marginBottom: 22 }}>// Brand Direction C</div>
        <div style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 92, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
          FITTED<span style={{ color: t.accent }}>_</span>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 18, alignItems: "center" }}>
          <span style={{ fontFamily: t.monoFont, fontSize: 13, color: t.muted }}>v1.0</span>
          <span style={{ width: 40, height: 1, background: t.rule }}></span>
          <span style={{ fontFamily: t.labelFont, fontSize: 20, fontWeight: 500 }}>Your wardrobe, computed.</span>
        </div>
      </div>

      {/* Logo */}
      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 14, display: "grid", placeItems: "center", height: 170, background: t.surface }}>
            <span style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em" }}>FITTED<span style={{ color: t.accent }}>_</span></span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 14, display: "grid", placeItems: "center", height: 170, background: t.accent }}>
            <span style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", color: "#0E0F13" }}>FITTED<span style={{ color: "#0E0F13" }}>_</span></span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 14, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 24, background: t.surface, border: `1px solid ${t.rule}`,
              display: "grid", placeItems: "center", position: "relative",
            }}>
              <span style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 46, color: t.fg }}>F<span style={{ color: t.accent }}>_</span></span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          The trailing underscore is the cursor — the brand is always “computing your next fit.” It blinks in the live product, static everywhere else.
        </p>
      </BBSection>

      {/* Color */}
      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Onyx", hex: "#0E0F13", role: "Canvas", border: true },
          { name: "Graphite", hex: "#1B1D24", role: "Cards & surfaces", border: true },
          { name: "Volt", hex: "#D6FF4B", role: "Accent & actions" },
          { name: "Paper", hex: "#F2F3F5", role: "Primary text" },
          { name: "Smoke", hex: "#9CA1AB", role: "Secondary text" },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Dark-first, always. Volt is electricity — buttons, live data, and the cursor. It never exceeds 10% of a screen, which is what keeps it electric.
        </p>
      </BBSection>

      {/* Type */}
      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Space Grotesk Bold" spec="Display · headings, 28–92px"
          sample="Forecast: well dressed"
          style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 42, letterSpacing: "-0.02em", lineHeight: 1.05 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Space Grotesk" spec="Body & UI · 13–16px, weights 400/500"
          sample="17°C, clear. Confidence score 94 — this combination matches your style profile and today's calendar."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
        <BBTypeRow theme={t} family="JetBrains Mono" spec="Data & labels · 10–13px, tracked wide"
          sample="WORN_3X · LAST: APR 12 · MATCH 94%"
          style={{ fontFamily: t.monoFont, fontSize: 13.5, letterSpacing: "0.08em", color: t.accent }}></BBTypeRow>
      </BBSection>

      {/* Voice */}
      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Conditions analyzed. Three strong options today." },
          { ctx: "Suggestion", copy: "Black overshirt + grey tee: 94% match for your 2pm meeting." },
          { ctx: "Empty closet", copy: "Database empty. Scan your first item to begin." },
        ]}></BBVoice>
      </BBSection>

      {/* UI */}
      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{
            background: t.surface, border: `1px solid ${t.rule}`, borderRadius: 18,
            padding: "22px 24px", width: 320,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontFamily: t.monoFont, fontSize: 11, letterSpacing: "0.12em", color: t.muted }}>TODAY · 17°C CLEAR</span>
              <span style={{ fontFamily: t.monoFont, fontSize: 11, letterSpacing: "0.08em", color: t.accent }}>94%</span>
            </div>
            <div style={{ fontFamily: t.labelFont, fontWeight: 700, fontSize: 24, letterSpacing: "-0.01em", marginBottom: 6 }}>Fit 01 / 03</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 18 }}>black overshirt · grey tee · tapered trousers · chunky boots</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: t.accent, color: "#0E0F13",
                border: "none", borderRadius: 10, padding: "13px 22px", cursor: "pointer",
              }}>Wear this</button>
              <button style={{
                fontFamily: t.labelFont, fontSize: 14, fontWeight: 500, background: "transparent", color: t.fg,
                border: `1px solid ${t.rule}`, borderRadius: 10, padding: "13px 22px", cursor: "pointer",
              }}>Next fit →</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["WORK", "EVENING", "GYM"].map((c, i) => (
                <span key={c} style={{
                  fontFamily: t.monoFont, fontSize: 11.5, letterSpacing: "0.1em", padding: "9px 16px",
                  borderRadius: 8, border: `1px solid ${i === 0 ? t.accent : t.rule}`,
                  color: i === 0 ? t.accent : t.muted, background: i === 0 ? "rgba(214,255,75,.08)" : "transparent",
                }}>{c}</span>
              ))}
            </div>
            <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
              Surfaces float on hairline borders, not shadows. Data is mono and uppercase; prose is grotesque and sentence case. Motion is precise — 150ms ease-out, nothing bounces.
            </p>
          </div>
        </div>
      </BBSection>
    </div>
  );
}

Object.assign(window, {
  SheetAtelier, SheetPop, SheetMidnight,
  BBLabel, BBSwatches, BBTypeRow, BBVoice, BBSection,
});
