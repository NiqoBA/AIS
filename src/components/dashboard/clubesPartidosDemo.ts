import { getInformeJugadorDemo } from "@/components/dashboard/jugadorInformeDemo";
import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";
import { JUGADORES_MAPA_DEMO } from "@/components/dashboard/jugadoresMapaData";

export type DestacadoPartido = {
  jugadorId: number;
  nombre: string;
  club: string;
  posicion: string;
  score100: number;
};

export type PartidoClubAgregado = {
  /** Clave estable dentro del club */
  key: string;
  fecha: string;
  resultado: string;
  clubLocal: string;
  clubRival: string;
  destacados: DestacadoPartido[];
};

function partidoKey(fecha: string, rival: string) {
  return `${fecha}::${rival}`;
}

/**
 * Agrupa partidos demo de todos los jugadores del club (misma fecha + rival → un encuentro).
 * Destacados: jugadores del radar en ese club con rating de partido ≥ 7 o mejores del grupo.
 */
export function getPartidosAgregadosPorClub(
  clubName: string,
  jugadoresClub: JugadorMapa[],
): PartidoClubAgregado[] {
  if (jugadoresClub.length === 0) return [];

  const byMatch = new Map<
    string,
    {
      fecha: string;
      resultado: string;
      rival: string;
      ratings: Map<number, number>;
    }
  >();

  for (const j of jugadoresClub) {
    const inf = getInformeJugadorDemo(j);
    for (const p of inf.partidos) {
      const k = partidoKey(p.fecha, p.rival);
      const prev = byMatch.get(k);
      if (!prev) {
        const ratings = new Map<number, number>();
        ratings.set(j.id, p.ratingPartido);
        byMatch.set(k, {
          fecha: p.fecha,
          resultado: p.resultado,
          rival: p.rival,
          ratings,
        });
      } else {
        const r = prev.ratings.get(j.id);
        if (r === undefined || p.ratingPartido > r) {
          prev.ratings.set(j.id, p.ratingPartido);
        }
      }
    }
  }

  const out: PartidoClubAgregado[] = [];
  for (const [, v] of byMatch) {
    const jugadoresIds = [...v.ratings.keys()];
    const base: DestacadoPartido[] = jugadoresIds
      .map((id) => {
        const jug = jugadoresClub.find((x) => x.id === id);
        if (!jug) return null;
        const rp = v.ratings.get(id) ?? 0;
        return {
          jugadorId: jug.id,
          nombre: jug.nombre,
          club: jug.club,
          posicion: jug.posicion,
          score100: Math.round(rp * 10),
        };
      })
      .filter((x): x is DestacadoPartido => x !== null)
      .sort((a, b) => b.score100 - a.score100);

    const conUmbral = base.filter((d) => d.score100 >= 70);
    const pick = (conUmbral.length > 0 ? conUmbral : base).slice(0, 6);
    const extras = destacadosRivalClub(v.rival);
    const merged = mergeDestacados(pick, extras);

    out.push({
      key: partidoKey(v.fecha, v.rival),
      fecha: v.fecha,
      resultado: v.resultado,
      clubLocal: clubName,
      clubRival: v.rival,
      destacados: merged,
    });
  }

  out.sort((a, b) => b.fecha.localeCompare(a.fecha));
  return out;
}

/** Jugadores del sistema en el club rival cuando el nombre coincide con un club del radar. */
function destacadosRivalClub(rivalNombre: string): DestacadoPartido[] {
  const rivNorm = rivalNombre.toLowerCase();
  const fromDemo = JUGADORES_MAPA_DEMO.filter((j) => {
    const cn = j.club.toLowerCase();
    return cn === rivNorm || cn.includes(rivNorm) || rivNorm.includes(cn);
  });
  if (fromDemo.length === 0) return [];
  return fromDemo
    .filter((j) => j.rating >= 7.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map((j) => ({
      jugadorId: j.id,
      nombre: j.nombre,
      club: j.club,
      posicion: j.posicion,
      score100: Math.round(j.rating * 10),
    }));
}

function mergeDestacados(
  a: DestacadoPartido[],
  b: DestacadoPartido[],
): DestacadoPartido[] {
  const seen = new Set<number>();
  const out: DestacadoPartido[] = [];
  for (const x of [...a, ...b]) {
    if (seen.has(x.jugadorId)) continue;
    seen.add(x.jugadorId);
    out.push(x);
  }
  return out.slice(0, 8);
}

/** Lista de partidos demo de un jugador (mismo formato que agregado por club). */
export function getPartidosAgregadosPorJugador(
  jugador: JugadorMapa,
): PartidoClubAgregado[] {
  const inf = getInformeJugadorDemo(jugador);
  const destacadoSelf = (ratingPartido: number): DestacadoPartido => ({
    jugadorId: jugador.id,
    nombre: jugador.nombre,
    club: jugador.club,
    posicion: jugador.posicion,
    score100: Math.round(ratingPartido * 10),
  });

  return [...inf.partidos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((p) => ({
      key: p.id,
      fecha: p.fecha,
      resultado: p.resultado,
      clubLocal: jugador.club,
      clubRival: p.rival,
      destacados: [destacadoSelf(p.ratingPartido)],
    }));
}
