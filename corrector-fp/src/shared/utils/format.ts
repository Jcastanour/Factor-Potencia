export function fmtCOP(value: number): string {
  const v = Math.max(0, Math.round(value));
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);
}

export function fmtKw(watts: number): string {
  return `${(watts / 1000).toFixed(1)} kW`;
}

export function fmtFp(fp: number): string {
  return fp.toFixed(2);
}
