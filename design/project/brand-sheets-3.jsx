// brand-sheets-3.jsx — round 3: three new full directions. Exports: SheetSage, SheetStudio, SheetSorbet
const { BBLabel, BBSwatches, BBTypeRow, BBVoice, BBSection, Sym } = window;

/* ---------- Direction G · Sage — natural & calm ---------- */
const sageTheme = {
  bg: "#EEF0E4", fg: "#2B3022", muted: "#7E876B", rule: "#D6DBC4",
  accent: "#5E6B49", clay: "#C08457",
  labelFont: "'Hanken Grotesk', sans-serif", voiceFont: "'Instrument Serif', serif",
  swatchRadius: 14,
};

function SheetSage() {
  const t = sageTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      <div style={{ textAlign: "center", padding: "22px 0 52px" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.clay, textTransform: "uppercase", fontWeight: 700, marginBottom: 22 }}>Brand Direction G</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><Sym name="hanger" color={t.accent} size={50} stroke={2.4}></Sym></div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 88, lineHeight: 0.95 }}>Fitted</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 23, color: t.accent, marginTop: 12 }}>Dress with the season, not against it.</div>
      </div>

      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 18, display: "grid", placeItems: "center", height: 170, background: "#F5F6EE" }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42 }}>Fitted</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 18, display: "grid", placeItems: "center", height: 170, background: t.accent }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: t.bg }}>Fitted</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 18, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{ width: 96, height: 96, borderRadius: 26, background: t.accent, display: "grid", placeItems: "center" }}>
              <Sym name="hanger" color={t.bg} size={50} stroke={2.6}></Sym>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          A calm, horticultural calm: Instrument Serif for the wordmark, the hanger mark drawn with a single soft stroke. Everything breathes.
        </p>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Sage Mist", hex: "#EEF0E4", role: "Canvas", border: true },
          { name: "Pine", hex: "#2B3022", role: "Text" },
          { name: "Moss", hex: "#5E6B49", role: "Accent & actions" },
          { name: "Clay", hex: "#C08457", role: "Warm accent" },
          { name: "Reed", hex: "#CDD4BA", role: "Muted surfaces" },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Botanical neutrals with a terracotta warm-up. Moss carries actions; clay is for accents and seasonal moments.
        </p>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Instrument Serif" spec="Display · headings, 26–88px"
          sample="A slower kind of getting dressed"
          style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, lineHeight: 1.05 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Instrument Serif Italic" spec="Accents · 18–24px"
          sample="the linen wants air today"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 24 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Hanken Grotesk" spec="Body & UI · 13–16px, weights 400/600"
          sample="16° and overcast. Layer the moss cardigan over the white tee — breathable now, cozy if the wind picks up after four."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Morning. The air’s cool — let’s layer something natural." },
          { ctx: "Suggestion", copy: "Your linen shirt has been resting. Today’s the day to wear it again." },
          { ctx: "Empty closet", copy: "A bare wardrobe, full of potential. Plant your first piece." },
        ]}></BBVoice>
      </BBSection>

      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ background: "#F5F6EE", border: `1px solid ${t.rule}`, borderRadius: 20, padding: "22px 24px", width: 320 }}>
            <div style={{ display: "inline-block", fontFamily: t.labelFont, fontSize: 11.5, fontWeight: 700, color: t.accent, background: "#E0E5D0", borderRadius: 999, padding: "5px 12px", marginBottom: 10 }}>16° · overcast</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 27, marginBottom: 6 }}>The Garden Walk</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 18 }}>moss cardigan · white tee · olive chinos · canvas sneakers</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: t.accent, color: t.bg, border: "none", borderRadius: 999, padding: "13px 24px", cursor: "pointer" }}>Wear this</button>
              <button style={{ fontFamily: t.labelFont, fontSize: 14, fontWeight: 700, background: "transparent", color: t.fg, border: `1.5px solid ${t.fg}`, borderRadius: 999, padding: "13px 24px", cursor: "pointer" }}>Reshape</button>
            </div>
          </div>
          <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 300, margin: 0 }}>
            Soft rounded cards, generous whitespace, no harsh shadows. The app should feel like a quiet morning by a window.
          </p>
        </div>
      </BBSection>
    </div>
  );
}

/* ---------- Direction H · Studio — bold fashion-week ---------- */
const studioTheme = {
  bg: "#F2F0EB", fg: "#111111", muted: "#8C887F", rule: "#D8D4CB",
  accent: "#1F3BE0", hot: "#111111",
  labelFont: "'Hanken Grotesk', sans-serif", voiceFont: "'Hanken Grotesk', sans-serif",
  swatchRadius: 4,
};

function SheetStudio() {
  const t = studioTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      <div style={{ padding: "10px 0 50px" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Brand Direction H</div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 104, letterSpacing: "-0.04em", lineHeight: 0.86, fontStretch: "125%" }}>FITTED</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
          <span style={{ width: 54, height: 6, background: t.accent }}></span>
          <span style={{ fontFamily: t.labelFont, fontSize: 20, fontWeight: 600 }}>The styling studio in your pocket.</span>
        </div>
      </div>

      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", height: 170, background: "#FBFAF7" }}>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: "-0.03em", fontStretch: "125%" }}>FITTED</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", height: 170, background: t.accent }}>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: "-0.03em", color: "#F2F0EB", fontStretch: "125%" }}>FITTED</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", height: 170, background: t.fg }}>
            <div style={{ width: 96, height: 96, background: t.accent, display: "grid", placeItems: "center" }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 58, color: "#F2F0EB", fontStretch: "125%" }}>F</span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Heavy, extended Archivo set tight — a runway nameplate. Always sharp corners; the only curve in the system is the lens of a camera.
        </p>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Paper", hex: "#F2F0EB", role: "Canvas", border: true },
          { name: "Black", hex: "#111111", role: "Text & blocks" },
          { name: "Klein", hex: "#1F3BE0", role: "Single accent" },
          { name: "Concrete", hex: "#D8D4CB", role: "Rules & fills", border: true },
          { name: "Off-white", hex: "#FBFAF7", role: "Cards", border: true },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Near-monochrome with one electric blue. Restraint is the whole point — the clothes provide the color, the brand stays out of the way.
        </p>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Archivo Black Expanded" spec="Display · 26–104px, tight"
          sample="LOOK OF THE DAY"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 42, letterSpacing: "-0.03em", fontStretch: "125%", lineHeight: 0.95 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Hanken Grotesk SemiBold" spec="Subheads · 16–22px"
          sample="Edited for 17° and a 2pm meeting"
          style={{ fontFamily: t.labelFont, fontWeight: 600, fontSize: 22, lineHeight: 1.2 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Hanken Grotesk" spec="Body & UI · 13–16px"
          sample="17°, clear. Tailored grey trousers, white shirt, black overshirt. A clean line for the calendar you’re carrying today."
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "Your look is ready. Clean lines for a clear day." },
          { ctx: "Suggestion", copy: "Pull the black overshirt — it sharpens the whole set." },
          { ctx: "Empty closet", copy: "Empty rail. Let’s build the collection." },
        ]}></BBVoice>
      </BBSection>

      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ background: "#FBFAF7", border: `1px solid ${t.fg}`, padding: "22px 24px", width: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${t.fg}`, paddingBottom: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: t.labelFont, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em" }}>LOOK 01</span>
              <span style={{ fontFamily: t.labelFont, fontSize: 10.5, letterSpacing: "0.1em", color: t.accent, fontWeight: 700 }}>17° CLEAR</span>
            </div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em", fontStretch: "125%", lineHeight: 0.95, marginBottom: 8 }}>SHARP & CLEAN</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 16 }}>black overshirt · white shirt · grey trousers · derbies</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ fontFamily: t.labelFont, fontSize: 13.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: t.fg, color: t.bg, border: "none", padding: "14px 22px", cursor: "pointer" }}>Wear it</button>
              <button style={{ fontFamily: t.labelFont, fontSize: 13.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: t.accent, color: "#F2F0EB", border: "none", padding: "14px 22px", cursor: "pointer" }}>Restyle</button>
            </div>
          </div>
          <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 300, margin: 0 }}>
            Hard edges, hairline rules, type set like a magazine masthead. The single blue accent does all the talking.
          </p>
        </div>
      </BBSection>
    </div>
  );
}

/* ---------- Direction I · Sorbet — vivid & Gen-Z ---------- */
const sorbetTheme = {
  bg: "#FFF6FB", fg: "#311938", muted: "#A07FA0", rule: "#F3DCE9",
  accent: "#FF4D8D", grape: "#7A4DFF", lemon: "#FFD23F", mint: "#3FD9B0",
  labelFont: "'Hanken Grotesk', sans-serif", voiceFont: "'Gabarito', sans-serif",
  swatchRadius: 22,
};

function SheetSorbet() {
  const t = sorbetTheme;
  return (
    <div className="bb-sheet" style={{ background: t.bg, color: t.fg, padding: "56px 56px 48px" }}>
      <div style={{ textAlign: "center", padding: "16px 0 50px", position: "relative" }}>
        <div style={{ fontFamily: t.labelFont, fontSize: 11, letterSpacing: "0.3em", color: t.grape, textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Brand Direction I</div>
        <div style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: 96, lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          fit<span style={{ color: t.accent }}>t</span>ed
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
          {[t.accent, t.grape, t.lemon, t.mint].map((c) => <span key={c} style={{ width: 40, height: 12, borderRadius: 999, background: c }}></span>)}
        </div>
        <div style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 600, fontSize: 21, marginTop: 16 }}>your fit, but make it fun.</div>
      </div>

      <BBSection>
        <BBLabel theme={t} n="01">Logo &amp; app icon</BBLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 28, display: "grid", placeItems: "center", height: 170, background: "#FFFFFF" }}>
            <span style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em" }}>fit<span style={{ color: t.accent }}>t</span>ed</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 28, display: "grid", placeItems: "center", height: 170, background: t.grape }}>
            <span style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", color: "#FFF" }}>fit<span style={{ color: t.lemon }}>t</span>ed</span>
          </div>
          <div style={{ border: `1px solid ${t.rule}`, borderRadius: 28, display: "grid", placeItems: "center", height: 170 }}>
            <div style={{ width: 96, height: 96, borderRadius: 28, background: t.accent, display: "grid", placeItems: "center" }}>
              <span style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: 52, color: "#FFF" }}>f</span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          Lowercase Gabarito with one candy-bright letter swap. Bouncy, sticker-ready, made to live on a phone home screen.
        </p>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="02">Color</BBLabel>
        <BBSwatches theme={t} colors={[
          { name: "Petal", hex: "#FFF6FB", role: "Canvas", border: true },
          { name: "Plum", hex: "#311938", role: "Text" },
          { name: "Punch", hex: "#FF4D8D", role: "Hero accent" },
          { name: "Grape", hex: "#7A4DFF", role: "Secondary" },
          { name: "Mint", hex: "#3FD9B0", role: "Highlights" },
        ]}></BBSwatches>
        <p style={{ fontFamily: t.labelFont, fontSize: 13, color: t.muted, lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
          A four-scoop palette over soft petal. Rotate accents by section so the app always feels fresh — punch leads, the rest support.
        </p>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="03">Typography</BBLabel>
        <BBTypeRow theme={t} family="Gabarito ExtraBold" spec="Display · 26–96px"
          sample="serve looks daily"
          style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Gabarito SemiBold" spec="Subheads · 17–24px"
          sample="tuesday’s lewk is loading"
          style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 600, fontSize: 24, lineHeight: 1.15 }}></BBTypeRow>
        <BBTypeRow theme={t} family="Hanken Grotesk" spec="Body & UI · 13–16px"
          sample="17° and sunny means it's crop-top-and-cargos season. This combo got 5 stars last time — wanna run it back?"
          style={{ fontFamily: t.labelFont, fontSize: 15.5, lineHeight: 1.55, maxWidth: 480 }}></BBTypeRow>
      </BBSection>

      <BBSection>
        <BBLabel theme={t} n="04">Voice</BBLabel>
        <BBVoice theme={t} lines={[
          { ctx: "Morning greeting", copy: "rise and slay — it’s a bright one out there." },
          { ctx: "Suggestion", copy: "the pink cargos are calling. answer them." },
          { ctx: "Empty closet", copy: "closet’s empty?? let’s fix that — drop your first fit." },
        ]}></BBVoice>
      </BBSection>

      <BBSection style={{ marginBottom: 0 }}>
        <BBLabel theme={t} n="05">In the interface</BBLabel>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ background: "#FFFFFF", border: `1px solid ${t.rule}`, borderRadius: 28, padding: "22px 24px", width: 320, boxShadow: "0 14px 30px rgba(122,77,255,.12)" }}>
            <div style={{ display: "inline-block", fontFamily: t.labelFont, fontSize: 11.5, fontWeight: 700, color: "#FFF", background: t.mint, borderRadius: 999, padding: "5px 12px", marginBottom: 10 }}>☀️ 17° · sunny</div>
            <div style={{ fontFamily: "'Gabarito', sans-serif", fontWeight: 800, fontSize: 25, letterSpacing: "-0.02em", marginBottom: 6 }}>today’s lewk</div>
            <div style={{ fontFamily: t.labelFont, fontSize: 13.5, color: t.muted, lineHeight: 1.5, marginBottom: 18 }}>crop tank · pink cargos · platform sneakers · mini bag</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ fontFamily: "'Gabarito', sans-serif", fontSize: 15, fontWeight: 800, background: t.accent, color: "#FFF", border: "none", borderRadius: 999, padding: "13px 24px", cursor: "pointer" }}>wear it ✨</button>
              <button style={{ fontFamily: "'Gabarito', sans-serif", fontSize: 15, fontWeight: 800, background: t.grape, color: "#FFF", border: "none", borderRadius: 999, padding: "13px 24px", cursor: "pointer" }}>remix</button>
            </div>
          </div>
          <p style={{ fontFamily: t.labelFont, fontSize: 12.5, color: t.muted, lineHeight: 1.6, maxWidth: 300, margin: 0 }}>
            Pillowy rounded everything, candy accents that rotate, springy motion. Loud, young, and unapologetically fun.
          </p>
        </div>
      </BBSection>
    </div>
  );
}

Object.assign(window, { SheetSage, SheetStudio, SheetSorbet });
