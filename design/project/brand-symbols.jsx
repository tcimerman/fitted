// brand-symbols.jsx — FITTED brandmark symbol set. Exports: Sym (to window)
// Clean geometric marks, drawn in a 48×48 viewBox. stroke="round" by default.

function Sym({ name, color = "#fff", size = 48, stroke = 3 }) {
  const s = { width: size, height: size, viewBox: "0 0 48 48", fill: "none",
    stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const marks = {
    // classic clothes hanger
    hanger: (
      <g>
        <path d="M24 14c0-2.4 1.9-4.2 4.2-4.2 2.3 0 4 1.7 4 3.8 0 1.7-1.1 2.6-2.4 3.4-1.1.7-1.8 1.2-1.8 2.4v.8"></path>
        <path d="M28 20.6 11 32.4c-1.6 1.1-1 3.4.9 3.4h24.2c1.9 0 2.5-2.3.9-3.4L28 20.6z"></path>
      </g>
    ),
    // folded shirt / tee (fill-friendly outline)
    fold: (
      <g>
        <rect x="11" y="15" width="26" height="22" rx="3"></rect>
        <path d="M20 15l4 4 4-4"></path>
        <path d="M24 19v18"></path>
      </g>
    ),
    // bold check = the right fit, approved
    check: <path d="M12 25l7.5 7.5L36 15"></path>,
    // full-length mirror
    mirror: (
      <g>
        <ellipse cx="24" cy="21" rx="10" ry="13"></ellipse>
        <path d="M20 36h8M24 34v4"></path>
      </g>
    ),
    // sewing button
    button: (
      <g>
        <circle cx="24" cy="24" r="11"></circle>
        <circle cx="21" cy="21" r="1.4" fill={color} stroke="none"></circle>
        <circle cx="27" cy="21" r="1.4" fill={color} stroke="none"></circle>
        <circle cx="21" cy="27" r="1.4" fill={color} stroke="none"></circle>
        <circle cx="27" cy="27" r="1.4" fill={color} stroke="none"></circle>
      </g>
    ),
    // clothing / price tag
    tag: (
      <g>
        <path d="M14 13.5h11.2c.8 0 1.6.3 2.1.9l8 8a3 3 0 0 1 0 4.2l-7.6 7.6a3 3 0 0 1-4.2 0l-8-8a3 3 0 0 1-.9-2.1V15a1.5 1.5 0 0 1 1.4-1.5z"></path>
        <circle cx="20" cy="20" r="2.2"></circle>
      </g>
    ),
    // sun = dress for the weather
    sun: (
      <g>
        <circle cx="24" cy="24" r="6.5"></circle>
        <path d="M24 9v3.5M24 35.5V39M9 24h3.5M35.5 24H39M13.4 13.4l2.5 2.5M32.1 32.1l2.5 2.5M34.6 13.4l-2.5 2.5M15.9 32.1l-2.5 2.5"></path>
      </g>
    ),
    // needle + thread
    needle: (
      <g>
        <path d="M13 35 31 17"></path>
        <ellipse cx="32.5" cy="15.5" rx="2.2" ry="3.4" transform="rotate(45 32.5 15.5)"></ellipse>
        <path d="M31 14c5 1 6 5 2.5 8.5"></path>
      </g>
    ),
  };
  return <svg {...s} aria-hidden="true">{marks[name] || marks.hanger}</svg>;
}

window.Sym = Sym;
