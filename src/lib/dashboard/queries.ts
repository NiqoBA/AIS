import { createClient } from "@/lib/supabase/server";

type ClubRow = { name: string; club_type: string };

export type PlayerWithAnalyses = {
  id: string;
  full_name: string;
  position: string | null;
  birth_date: string | null;
  dominant_foot: string | null;
  /** Supabase puede devolver el join como objeto o array de 1 elemento. */
  clubs: ClubRow | ClubRow[] | null;
  player_analyses: { potential_score: string | number | null }[] | null;
};

export function clubOne(
  c: PlayerWithAnalyses["clubs"],
): ClubRow | null {
  if (!c) return null;
  return Array.isArray(c) ? c[0] ?? null : c;
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function toNum(v: string | number | null | undefined) {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
}

export function summarizePlayer(p: PlayerWithAnalyses) {
  const scores =
    p.player_analyses
      ?.map((x) => toNum(x.potential_score))
      .filter((n): n is number => n !== null) ?? [];
  const avgScore = avg(scores);
  return {
    ...p,
    clubs: clubOne(p.clubs),
    analysisCount: scores.length,
    avgPotential: avgScore,
  };
}

export async function fetchPlayersRaw(): Promise<PlayerWithAnalyses[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("players").select(`
      id,
      full_name,
      position,
      birth_date,
      dominant_foot,
      clubs ( name, club_type ),
      player_analyses ( potential_score )
    `);
  if (error) throw error;
  return (data ?? []) as unknown as PlayerWithAnalyses[];
}

export async function fetchPlayerDetail(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select(
      `
      id,
      full_name,
      position,
      birth_date,
      dominant_foot,
      clubs ( name, city, club_type ),
      player_analyses (
        id,
        potential_score,
        model_name,
        summary,
        technical_notes,
        tactical_notes,
        physical_notes,
        created_at,
        clips (
          id,
          created_at,
          matches ( id, title, played_at, city )
        )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type ClubPotentialPlayer = {
  id: string;
  full_name: string;
  position: string | null;
  avgPotential: number;
  analysisCount: number;
};

export async function fetchClubPotentialPlayers(
  clubName: string,
): Promise<ClubPotentialPlayer[]> {
  try {
    const rows = await fetchPlayersRaw();
    return rows
      .filter((p) => clubOne(p.clubs)?.name === clubName)
      .map(summarizePlayer)
      .filter((p) => p.analysisCount >= 1)
      .map((p) => ({
        id: p.id,
        full_name: p.full_name,
        position: p.position,
        avgPotential: p.avgPotential,
        analysisCount: p.analysisCount,
      }))
      .sort((a, b) => b.avgPotential - a.avgPotential);
  } catch {
    return [];
  }
}

type AnalysisWithMatch = {
  id: string;
  summary: string | null;
  potential_score: string | number | null;
  player_id: string;
  players: { id: string; full_name: string } | null;
  clips:
    | {
        matches: {
          id: string;
          title: string;
          played_at: string | null;
          city: string | null;
        } | null;
      }
    | {
        matches: {
          id: string;
          title: string;
          played_at: string | null;
          city: string | null;
        } | null;
      }[]
    | null;
};

export type ClubMatchWithAi = {
  matchId: string;
  title: string;
  played_at: string | null;
  city: string | null;
  aiSummary: string;
  standouts: { playerId: string; name: string; summary: string | null }[];
};

function aggregatedMatchesFromAnalysisRows(
  rows: AnalysisWithMatch[],
  context: "club" | "all",
): ClubMatchWithAi[] {
  const byMatch = new Map<
    string,
    {
      meta: {
        title: string;
        played_at: string | null;
        city: string | null;
      };
      analyses: AnalysisWithMatch[];
    }
  >();

  for (const row of rows) {
    const rawC = row.clips;
    const clip = Array.isArray(rawC) ? rawC[0] : rawC;
    const m = clip?.matches;
    if (!m?.id) continue;
    const prev = byMatch.get(m.id);
    if (!prev) {
      byMatch.set(m.id, {
        meta: {
          title: m.title,
          played_at: m.played_at,
          city: m.city,
        },
        analyses: [row],
      });
    } else {
      prev.analyses.push(row);
    }
  }

  const out: ClubMatchWithAi[] = [];
  for (const [matchId, { meta, analyses }] of byMatch) {
    const seen = new Set<string>();
    const standouts: ClubMatchWithAi["standouts"] = [];
    for (const a of analyses) {
      const pid = a.player_id;
      if (seen.has(pid)) continue;
      seen.add(pid);
      standouts.push({
        playerId: pid,
        name: a.players?.full_name ?? "Jugador",
        summary: a.summary,
      });
    }

    const summaries = analyses
      .map((a) => a.summary?.trim())
      .filter((s): s is string => Boolean(s));
    const uniqueSummaries = [...new Set(summaries)];
    const names = standouts.map((s) => s.name);
    let aiSummary = "";
    const destacadosLabel =
      context === "club" ? "Destacados del club en AIS" : "Destacados en AIS";
    if (uniqueSummaries.length > 0) {
      const bloque = uniqueSummaries.slice(0, 4).join(" ");
      aiSummary = names.length
        ? `${bloque} ${destacadosLabel}: ${names.join(", ")}.`
        : bloque;
    } else if (names.length > 0) {
      const jugadoresLabel =
        context === "club"
          ? "Jugadores del club con análisis"
          : "Jugadores con análisis";
      aiSummary = `Encuentro «${meta.title}» con seguimiento AIS. ${jugadoresLabel}: ${names.join(", ")}.`;
    } else {
      aiSummary =
        "Resumen de IA pendiente para este encuentro (sin notas cargadas aún).";
    }

    out.push({
      matchId,
      title: meta.title,
      played_at: meta.played_at,
      city: meta.city,
      aiSummary,
      standouts,
    });
  }

  out.sort((a, b) => {
    const ta = a.played_at ? new Date(a.played_at).getTime() : 0;
    const tb = b.played_at ? new Date(b.played_at).getTime() : 0;
    return tb - ta;
  });

  return out;
}

export async function fetchMatchesForClubWithAi(
  clubName: string,
): Promise<ClubMatchWithAi[]> {
  let playerIds: string[] = [];
  try {
    const rows = await fetchPlayersRaw();
    playerIds = rows
      .filter((p) => clubOne(p.clubs)?.name === clubName)
      .map((p) => p.id);
  } catch {
    return [];
  }
  if (playerIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_analyses")
    .select(
      `
      id,
      summary,
      potential_score,
      player_id,
      players ( id, full_name ),
      clips (
        matches ( id, title, played_at, city )
      )
    `,
    )
    .in("player_id", playerIds);

  if (error) return [];

  return aggregatedMatchesFromAnalysisRows(
    (data ?? []) as unknown as AnalysisWithMatch[],
    "club",
  );
}

/** Todos los partidos con análisis AIS enlazados (vista global). */
export async function fetchAllMatchesWithAi(): Promise<ClubMatchWithAi[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("player_analyses").select(
    `
      id,
      summary,
      potential_score,
      player_id,
      players ( id, full_name ),
      clips (
        matches ( id, title, played_at, city )
      )
    `,
  );

  if (error) return [];

  return aggregatedMatchesFromAnalysisRows(
    (data ?? []) as unknown as AnalysisWithMatch[],
    "all",
  );
}

/** Nombres de club presentes en jugadores amateur (BD). */
export async function fetchDistinctClubNames(): Promise<string[]> {
  try {
    const rows = await fetchPlayersRaw();
    const names = new Set<string>();
    for (const p of rows) {
      const n = clubOne(p.clubs)?.name;
      if (n && (clubOne(p.clubs)?.club_type ?? "amateur") === "amateur") {
        names.add(n);
      }
    }
    return [...names].sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" }),
    );
  } catch {
    return [];
  }
}
