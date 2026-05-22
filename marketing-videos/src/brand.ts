export const brand = {
  bg: "#0e0e0f",
  surface: "#161618",
  surface2: "#1e1e21",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",
  gold: "#c9a84c",
  goldLight: "#e8c97a",
  goldDim: "rgba(201,168,76,0.12)",
  text: "#f0ede6",
  muted: "#888580",
  muted2: "#555250",
  success: "#4caf7d",
  fontDisplay: "'Playfair Display', serif",
  fontBody: "'DM Sans', sans-serif",
} as const;

export const W = 1080;
export const H = 1920;
// TikTok safe zone: avoid top/bottom 15% = 288px
export const SAFE_TOP = 288;
export const SAFE_BOTTOM = H - 288;
