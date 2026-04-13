import { getInformeJugadorDemo } from "@/components/dashboard/jugadorInformeDemo";
import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";

export type ClubMapaStat = {
  nombre: string;
  recomendados: number;
  partidosJugados: number;
};

/** Agrega por club: jugadores con rating ≥ umbral como “recomendados” y suma de partidos analizados (demo). */
export function statsClubesDesdeJugadores(
  jugadores: JugadorMapa[],
  recomendadoMin = 8,
): ClubMapaStat[] {
  const map = new Map<string, { recomendados: number; partidos: number }>();
  for (const j of jugadores) {
    const row = map.get(j.club) ?? { recomendados: 0, partidos: 0 };
    if (j.rating >= recomendadoMin) row.recomendados += 1;
    row.partidos += getInformeJugadorDemo(j).partidosAnalizados;
    map.set(j.club, row);
  }
  return [...map.entries()]
    .map(([nombre, v]) => ({
      nombre,
      recomendados: v.recomendados,
      partidosJugados: v.partidos,
    }))
    .sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }),
    );
}
