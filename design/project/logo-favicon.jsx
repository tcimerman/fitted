// logo-favicon.jsx — FITTED logo & app-icon/favicon explorations.
// Exports: LogoExplorations, FaviconExplorations (to window)
const { Sym } = window;

const SANS = "'Hanken Grotesk', sans-serif";

function LabHead({ n, children, color = "#161410", muted = "#8a8475", rule = "#D9D4C6" }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, borderTop: `1px solid ${rule}`, paddingTop: 14, marginBottom: 22 }}>
      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>{n}</span>
      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", color, textTransform: "uppercase", fontWeight: 700 }}>{children}</span>
    </div>
  );
}

/* ----- a single wordmark rendered in a given style ----- */
function Wordmark({ kind, color = "#161410", size = 34 }) {
  const styles = {
    marcellus: <span style={{ fontFamily: "'Marcellus', serif", fontSize: size, letterSpacing: "0.18em", color, marginLeft: "0.18em" }}>FITTED</span>,
    bricolage: <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", color }}>fitted<span style={{ color: "#FF5A1F" }}>.</span></span>,
    young: <span style={{ fontFamily: "'Young Serif', serif", fontSize: size, color }}>Fitted<span style={{ color: "#D2603C" }}>.</span></span>,
    space: <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size, letterSpacing: "-0.02em", color }}>FITTED<span style={{ color: "#D6FF4B" }}>_</span></span>,
    archivo: <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: size, letterSpacing: "-0.02em", color, fontStretch: "125%" }}>FITTED</span>,
    instrument: <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: size * 1.18, color }}>Fitted</span>,
    gabarito: <span style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: size, letterSpacing: "-0.01em", color }}>fitted</span>,
  };
  return styles[kind] || styles.marcellus;
}

function LogoExplorations() {
  const ink = "#161410", bg = "#F4F2EC", rule = "#D9D4C6", muted = "#8a8475", panel = "#FBFAF6";
  const lockups = [
    { sym: "hanger", word: "marcellus", name: "Hanger · serif" },
    { sym: "check", word: "bricolage", name: "Check · grotesque" },
    { sym: "mirror", word: "young", name: "Mirror · warm serif" },
    { sym: "needle", word: "space", name: "Needle · mono-tech" },
  ];
  const wordmarks = [
    { kind: "marcellus", label: "Marcellus — refined" },
    { kind: "archivo", label: "Archivo Black — bold" },
    { kind: "instrument", label: "Instrument Serif — editorial" },
    { kind: "gabarito", label: "Gabarito — friendly" },
    { kind: "bricolage", label: "Bricolage — playful" },
    { kind: "young", label: "Young Serif — warm" },
  ];
  return (
    <div className="bb-sheet" style={{ background: bg, color: ink, padding: "56px 56px 48px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.3em", color: muted, textTransform: "uppercase", marginBottom: 14 }}>New explorations</div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1 }}>Logo lab</div>
        <div style={{ fontFamily: SANS, fontSize: 16, color: muted, marginTop: 10, maxWidth: 560 }}>Symbol + wordmark lockups, wordmark-only treatments, and monograms — pick a symbol and a type voice, then mix.</div>
      </div>

      {/* Primary lockups */}
      <div style={{ marginBottom: 44 }}>
        <LabHead n="01">Symbol + wordmark lockups</LabHead>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {lockups.map((l) => (
            <div key={l.name} style={{ background: panel, border: `1px solid ${rule}`, borderRadius: 14, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: ink, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Sym name={l.sym} color={bg} size={30} stroke={2.6}></Sym>
                </div>
                <Wordmark kind={l.word} color={ink} size={30}></Wordmark>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 12, color: muted, letterSpacing: "0.04em" }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked + dark */}
      <div style={{ marginBottom: 44 }}>
        <LabHead n="02">Stacked &amp; reversed</LabHead>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div style={{ background: panel, border: `1px solid ${rule}`, borderRadius: 14, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Sym name="hanger" color={ink} size={42} stroke={2.6}></Sym>
            <Wordmark kind="marcellus" color={ink} size={24}></Wordmark>
          </div>
          <div style={{ background: ink, borderRadius: 14, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Sym name="check" color={bg} size={42} stroke={2.6}></Sym>
            <Wordmark kind="archivo" color={bg} size={22}></Wordmark>
          </div>
          <div style={{ background: "#6E2B27", borderRadius: 14, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Sym name="mirror" color="#F5F0E6" size={42} stroke={2.6}></Sym>
            <Wordmark kind="instrument" color="#F5F0E6" size={24}></Wordmark>
          </div>
        </div>
      </div>

      {/* Wordmark only */}
      <div style={{ marginBottom: 0 }}>
        <LabHead n="03">Wordmark only — type voices</LabHead>
        <div style={{ background: panel, border: `1px solid ${rule}`, borderRadius: 14, padding: "8px 26px" }}>
          {wordmarks.map((w, i) => (
            <div key={w.kind} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: i < wordmarks.length - 1 ? `1px dashed ${rule}` : "none" }}>
              <Wordmark kind={w.kind} color={ink} size={32}></Wordmark>
              <span style={{ fontFamily: SANS, fontSize: 12.5, color: muted }}>{w.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- App icon / favicon grid ---------------- */

function IconTile({ sym, bg, fg, monogram, ring, size, radiusRatio = 0.24, stroke }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * radiusRatio, background: bg,
      display: "grid", placeItems: "center", flexShrink: 0,
      border: ring ? `1px solid ${ring}` : "none", overflow: "hidden",
    }}>
      {monogram
        ? <span style={{ fontFamily: monogram.font, fontWeight: monogram.weight, fontSize: size * (monogram.scale || 0.5), color: fg, letterSpacing: monogram.track || 0, lineHeight: 1 }}>{monogram.text}</span>
        : <Sym name={sym} color={fg} size={size * 0.56} stroke={stroke || Math.max(1.4, size * 0.05)}></Sym>}
    </div>
  );
}

function FaviconCard({ concept }) {
  const { name, note, bg, fg, sym, monogram, ring } = concept;
  return (
    <div style={{ background: "#FBFAF6", border: "1px solid #E4DECF", borderRadius: 16, padding: "20px 20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
        <IconTile sym={sym} monogram={monogram} bg={bg} fg={fg} ring={ring} size={84}></IconTile>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <IconTile sym={sym} monogram={monogram} bg={bg} fg={fg} ring={ring} size={32} radiusRatio={0.28}></IconTile>
            <span style={{ fontFamily: SANS, fontSize: 9.5, color: "#A39C8B" }}>32px</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <IconTile sym={sym} monogram={monogram} bg={bg} fg={fg} ring={ring} size={18} radiusRatio={0.3}></IconTile>
            <span style={{ fontFamily: SANS, fontSize: 9.5, color: "#A39C8B" }}>16px</span>
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: "#161410" }}>{name}</div>
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: "#8a8475", lineHeight: 1.45, marginTop: 2 }}>{note}</div>
      </div>
    </div>
  );
}

function FaviconExplorations() {
  const bg = "#F4F2EC", muted = "#8a8475";
  const concepts = [
    { name: "Hanger", note: "The universal wardrobe sign — instantly readable.", sym: "hanger", bg: "#6E2B27", fg: "#F5F0E6" },
    { name: "Approved fit", note: "A check: today's outfit, sorted.", sym: "check", bg: "#0E0F13", fg: "#D6FF4B" },
    { name: "Mirror", note: "Get-ready ritual, distilled to one oval.", sym: "mirror", bg: "#D2603C", fg: "#FBF3E3" },
    { name: "Folded tee", note: "Soft, friendly, obviously about clothes.", sym: "fold", bg: "#FF5A1F", fg: "#FFF4E4" },
    { name: "Button", note: "Tailoring detail; charming at any size.", sym: "button", bg: "#2742F5", fg: "#FFD75E" },
    { name: "Dress for weather", note: "Sun mark ties clothes to the forecast.", sym: "sun", bg: "#E2745B", fg: "#FFFEFA" },
    { name: "Tag", note: "Wardrobe-as-catalogue energy.", sym: "tag", bg: "#5E6B49", fg: "#F4EFE0" },
    { name: "Monogram f.", note: "Wordmark-only, lowercase with the period.", monogram: { text: "f.", font: "'Bricolage Grotesque', sans-serif", weight: 800, scale: 0.52 }, bg: "#FFF4E4", fg: "#211C16", ring: "#E4DECF" },
    { name: "Monogram F_", note: "The blinking-cursor tech read.", monogram: { text: "F_", font: "'Space Grotesk', sans-serif", weight: 700, scale: 0.4 }, bg: "#1B1D24", fg: "#F2F3F5" },
  ];
  return (
    <div className="bb-sheet" style={{ background: bg, color: "#161410", padding: "56px 56px 48px" }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.3em", color: muted, textTransform: "uppercase", marginBottom: 14 }}>New explorations</div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1 }}>App icon &amp; favicon</div>
        <div style={{ fontFamily: SANS, fontSize: 16, color: muted, marginTop: 10, maxWidth: 600 }}>Each concept shown at app-icon scale plus 32px and 16px favicon previews — so you can see which marks survive the shrink.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {concepts.map((c) => <FaviconCard key={c.name} concept={c}></FaviconCard>)}
      </div>
    </div>
  );
}

Object.assign(window, { LogoExplorations, FaviconExplorations });
