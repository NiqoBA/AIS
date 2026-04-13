import type { CSSProperties } from "react";

function hashSeed(s: string): number {
  let h = 0;
  const t = s.trim();
  for (let i = 0; i < t.length; i++) {
    h = (Math.imul(31, h) + t.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Fondo sólido determinista donde iría la foto del escudo (datos demo). */
export function clubPlaceholderStyle(seed: string): CSSProperties {
  const hue = hashSeed(seed) % 360;
  const sat = 36 + (hashSeed(`${seed}s`) % 20);
  const light = 34 + (hashSeed(`${seed}l`) % 14);
  return {
    backgroundColor: `hsl(${hue} ${sat}% ${light}%)`,
  };
}

export function clubInitialLetter(seed: string): string {
  const c = seed.trim().charAt(0);
  return c ? c.toUpperCase() : "?";
}
