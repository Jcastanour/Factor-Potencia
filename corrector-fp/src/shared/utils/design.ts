export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
export function fmtCOP(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  return sign + abs.toLocaleString("es-CO") + " COP";
}
export function fpColor(fp: number) {
  if (fp < 0.8) return "var(--red)";
  if (fp < 0.9) return "var(--amber)";
  if (fp < 0.95) return "var(--blue)";
  return "var(--green)";
}
export function fpLabel(fp: number) {
  if (fp < 0.8) return "PESADO";
  if (fp < 0.9) return "INDUCTIVO";
  if (fp < 0.95) return "LÍMITE";
  return "CORREGIDO";
}
