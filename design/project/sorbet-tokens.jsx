// sorbet-tokens.jsx — FITTED "Sorbet" design tokens. Exports: SB (to window)
const SB = {
  // core
  petal: "#FFF6FB", white: "#FFFFFF", plum: "#311938", ink: "#311938",
  punch: "#FF4D8D", grape: "#7A4DFF", mint: "#3FD9B0", lemon: "#FFD23F",
  muted: "#A07FA0", rule: "#F3DCE9", line: "#EAD9E6",
  // soft tints (surfaces / fills)
  punchSoft: "#FFE3EE", grapeSoft: "#ECE5FF", mintSoft: "#DEF7EF", lemonSoft: "#FFF1C9", petalDeep: "#FCE7F1",
  // type
  display: "'Gabarito', sans-serif", body: "'Hanken Grotesk', sans-serif",
  // radii
  rCard: 24, rTile: 18, rPill: 999, rField: 16, rChip: 999,
  // shadow
  shadow: "0 14px 34px rgba(122,77,255,.14)",
  shadowSm: "0 6px 16px rgba(122,77,255,.12)",
};
window.SB = SB;
