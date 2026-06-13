// app-icons.jsx — flat garment + UI icons for FITTED app screens
// Exports: Garment, UIcon (to window)

function Garment({ type, color = "#C9C0AE", stroke = "rgba(0,0,0,0.22)", size = 64 }) {
  const paths = {
    tee: "M21 9 L12 17 L7 24 L14 31 L21 26 L21 54 Q21 56 23 56 L41 56 Q43 56 43 54 L43 26 L50 31 L57 24 L52 17 L43 9 L39 9 Q32 17 25 9 Z",
    jacket: "M21 9 L12 17 L7 24 L14 31 L20 27 L20 54 Q20 56 22 56 L42 56 Q44 56 44 54 L44 27 L50 31 L57 24 L52 17 L43 9 L39 9 Q32 17 25 9 Z",
    coat: "M21 8 L12 16 L7 23 L13 30 L19 26 L19 57 Q19 59 21 59 L43 59 Q45 59 45 57 L45 26 L51 30 L57 23 L52 16 L43 8 L39 8 Q32 16 25 8 Z",
    pants: "M22 8 H42 L44 57 H34 L32 27 L30 57 H20 Z",
    dress: "M23 9 L15 21 L21 27 L23 23 L17 53 Q17 56 20 56 L44 56 Q47 56 47 53 L41 23 L43 27 L49 21 L41 9 L38 9 Q32 16 26 9 Z",
    skirt: "M19 21 H45 L51 53 Q51 56 48 56 L16 56 Q13 56 13 53 Z M19 21 L18 14 H46 L45 21 Z",
    sweater: "M21 10 L11 18 L6 26 L13 33 L21 28 L21 53 Q21 56 24 56 L40 56 Q43 56 43 53 L43 28 L51 33 L58 26 L53 18 L43 10 L39 10 Q32 17 25 10 Z",
    shoe: "M7 41 Q7 34 16 34 L29 34 L41 42 L53 44 Q58 45 58 50 L58 53 Q58 55 56 55 L9 55 Q7 55 7 53 Z",
    tote: "M23 25 Q23 16 32 16 Q41 16 41 25 M15 25 H49 L47 55 Q47 57 45 57 L19 57 Q17 57 17 55 Z",
    hat: "M14 44 Q14 30 32 30 Q50 30 50 44 M8 44 H56 Q56 49 32 49 Q8 49 8 44 Z",
  };
  const showLine = type === "jacket" || type === "coat";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d={paths[type] || paths.tee} fill={color} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"></path>
      {showLine ? <line x1="32" y1="14" x2="32" y2="55" stroke={stroke} strokeWidth="1.5"></line> : null}
    </svg>
  );
}

function UIcon({ name, size = 22, color = "currentColor", stroke = 1.8 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const map = {
    sun: <g><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"></path></g>,
    hanger: <g><path d="M12 6a2 2 0 1 1 1.4 3.4c-.9.6-1.4 1-1.4 1.8"></path><path d="M12 11 4 17h16l-8-6"></path></g>,
    plus: <g><path d="M12 5v14M5 12h14"></path></g>,
    heart: <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"></path>,
    user: <g><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"></path></g>,
    search: <g><circle cx="11" cy="11" r="6"></circle><path d="M20 20l-3.5-3.5"></path></g>,
    sliders: <g><path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle></g>,
    check: <path d="M5 12l4 4 10-10"></path>,
    shuffle: <g><path d="M3 7h4l10 10h4M3 17h4l3-3M14 7h3M17 4l3 3-3 3M17 14l3 3-3 3"></path></g>,
    bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"></path>,
    cloud: <path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 18 18H7z"></path>,
    star: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z"></path>,
    arrowR: <path d="M5 12h14M13 6l6 6-6 6"></path>,
  };
  return <svg {...common} aria-hidden="true">{map[name] || map.sun}</svg>;
}

Object.assign(window, { Garment, UIcon });
