function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h / 4294967296;
}

/** Scores 1–10 from potential average; variación determinística ±~15%. */
export function radarFromAvg(avgPotential: number, playerId: string) {
  const base = clamp(avgPotential / 10, 1, 10);
  const h = hash(playerId);
  const h2 = hash(playerId + ":t");
  const h3 = hash(playerId + ":p");
  return {
    tecnica: round1(clamp(base * (0.92 + 0.12 * h), 1, 10)),
    tactica: round1(clamp(base * (0.9 + 0.12 * (h2 % 1)), 1, 10)),
    fisico: round1(clamp(base * (0.93 + 0.1 * (h3 % 1)), 1, 10)),
  };
}
