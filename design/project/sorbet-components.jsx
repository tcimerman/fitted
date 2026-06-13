// sorbet-components.jsx — FITTED Sorbet UI component library.
// Exports interactive components to window. Depends on SB, UIcon, Garment.
const { SB, UIcon, Garment } = window;
const RS = React;

/* ---------------- Buttons ---------------- */
function SButton({ variant = "primary", children, icon, size = "md", full }) {
  const pads = { sm: "10px 16px", md: "13px 22px", lg: "16px 28px" };
  const fonts = { sm: 14, md: 15.5, lg: 17 };
  const v = {
    primary: { bg: SB.punch, fg: "#fff", bd: "transparent" },
    secondary: { bg: SB.grape, fg: "#fff", bd: "transparent" },
    mint: { bg: SB.mint, fg: "#0C3D30", bd: "transparent" },
    ghost: { bg: SB.punchSoft, fg: SB.punch, bd: "transparent" },
    outline: { bg: "transparent", fg: SB.plum, bd: SB.plum },
  }[variant];
  return (
    <button style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontFamily: SB.display, fontWeight: 800, fontSize: fonts[size], letterSpacing: "-0.01em",
      background: v.bg, color: v.fg, border: `2px solid ${v.bd}`, borderRadius: SB.rPill,
      padding: pads[size], cursor: "pointer", width: full ? "100%" : "auto", whiteSpace: "nowrap",
    }}>
      {icon ? <UIcon name={icon} size={fonts[size] + 3} color={v.fg} stroke={2.4}></UIcon> : null}
      {children}
    </button>
  );
}

function SIconButton({ icon = "heart", tone = "plum", filled }) {
  const c = { plum: SB.plum, punch: SB.punch, grape: SB.grape }[tone];
  return (
    <button style={{
      width: 46, height: 46, borderRadius: "50%", display: "grid", placeItems: "center", cursor: "pointer",
      background: filled ? c : SB.white, border: `1.5px solid ${filled ? c : SB.rule}`,
    }}>
      <UIcon name={icon} size={20} color={filled ? "#fff" : c} stroke={2}></UIcon>
    </button>
  );
}

function SFab({ icon = "plus" }) {
  return (
    <button style={{
      width: 60, height: 60, borderRadius: "50%", background: SB.punch, border: "none", cursor: "pointer",
      display: "grid", placeItems: "center", boxShadow: "0 10px 22px rgba(255,77,141,.4)",
    }}>
      <UIcon name={icon} size={28} color="#fff" stroke={2.6}></UIcon>
    </button>
  );
}

/* ---------------- Chips / filters ---------------- */
function SChip({ children, active, onClick, tone = "punch" }) {
  const c = SB[tone] || SB.punch;
  return (
    <button onClick={onClick} style={{
      fontFamily: SB.body, fontSize: 13.5, fontWeight: active ? 700 : 600, cursor: "pointer",
      padding: "9px 16px", borderRadius: SB.rChip, whiteSpace: "nowrap",
      background: active ? c : SB.white, color: active ? "#fff" : SB.muted,
      border: `1.5px solid ${active ? c : SB.rule}`,
    }}>{children}</button>
  );
}

function SFilterRow() {
  const [active, setActive] = RS.useState(0);
  const opts = ["All", "Tops", "Bottoms", "Shoes", "Bags"];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {opts.map((o, i) => <SChip key={o} active={i === active} onClick={() => setActive(i)}>{o}</SChip>)}
    </div>
  );
}

/* ---------------- Segmented control ---------------- */
function SSegmented({ options = ["Outfits", "Items"], }) {
  const [i, setI] = RS.useState(0);
  return (
    <div style={{ display: "inline-flex", background: SB.petalDeep, borderRadius: SB.rPill, padding: 4, gap: 2 }}>
      {options.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} style={{
          fontFamily: SB.body, fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none",
          padding: "9px 20px", borderRadius: SB.rPill,
          background: i === idx ? SB.white : "transparent", color: i === idx ? SB.punch : SB.muted,
          boxShadow: i === idx ? SB.shadowSm : "none",
        }}>{o}</button>
      ))}
    </div>
  );
}

/* ---------------- Inputs ---------------- */
function SInput({ label, placeholder, value, icon }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label ? <span style={{ fontFamily: SB.body, fontSize: 13, fontWeight: 700, color: SB.plum }}>{label}</span> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rField, padding: "13px 16px" }}>
        {icon ? <UIcon name={icon} size={19} color={SB.muted}></UIcon> : null}
        <span style={{ fontFamily: SB.body, fontSize: 15, color: value ? SB.plum : SB.muted, fontWeight: value ? 600 : 400 }}>{value || placeholder}</span>
      </div>
    </label>
  );
}

function SSearch() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rPill, padding: "13px 18px" }}>
      <UIcon name="search" size={19} color={SB.muted}></UIcon>
      <span style={{ fontFamily: SB.body, fontSize: 15, color: SB.muted }}>Search your closet…</span>
    </div>
  );
}

/* ---------------- Toggle / slider ---------------- */
function SToggle({ defaultOn = true }) {
  const [on, setOn] = RS.useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: 52, height: 30, borderRadius: 999, border: "none", cursor: "pointer", padding: 3,
      background: on ? SB.mint : SB.rule, display: "flex", justifyContent: on ? "flex-end" : "flex-start", transition: "background .2s",
    }}>
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,.18)" }}></span>
    </button>
  );
}

function SSlider({ pct = 65 }) {
  return (
    <div style={{ position: "relative", height: 8, background: SB.petalDeep, borderRadius: 999 }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${pct}%`, background: SB.grape, borderRadius: 999 }}></div>
      <div style={{ position: "absolute", left: `calc(${pct}% - 11px)`, top: -7, width: 22, height: 22, borderRadius: "50%", background: "#fff", border: `3px solid ${SB.grape}`, boxShadow: SB.shadowSm }}></div>
    </div>
  );
}

/* ---------------- Badges & bits ---------------- */
function SBadge({ children, tone = "mint", icon }) {
  const map = {
    mint: { bg: SB.mintSoft, fg: "#0C8763" }, punch: { bg: SB.punchSoft, fg: SB.punch },
    grape: { bg: SB.grapeSoft, fg: SB.grape }, lemon: { bg: SB.lemonSoft, fg: "#9A7A00" },
    neutral: { bg: SB.petalDeep, fg: SB.muted },
  }[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: SB.body, fontSize: 12, fontWeight: 700, background: map.bg, color: map.fg, borderRadius: 999, padding: "5px 11px" }}>
      {icon ? <UIcon name={icon} size={13} color={map.fg} stroke={2.4}></UIcon> : null}{children}
    </span>
  );
}

function SStars({ n = 5, of = 5 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: of }).map((_, i) => <UIcon key={i} name="star" size={16} color={i < n ? SB.lemon : SB.rule} stroke={2}></UIcon>)}
    </span>
  );
}

function SAvatar({ letter = "M", tone = "grape", size = 44 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: SB[tone], display: "grid", placeItems: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: size * 0.42, color: "#fff" }}>{letter}</span>
    </div>
  );
}

function SWeatherPill({ tone = "mint", children = "17° · sunny" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: SB.body, fontSize: 13, fontWeight: 700, background: SB[tone], color: "#fff", borderRadius: 999, padding: "7px 14px" }}>
      <UIcon name="sun" size={15} color="#fff" stroke={2.2}></UIcon>{children}
    </span>
  );
}

/* ---------------- Cards ---------------- */
function SGarmentTile({ type = "tee", color = "#FF4D8D", label, badge, selected, match }) {
  return (
    <div style={{ position: "relative", background: SB.white, border: `${selected ? 2 : 1.5}px solid ${selected ? SB.punch : SB.rule}`, borderRadius: SB.rTile, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 10px 12px" }}>
      <Garment type={type} color={color} size={62}></Garment>
      {label ? <span style={{ fontFamily: SB.body, fontSize: 12, fontWeight: 600, color: SB.muted }}>{label}</span> : null}
      {selected ? <span style={{ position: "absolute", top: 9, right: 9, width: 22, height: 22, borderRadius: "50%", background: SB.punch, display: "grid", placeItems: "center" }}><UIcon name="check" size={13} color="#fff" stroke={2.6}></UIcon></span> : null}
      {match ? <span style={{ position: "absolute", top: 9, left: 9 }}><SBadge tone="mint">{match}%</SBadge></span> : null}
      {badge ? <span style={{ position: "absolute", top: 9, left: 9 }}><SBadge tone="punch">{badge}</SBadge></span> : null}
    </div>
  );
}

function SItemRow({ type = "jacket", color = "#7A4DFF", title = "Denim jacket", sub = "Worn 4× · last week" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rTile, padding: "12px 14px" }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: SB.petalDeep, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Garment type={type} color={color} size={38}></Garment>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SB.body, fontSize: 15, fontWeight: 700, color: SB.plum }}>{title}</div>
        <div style={{ fontFamily: SB.body, fontSize: 12.5, color: SB.muted, marginTop: 1 }}>{sub}</div>
      </div>
      <UIcon name="arrowR" size={20} color={SB.muted}></UIcon>
    </div>
  );
}

function SOutfitCard() {
  const items = [
    { type: "tee", color: "#FF4D8D" }, { type: "pants", color: "#7A4DFF" },
    { type: "shoe", color: "#3FD9B0" }, { type: "tote", color: "#FFD23F" },
  ];
  return (
    <div style={{ background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rCard, padding: 18, boxShadow: SB.shadow, width: 300 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <SWeatherPill></SWeatherPill>
        <SBadge tone="mint" icon="star">92% match</SBadge>
      </div>
      <div style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", marginBottom: 12, color: SB.plum }}>today’s lewk</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: SB.petal, borderRadius: 14, display: "grid", placeItems: "center", padding: "14px 0" }}>
            <Garment type={it.type} color={it.color} size={54}></Garment>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <SButton variant="primary" full>wear it ✨</SButton>
        <SButton variant="secondary" icon="shuffle">remix</SButton>
      </div>
    </div>
  );
}

/* ---------------- Nav / bars ---------------- */
function SBottomNav() {
  const items = [["sun", "Today", true], ["hanger", "Closet"], ["plus", "", false, true], ["heart", "Saved"], ["user", "You"]];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rCard, padding: "10px 14px 8px", width: 340 }}>
      {items.map(([ic, lb, active, fab], i) => fab ? (
        <div key={i}><SFab></SFab></div>
      ) : (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 54 }}>
          <UIcon name={ic} size={22} color={active ? SB.punch : SB.muted} stroke={active ? 2.3 : 1.8}></UIcon>
          <span style={{ fontFamily: SB.body, fontSize: 10.5, fontWeight: active ? 700 : 500, color: active ? SB.plum : SB.muted }}>{lb}</span>
        </div>
      ))}
    </div>
  );
}

function STopBar({ title = "my closet" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: SB.white, border: `1.5px solid ${SB.rule}`, borderRadius: SB.rCard, padding: "14px 18px", width: 340 }}>
      <span style={{ fontFamily: SB.display, fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", color: SB.plum }}>{title}</span>
      <div style={{ display: "flex", gap: 10 }}>
        <SIconButton icon="search"></SIconButton>
        <SAvatar></SAvatar>
      </div>
    </div>
  );
}

/* ---------------- Toast / progress ---------------- */
function SToast({ children = "Added to today’s outfit", tone = "grape" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: SB.plum, color: "#fff", borderRadius: SB.rPill, padding: "13px 20px", boxShadow: SB.shadow }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: SB[tone], display: "grid", placeItems: "center" }}><UIcon name="check" size={15} color="#fff" stroke={2.6}></UIcon></span>
      <span style={{ fontFamily: SB.body, fontSize: 14.5, fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function SProgress({ pct = 70, label = "Closet logged" }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontFamily: SB.body, fontSize: 13, fontWeight: 700, color: SB.plum }}>{label}</span>
        <span style={{ fontFamily: SB.body, fontSize: 13, fontWeight: 700, color: SB.grape }}>{pct}%</span>
      </div>
      <div style={{ height: 10, background: SB.petalDeep, borderRadius: 999 }}>
        <div style={{ height: 10, width: `${pct}%`, background: `linear-gradient(90deg, ${SB.punch}, ${SB.grape})`, borderRadius: 999 }}></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SButton, SIconButton, SFab, SChip, SFilterRow, SSegmented, SInput, SSearch,
  SToggle, SSlider, SBadge, SStars, SAvatar, SWeatherPill, SGarmentTile, SItemRow,
  SOutfitCard, SBottomNav, STopBar, SToast, SProgress,
});
