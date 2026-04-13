/** Color por posición: lista, mapa y leyenda usan la misma paleta. */
export const POSICION_COLORS: Record<string, string> = {
  Delantero: "#e11d48",
  Mediocampista: "#d97706",
  Defensor: "#2563eb",
  Arquero: "#0891b2",
  Lateral: "#7c3aed",
};

export function colorForPosicion(posicion: string): string {
  return POSICION_COLORS[posicion] ?? "#64748b";
}

export const POSICIONES_ORDEN = [
  "Delantero",
  "Mediocampista",
  "Defensor",
  "Arquero",
  "Lateral",
] as const;
