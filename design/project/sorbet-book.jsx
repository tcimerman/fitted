// sorbet-book.jsx — FITTED Sorbet full brand book. Exports: SorbetBook
const { SB, UIcon, Garment, Sym } = window;
const {
  SButton, SIconButton, SFab, SChip, SFilterRow, SSegmented, SInput, SSearch,
  SToggle, SSlider, SBadge, SStars, SAvatar, SWeatherPill, SGarmentTile, SItemRow,
  SOutfitCard, SBottomNav, STopBar, SToast, SProgress,
} = window;
const R = React;

const NAV = [
  ["essence", "Brand essence"], ["logo", "Logo"], ["color", "Color"],
  ["type", "Typography"], ["icons", "Icons & garments"], ["voice", "Voice & tone"],
  ["components", "Components"], ["screens", "In the app"], ["motion", "Motion"],
];

/* ---------- layout helpers ---------- */
function Section({ id, kicker, title, intro, children }) {
  return (
    <section id={id} style={{ padding: "64px 0 8px", scrollMarginTop: 24 }}>
      <div style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: SB.punch, marginBottom: 12 }}>{kicker}</div>
      <h2 style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 44, letterSpacing: "-0.03em", lineHeight: 1.02, color: SB.plum, margin: "0 0 14px" }}>{title}</h2>
      {intro ? <p style={{ fontFamily: SB.body, fontSize: 17, lineHeight: 1.6, color: SB.muted, maxWidth: 620, margin: "0 0 34px" }}>{intro}</p> : null}
      {children}
    </section>
  );
}

function Panel({ children, pad = 28, style }) {
  return <div style={{ background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rCard, padding: pad, ...style }}>{children}</div>;
}

function MiniLabel({ children }) {
  return <div style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: SB.muted, marginBottom: 16 }}>{children}</div>;
}

/* ---------- phone shell for screens ---------- */
function Phone({ children }) {
  return (
    <div style={{ width: 320, height: 660, background: SB.petal, borderRadius: 40, border: `10px solid ${SB.plum}`, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: SB.shadow, flexShrink: 0 }}>
      <div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", flexShrink: 0 }}>
        <span style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 700, color: SB.plum }}>9:41</span>
        <span style={{ fontFamily: SB.body, fontSize: 11, color: SB.muted }}>✦ ✦ ✦</span>
      </div>
      {children}
    </div>
  );
}

function ScreenToday() {
  return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 16px 14px", minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 700, color: SB.muted, letterSpacing: "0.02em" }}>TUE · 12 MAY</div>
            <div style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 27, letterSpacing: "-0.02em", color: SB.plum }}>rise & slay ✨</div>
          </div>
          <SAvatar></SAvatar>
        </div>
        <div style={{ marginBottom: 14 }}><SWeatherPill>17° · sunny all day</SWeatherPill></div>
        <div style={{ flex: 1, minHeight: 0 }}><SOutfitCard></SOutfitCard></div>
      </div>
      <div style={{ padding: "0 14px 10px" }}><SBottomNav></SBottomNav></div>
    </Phone>
  );
}

function ScreenCloset() {
  const grid = [
    { type: "tee", color: "#FF4D8D", match: 92 }, { type: "jacket", color: "#7A4DFF", selected: true }, { type: "dress", color: "#3FD9B0" },
    { type: "pants", color: "#311938", selected: true }, { type: "shoe", color: "#FFD23F", selected: true }, { type: "skirt", color: "#FF4D8D" },
    { type: "sweater", color: "#7A4DFF" }, { type: "tote", color: "#3FD9B0" }, { type: "hat", color: "#FFD23F" },
  ];
  return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 16px 14px", minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", color: SB.plum }}>my closet</span>
          <SIconButton icon="sliders"></SIconButton>
        </div>
        <div style={{ marginBottom: 14 }}><SSearch></SSearch></div>
        <div style={{ marginBottom: 14 }}><SFilterRow></SFilterRow></div>
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {grid.map((g, i) => <SGarmentTile key={i} {...g}></SGarmentTile>)}
          </div>
        </div>
        <div style={{ paddingTop: 12 }}><SButton variant="primary" full icon="bolt">build the fit! (3)</SButton></div>
      </div>
    </Phone>
  );
}

/* ---------- color ---------- */
function Swatch({ name, hex, role, big, dark }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ height: big ? 120 : 78, background: hex, borderRadius: 16, border: `1px solid ${SB.rule}` }}></div>
      <div>
        <div style={{ fontFamily: SB.body, fontSize: 14, fontWeight: 800, color: SB.plum }}>{name}</div>
        <div style={{ fontFamily: SB.body, fontSize: 12.5, color: SB.muted, letterSpacing: "0.03em" }}>{hex.toUpperCase()}</div>
        <div style={{ fontFamily: SB.body, fontSize: 12.5, color: SB.muted }}>{role}</div>
      </div>
    </div>
  );
}

/* ---------- main book ---------- */
function SorbetBook() {
  const [active, setActive] = R.useState("essence");
  R.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: SB.petal, minHeight: "100vh", color: SB.plum }}>
      {/* sidebar */}
      <aside style={{ position: "fixed", top: 0, left: 0, width: 256, height: "100vh", background: SB.white, borderRight: `1.5px solid ${SB.rule}`, padding: "34px 26px", display: "flex", flexDirection: "column", boxSizing: "border-box", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: SB.punch, display: "grid", placeItems: "center" }}>
            <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 24, color: "#fff" }}>f</span>
          </div>
          <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em" }}>fit<span style={{ color: SB.punch }}>t</span>ed</span>
        </div>
        <div style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 700, color: SB.muted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "18px 0 14px" }}>Brand book · Sorbet</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(([id, label], i) => (
            <a key={id} href={`#${id}`} style={{
              fontFamily: SB.body, fontSize: 14.5, fontWeight: active === id ? 800 : 600, textDecoration: "none",
              color: active === id ? SB.punch : SB.muted, padding: "9px 12px", borderRadius: 10,
              background: active === id ? SB.punchSoft : "transparent", display: "flex", gap: 10, alignItems: "center",
            }}>
              <span style={{ fontFamily: SB.body, fontSize: 11, fontWeight: 700, opacity: .6 }}>{String(i + 1).padStart(2, "0")}</span>{label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: "auto", fontFamily: SB.body, fontSize: 11.5, color: SB.muted, lineHeight: 1.5 }}>FITTED · v1.0<br></br>The wardrobe helper that picks your fit.</div>
      </aside>

      {/* content */}
      <main style={{ marginLeft: 256, padding: "0 64px 100px", maxWidth: 1000 }}>
        {/* hero */}
        <header style={{ minHeight: "84vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 0 40px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
            {[SB.punch, SB.grape, SB.mint, SB.lemon].map((c) => <span key={c} style={{ width: 46, height: 14, borderRadius: 999, background: c }}></span>)}
          </div>
          <h1 style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 132, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: SB.plum }}>
            fit<span style={{ color: SB.punch }}>t</span>ed
          </h1>
          <p style={{ fontFamily: SB.display, fontWeight: 600, fontSize: 30, color: SB.plum, margin: "22px 0 0" }}>your fit, but make it fun.</p>
          <p style={{ fontFamily: SB.body, fontSize: 18, color: SB.muted, maxWidth: 560, lineHeight: 1.6, margin: "18px 0 0" }}>
            The Sorbet brand system — colors, type, voice, and a full component kit for the wardrobe helper that picks what to wear, every single day.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 34 }}>
            <SButton variant="primary" size="lg">Start exploring</SButton>
            <SButton variant="outline" size="lg">Download kit</SButton>
          </div>
        </header>

        {/* ESSENCE */}
        <Section id="essence" kicker="01 · Brand essence" title="Loud, young, and unapologetically fun" intro="FITTED is the friend who hypes up your outfit before you leave the house. Sorbet is the most playful expression of that energy — bright, bouncy, and warm. It should feel like a treat, never a chore.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Panel>
              <MiniLabel>We are</MiniLabel>
              {["Encouraging — a cheerleader, not a critic", "Playful — emoji-fluent, never stiff", "Confident — bold color, big type", "Effortless — one tap to a great fit"].map((x) => (
                <div key={x} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ marginTop: 2 }}><UIcon name="check" size={18} color={SB.mint} stroke={2.6}></UIcon></span>
                  <span style={{ fontFamily: SB.body, fontSize: 15, color: SB.plum, lineHeight: 1.45 }}>{x}</span>
                </div>
              ))}
            </Panel>
            <Panel style={{ background: SB.plum, borderColor: SB.plum }}>
              <MiniLabel>We are not</MiniLabel>
              {["Judgy about what you own", "Beige, corporate, or minimal-cold", "Overwhelming or technical", "Trying to sell you new clothes"].map((x) => (
                <div key={x} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ color: SB.punch, fontFamily: SB.display, fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>×</span>
                  <span style={{ fontFamily: SB.body, fontSize: 15, color: "#fff", opacity: .85, lineHeight: 1.45 }}>{x}</span>
                </div>
              ))}
            </Panel>
          </div>
          <Panel style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["Personality", "Bestie energy"], ["Pace", "Quick & springy"], ["Color", "Candy-bright"], ["Voice", "Lowercase, warm"]].map(([k, v]) => (
              <div key={k} style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: SB.muted, marginBottom: 6 }}>{k}</div>
                <div style={{ fontFamily: SB.display, fontWeight: 700, fontSize: 22, color: SB.grape }}>{v}</div>
              </div>
            ))}
          </Panel>
        </Section>

        {/* LOGO */}
        <Section id="logo" kicker="02 · Logo" title="The wordmark & app mark" intro="Always lowercase Gabarito with one candy-bright letter swap on the second “t”. Bouncy, sticker-ready, made to live on a phone home screen.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Panel style={{ display: "grid", placeItems: "center", minHeight: 150 }}>
              <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em" }}>fit<span style={{ color: SB.punch }}>t</span>ed</span>
            </Panel>
            <Panel style={{ display: "grid", placeItems: "center", minHeight: 150, background: SB.grape, borderColor: SB.grape }}>
              <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", color: "#fff" }}>fit<span style={{ color: SB.lemon }}>t</span>ed</span>
            </Panel>
            <Panel style={{ display: "grid", placeItems: "center", minHeight: 150 }}>
              <div style={{ width: 92, height: 92, borderRadius: 26, background: SB.punch, display: "grid", placeItems: "center" }}>
                <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 52, color: "#fff" }}>f</span>
              </div>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel>
              <MiniLabel>Clearspace & sizing</MiniLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: 24, border: `1.5px dashed ${SB.rule}`, borderRadius: 14 }}>
                  <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em" }}>fit<span style={{ color: SB.punch }}>t</span>ed</span>
                </div>
                <span style={{ fontFamily: SB.body, fontSize: 13.5, color: SB.muted, lineHeight: 1.5 }}>Keep clearspace equal to the height of the “f” on all sides. Minimum digital size: 80px wide.</span>
              </div>
            </Panel>
            <Panel>
              <MiniLabel>Don’t</MiniLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Don’t stretch, skew, or recolor the whole word", "Don’t set it in any other typeface", "Don’t add drop shadows or gradients to the mark"].map((x) => (
                  <div key={x} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{ color: SB.punch, fontFamily: SB.display, fontWeight: 800 }}>×</span>
                    <span style={{ fontFamily: SB.body, fontSize: 14, color: SB.plum }}>{x}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </Section>

        {/* COLOR */}
        <Section id="color" kicker="03 · Color" title="A four-scoop palette" intro="Petal is the canvas, plum is the ink. Punch leads — the rest rotate by section so the app always feels fresh. Never let two accents fight; petal or white always sits between them.">
          <Panel style={{ marginBottom: 16 }}>
            <MiniLabel>Core</MiniLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <Swatch name="Punch" hex="#FF4D8D" role="Hero accent · primary"></Swatch>
              <Swatch name="Grape" hex="#7A4DFF" role="Secondary actions"></Swatch>
              <Swatch name="Mint" hex="#3FD9B0" role="Success · highlights"></Swatch>
              <Swatch name="Lemon" hex="#FFD23F" role="Accent · ratings"></Swatch>
              <Swatch name="Plum" hex="#311938" role="Text & deep surfaces"></Swatch>
              <Swatch name="Petal" hex="#FFF6FB" role="App canvas"></Swatch>
            </div>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
            <Panel>
              <MiniLabel>Soft tints — surfaces & fills</MiniLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {[["Punch", "#FFE3EE"], ["Grape", "#ECE5FF"], ["Mint", "#DEF7EF"], ["Lemon", "#FFF1C9"], ["Petal", "#FCE7F1"]].map(([n, h]) => (
                  <div key={n} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <div style={{ height: 58, background: h, borderRadius: 12, border: `1px solid ${SB.rule}` }}></div>
                    <span style={{ fontFamily: SB.body, fontSize: 11.5, fontWeight: 700, color: SB.muted }}>{h}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <MiniLabel>Usage ratio</MiniLabel>
              <div style={{ display: "flex", height: 46, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ flex: 70, background: SB.petal }}></div>
                <div style={{ flex: 14, background: SB.punch }}></div>
                <div style={{ flex: 9, background: SB.grape }}></div>
                <div style={{ flex: 7, background: SB.mint }}></div>
              </div>
              <span style={{ fontFamily: SB.body, fontSize: 13, color: SB.muted, lineHeight: 1.5 }}>≈70% petal canvas, ~14% punch, the rest split between grape, mint & lemon.</span>
            </Panel>
          </div>
        </Section>

        {/* TYPE */}
        <Section id="type" kicker="04 · Typography" title="Gabarito × Hanken Grotesk" intro="Gabarito — rounded and friendly — handles every headline, lowercase by default. Hanken Grotesk is the clean, legible workhorse for body and UI.">
          <Panel style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${SB.rule}` }}>
              <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 72, letterSpacing: "-0.03em", lineHeight: 1 }}>Aa</span>
              <span style={{ fontFamily: SB.body, fontSize: 14, color: SB.muted, textAlign: "right" }}>Gabarito<br></br>Display · 600 / 700 / 800</span>
            </div>
            {[["serve looks daily", 44, 800], ["tuesday’s lewk is loading", 30, 600]].map(([t, s, w]) => (
              <div key={t} style={{ fontFamily: SB.display, fontWeight: w, fontSize: s, letterSpacing: "-0.02em", color: SB.plum, marginBottom: 12 }}>{t}</div>
            ))}
          </Panel>
          <Panel>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${SB.rule}` }}>
              <span style={{ fontFamily: SB.body, fontWeight: 700, fontSize: 60, letterSpacing: "-0.02em", lineHeight: 1 }}>Aa</span>
              <span style={{ fontFamily: SB.body, fontSize: 14, color: SB.muted, textAlign: "right" }}>Hanken Grotesk<br></br>Body & UI · 400 / 500 / 600 / 700</span>
            </div>
            <p style={{ fontFamily: SB.body, fontSize: 16.5, lineHeight: 1.6, color: SB.plum, maxWidth: 560, margin: 0 }}>
              17° and sunny means it’s crop-top-and-cargos season. This combo got five stars last time — wanna run it back? Tap wear it and you’re out the door.
            </p>
          </Panel>
        </Section>

        {/* ICONS */}
        <Section id="icons" kicker="05 · Icons & garments" title="Rounded marks, flat garments" intro="UI icons use a rounded 2px stroke. Clothing is shown as friendly flat silhouettes filled with palette color on soft petal tiles.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel>
              <MiniLabel>Brand marks</MiniLabel>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                {["hanger", "check", "mirror", "button", "tag", "sun"].map((s) => (
                  <div key={s} style={{ width: 56, height: 56, borderRadius: 16, background: SB.petalDeep, display: "grid", placeItems: "center" }}>
                    <Sym name={s} color={SB.grape} size={30} stroke={2.6}></Sym>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <MiniLabel>Garment tiles</MiniLabel>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[["tee", SB.punch], ["jacket", SB.grape], ["dress", SB.mint], ["shoe", SB.lemon], ["tote", SB.punch]].map(([t, c]) => (
                  <div key={t} style={{ width: 64, height: 64, borderRadius: 14, background: SB.petal, border: `1px solid ${SB.rule}`, display: "grid", placeItems: "center" }}>
                    <Garment type={t} color={c} size={42}></Garment>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </Section>

        {/* VOICE */}
        <Section id="voice" kicker="06 · Voice & tone" title="Talk like a hype friend" intro="Lowercase, warm, a little cheeky. Emoji are welcome but earn their place. We celebrate what’s already in the closet — never make anyone feel behind.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              ["Morning greeting", "rise and slay — it’s a bright one out there ☀️"],
              ["Outfit suggestion", "the pink cargos are calling. answer them."],
              ["Empty state", "closet’s empty?? let’s fix that — drop your first fit."],
              ["Celebration", "look at you go. that’s 7 days styled in a row 🔥"],
            ].map(([ctx, copy]) => (
              <Panel key={ctx}>
                <div style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: SB.muted, marginBottom: 10 }}>{ctx}</div>
                <div style={{ fontFamily: SB.display, fontWeight: 600, fontSize: 21, color: SB.plum, lineHeight: 1.35 }}>{copy}</div>
              </Panel>
            ))}
          </div>
        </Section>

        {/* COMPONENTS */}
        <Section id="components" kicker="07 · Components" title="The component kit" intro="The building blocks of the app — live and interactive. Tap the chips, toggles, and segmented controls below.">
          <Panel style={{ marginBottom: 16 }}>
            <MiniLabel>Buttons</MiniLabel>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <SButton variant="primary" icon="bolt">wear it</SButton>
              <SButton variant="secondary" icon="shuffle">remix</SButton>
              <SButton variant="mint">save</SButton>
              <SButton variant="ghost">maybe</SButton>
              <SButton variant="outline">skip</SButton>
              <SIconButton icon="heart" tone="punch"></SIconButton>
              <SIconButton icon="heart" tone="punch" filled></SIconButton>
              <SFab></SFab>
            </div>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Panel>
              <MiniLabel>Chips & filters</MiniLabel>
              <SFilterRow></SFilterRow>
              <div style={{ marginTop: 16 }}><SSegmented></SSegmented></div>
            </Panel>
            <Panel>
              <MiniLabel>Badges</MiniLabel>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                <SBadge tone="mint" icon="star">92% match</SBadge>
                <SBadge tone="punch">new</SBadge>
                <SBadge tone="grape">date night</SBadge>
                <SBadge tone="lemon">5★ fit</SBadge>
                <SBadge tone="neutral">worn 4×</SBadge>
              </div>
              <SStars n={4}></SStars>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Panel>
              <MiniLabel>Inputs</MiniLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <SSearch></SSearch>
                <SInput label="Item name" value="Pink cargo pants" icon="hanger"></SInput>
                <SInput label="Occasion" placeholder="add a tag…" icon="tag"></SInput>
              </div>
            </Panel>
            <Panel>
              <MiniLabel>Controls</MiniLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: SB.body, fontSize: 14.5, fontWeight: 600, color: SB.plum }}>Weather-based picks</span><SToggle></SToggle>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: SB.body, fontSize: 14.5, fontWeight: 600, color: SB.plum }}>Daily reminder</span><SToggle defaultOn={false}></SToggle>
                </div>
                <div>
                  <div style={{ fontFamily: SB.body, fontSize: 13, fontWeight: 700, color: SB.plum, marginBottom: 12 }}>Boldness</div>
                  <SSlider pct={70}></SSlider>
                </div>
                <SProgress></SProgress>
              </div>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Panel>
              <MiniLabel>List rows</MiniLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SItemRow></SItemRow>
                <SItemRow type="dress" color="#FF4D8D" title="Floral dress" sub="Worn 2× · 5★ rated"></SItemRow>
                <SItemRow type="shoe" color="#3FD9B0" title="Platform sneakers" sub="New · not worn yet"></SItemRow>
              </div>
            </Panel>
            <Panel>
              <MiniLabel>Garment tiles</MiniLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <SGarmentTile type="tee" color="#FF4D8D" match={92}></SGarmentTile>
                <SGarmentTile type="jacket" color="#7A4DFF" selected></SGarmentTile>
                <SGarmentTile type="dress" color="#3FD9B0" badge="new"></SGarmentTile>
              </div>
              <div style={{ marginTop: 14 }}><SToast></SToast></div>
            </Panel>
          </div>
          <Panel>
            <MiniLabel>Navigation</MiniLabel>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
              <STopBar></STopBar>
              <SBottomNav></SBottomNav>
            </div>
          </Panel>
        </Section>

        {/* SCREENS */}
        <Section id="screens" kicker="08 · In the app" title="Put together" intro="The components assembled into real screens — the daily “today” pick and the closet you build looks from.">
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <ScreenToday></ScreenToday>
            <ScreenCloset></ScreenCloset>
          </div>
        </Section>

        {/* MOTION */}
        <Section id="motion" kicker="09 · Motion" title="Springy, never sluggish" intro="Everything bounces in. Motion should feel like a friendly nudge — quick, soft, and a little playful.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[["Enter", "Spring · scale 0.9→1 + fade, 240ms"], ["Tap", "Press to 0.96, release with overshoot"], ["Success", "Pop + confetti tick on “wear it”"]].map(([k, v]) => (
              <Panel key={k}>
                <div style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 22, color: SB.grape, marginBottom: 8 }}>{k}</div>
                <div style={{ fontFamily: SB.body, fontSize: 14, color: SB.muted, lineHeight: 1.5 }}>{v}</div>
              </Panel>
            ))}
          </div>
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${SB.rule}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 22, color: SB.plum }}>fit<span style={{ color: SB.punch }}>t</span>ed</span>
            <span style={{ fontFamily: SB.body, fontSize: 13, color: SB.muted }}>Sorbet brand book · v1.0</span>
          </div>
        </Section>
      </main>
    </div>
  );
}

window.SorbetBook = SorbetBook;
