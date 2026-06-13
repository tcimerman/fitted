// app-screens.jsx — full FITTED app pages (Home + Closet) across themes
// Exports: AppHome, AppCloset, fittedThemes (to window)
const { Garment, UIcon } = window;

/* ---------------- shared chrome ---------------- */

function StatusBar({ color = "#fff" }) {
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", flexShrink: 0 }}>
      <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={color} aria-hidden="true"><rect x="0" y="6" width="3" height="5" rx="1"></rect><rect x="4.5" y="4" width="3" height="7" rx="1"></rect><rect x="9" y="2" width="3" height="9" rx="1"></rect><rect x="13.5" y="0" width="3" height="11" rx="1"></rect></svg>
        <svg width="22" height="11" viewBox="0 0 24 12" fill="none" aria-hidden="true"><rect x="1" y="1" width="19" height="10" rx="3" stroke={color} strokeWidth="1.2" opacity="0.5"></rect><rect x="2.5" y="2.5" width="13" height="7" rx="1.5" fill={color}></rect><rect x="21" y="4" width="2" height="4" rx="1" fill={color} opacity="0.5"></rect></svg>
      </div>
    </div>
  );
}

function BottomNav({ t }) {
  const items = [
    { icon: "sun", label: "Today", active: true },
    { icon: "hanger", label: "Closet" },
    { icon: "plus", label: "", fab: true },
    { icon: "heart", label: "Saved" },
    { icon: "user", label: "You" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "10px 14px 8px", borderTop: `1px solid ${t.rule}`, background: t.navBg, flexShrink: 0,
    }}>
      {items.map((it, i) => it.fab ? (
        <div key={i} style={{
          width: 52, height: 52, borderRadius: t.btnRadius >= 99 ? "50%" : 16, background: t.accent,
          color: t.accentFg, display: "grid", placeItems: "center", marginTop: -22,
          boxShadow: t.hardShadow ? `3px 3px 0 ${t.fg}` : `0 8px 18px ${t.accent}55`,
          border: t.hardShadow ? `2px solid ${t.fg}` : "none",
        }}>
          <UIcon name="plus" size={26} color={t.accentFg} stroke={2.4}></UIcon>
        </div>
      ) : (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 56 }}>
          <UIcon name={it.icon} size={22} color={it.active ? t.accent : t.muted} stroke={it.active ? 2.2 : 1.8}></UIcon>
          <span style={{ fontFamily: t.bodyFont, fontSize: 10.5, fontWeight: it.active ? 700 : 500, color: it.active ? t.fg : t.muted, letterSpacing: t.upper ? "0.06em" : 0 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function Phone({ children }) {
  return (
    <div style={{ width: 390, height: 844, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function Chip({ t, label, active }) {
  return (
    <span style={{
      fontFamily: t.bodyFont, fontSize: 13, fontWeight: active ? 700 : 500,
      padding: "9px 16px", whiteSpace: "nowrap",
      borderRadius: t.btnRadius >= 99 ? 999 : t.cardRadius * 0.5,
      border: `${t.outline ? 1.5 : 1}px solid ${active ? (t.outline ? t.fg : "transparent") : t.rule}`,
      background: active ? t.chipBg : "transparent",
      color: active ? t.chipFg : t.muted,
      letterSpacing: t.upper ? "0.08em" : 0,
      textTransform: t.upper ? "uppercase" : "none",
    }}>{label}</span>
  );
}

function PrimaryBtn({ t, children, flex }) {
  return (
    <button style={{
      flex: flex ? 1 : "none", fontFamily: t.bodyFont, fontSize: 15, fontWeight: 700,
      background: t.accent, color: t.accentFg, border: t.outline ? `2px solid ${t.fg}` : "none",
      borderRadius: t.btnRadius, padding: "15px 22px", cursor: "pointer",
      letterSpacing: t.upper ? "0.08em" : 0, textTransform: t.upper ? "uppercase" : "none",
      boxShadow: t.hardShadow ? `3px 3px 0 ${t.fg}` : "none",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>{children}</button>
  );
}

function GhostBtn({ t, children, flex }) {
  return (
    <button style={{
      flex: flex ? 1 : "none", fontFamily: t.bodyFont, fontSize: 15, fontWeight: 700,
      background: t.ghostBg || "transparent", color: t.fg,
      border: `${t.outline ? 2 : 1.5}px solid ${t.ghostBg ? "transparent" : t.fg}`,
      borderRadius: t.btnRadius, padding: "15px 22px", cursor: "pointer",
      letterSpacing: t.upper ? "0.08em" : 0, textTransform: t.upper ? "uppercase" : "none",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>{children}</button>
  );
}

/* ---------------- HOME ---------------- */

function AppHome({ t }) {
  const Head = ({ children, style }) => (
    <span style={{ fontFamily: t.displayFont, ...style }}>{children}</span>
  );
  return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, color: t.fg, overflow: "hidden" }}>
        <StatusBar color={t.fg}></StatusBar>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "6px 22px 0" }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: t.bodyFont, fontSize: 12.5, fontWeight: 600, color: t.muted, letterSpacing: t.upper ? "0.16em" : "0.02em", textTransform: t.upper ? "uppercase" : "none", marginBottom: 6 }}>{t.dateStr}</div>
              <Head style={{ fontSize: t.greetingSize, lineHeight: 1.05, letterSpacing: t.headTrack, textTransform: t.lowerHead ? "lowercase" : "none", display: "block", maxWidth: 240 }}>{t.greeting}</Head>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: t.btnRadius >= 99 ? "50%" : 12, background: t.chipBg, border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: t.displayFont, fontSize: 17, color: t.fg }}>M</span>
            </div>
          </div>

          {/* weather pill */}
          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: t.weatherBg, color: t.weatherFg, marginBottom: 18 }}>
            <UIcon name={t.weatherIcon} size={17} color={t.weatherFg} stroke={2}></UIcon>
            <span style={{ fontFamily: t.bodyFont, fontSize: 13, fontWeight: 600, letterSpacing: t.upper ? "0.06em" : 0 }}>{t.weather}</span>
          </div>

          {/* outfit card */}
          <div style={{ background: t.cardBg, borderRadius: t.cardRadius, border: `${t.outline ? 2 : 1}px solid ${t.outline ? t.fg : t.rule}`, padding: "18px 18px 20px", boxShadow: t.cardShadow, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: t.bodyFont, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: t.muted }}>Today's pick</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: t.bodyFont, fontSize: 12.5, fontWeight: 700, color: t.accent }}>
                <UIcon name="star" size={14} color={t.accent} stroke={2}></UIcon>{t.match}% match
              </span>
            </div>
            <Head style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: t.headTrack, textTransform: t.lowerHead ? "lowercase" : "none", marginBottom: 14, display: "block" }}>{t.outfitName}</Head>

            {/* garment grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, minHeight: 0 }}>
              {t.items.map((it, i) => (
                <div key={i} style={{ background: t.tileBg, borderRadius: t.cardRadius * 0.7, border: `1px solid ${t.rule}`, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 8px 10px", minHeight: 0 }}>
                  <Garment type={it.type} color={it.color} size={66}></Garment>
                  <span style={{ fontFamily: t.bodyFont, fontSize: 11.5, fontWeight: 600, color: t.muted, marginTop: 2 }}>{it.label}</span>
                  {i === 0 ? <span style={{ position: "absolute", top: 8, left: 8, fontFamily: t.bodyFont, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.accent, background: t.weatherBg, padding: "3px 7px", borderRadius: 999 }}>Hero</span> : null}
                </div>
              ))}
            </div>

            {/* why */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 14 }}>
              <UIcon name="bolt" size={15} color={t.accent} stroke={2}></UIcon>
              <span style={{ fontFamily: t.bodyFont, fontSize: 12.5, lineHeight: 1.45, color: t.muted }}>{t.why}</span>
            </div>
          </div>

          {/* buttons */}
          <div style={{ display: "flex", gap: 10, padding: "16px 0 14px" }}>
            <PrimaryBtn t={t} flex>{t.ctaPrimary}</PrimaryBtn>
            <GhostBtn t={t}><UIcon name="shuffle" size={18} color={t.fg} stroke={2}></UIcon>{t.ctaSecondary}</GhostBtn>
          </div>
        </div>
        <BottomNav t={t}></BottomNav>
      </div>
    </Phone>
  );
}

/* ---------------- CLOSET ---------------- */

function AppCloset({ t }) {
  return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, color: t.fg, overflow: "hidden" }}>
        <StatusBar color={t.fg}></StatusBar>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "6px 22px 0" }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: t.displayFont, fontSize: 30, letterSpacing: t.headTrack, textTransform: t.lowerHead ? "lowercase" : "none" }}>{t.closetTitle}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: t.btnRadius >= 99 ? "50%" : 12, border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", background: t.chipBg }}><UIcon name="search" size={19} color={t.fg}></UIcon></div>
              <div style={{ width: 42, height: 42, borderRadius: t.btnRadius >= 99 ? "50%" : 12, border: `1px solid ${t.rule}`, display: "grid", placeItems: "center", background: t.chipBg }}><UIcon name="sliders" size={19} color={t.fg}></UIcon></div>
            </div>
          </div>

          {/* filter chips */}
          <div style={{ display: "flex", gap: 8, overflow: "hidden", marginBottom: 16, flexShrink: 0 }}>
            {["All", "Tops", "Bottoms", "Shoes"].map((c, i) => <Chip key={c} t={t} label={c} active={i === 0}></Chip>)}
          </div>

          {/* selection banner */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: t.weatherBg, color: t.weatherFg, borderRadius: t.cardRadius * 0.7, padding: "12px 16px", marginBottom: 14, flexShrink: 0 }}>
            <span style={{ fontFamily: t.bodyFont, fontSize: 13, fontWeight: 700 }}>{t.matchHint}</span>
            <span style={{ fontFamily: t.bodyFont, fontSize: 12, fontWeight: 600, opacity: 0.8 }}>3 picked</span>
          </div>

          {/* garment grid */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {t.closet.map((it, i) => (
                <div key={i} style={{ background: t.tileBg, borderRadius: t.cardRadius * 0.6, border: `${it.sel ? 2 : 1}px solid ${it.sel ? t.accent : t.rule}`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 104 }}>
                  <Garment type={it.type} color={it.color} size={58}></Garment>
                  {it.sel ? (
                    <span style={{ position: "absolute", top: 7, right: 7, width: 22, height: 22, borderRadius: "50%", background: t.accent, color: t.accentFg, display: "grid", placeItems: "center" }}>
                      <UIcon name="check" size={13} color={t.accentFg} stroke={2.6}></UIcon>
                    </span>
                  ) : null}
                  {it.match ? <span style={{ position: "absolute", bottom: 7, left: 7, fontFamily: t.bodyFont, fontSize: 9.5, fontWeight: 700, color: t.accent, background: t.weatherBg, padding: "2px 6px", borderRadius: 999 }}>{it.match}%</span> : null}
                </div>
              ))}
            </div>
          </div>

          {/* build button */}
          <div style={{ padding: "14px 0" }}>
            <PrimaryBtn t={t} flex><UIcon name="bolt" size={18} color={t.accentFg} stroke={2.2}></UIcon>{t.closetCta}</PrimaryBtn>
          </div>
        </div>
        <BottomNav t={t}></BottomNav>
      </div>
    </Phone>
  );
}

Object.assign(window, { AppHome, AppCloset });
