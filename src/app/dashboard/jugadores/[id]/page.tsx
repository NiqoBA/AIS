import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayerRadarChart } from "@/components/dashboard/PlayerRadarChart";
import { ageFromBirthDate } from "@/lib/dashboard/age";
import { hrefPartidoDemo, PARTIDO_LINK_CLASS } from "@/lib/dashboard/partidoLink";
import { radarFromAvg } from "@/lib/dashboard/radar";
import { fetchPlayerDetail } from "@/lib/dashboard/queries";

type ClipNested = {
  id: string;
  created_at: string;
  matches: {
    id: string;
    title: string;
    played_at: string | null;
    city: string | null;
  } | null;
} | null;

type AnalysisRow = {
  id: string;
  potential_score: string | number | null;
  model_name: string | null;
  summary: string | null;
  technical_notes: string | null;
  tactical_notes: string | null;
  physical_notes: string | null;
  created_at: string;
  clips: ClipNested | ClipNested[];
};

const card =
  "rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]";

function clipOne(a: AnalysisRow): ClipNested {
  const c = a.clips;
  if (Array.isArray(c)) return c[0] ?? null;
  return c ?? null;
}

function toNum(v: string | number | null | undefined) {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
}

export default async function JugadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let player: Awaited<ReturnType<typeof fetchPlayerDetail>>;
  try {
    player = await fetchPlayerDetail(id);
  } catch {
    notFound();
  }

  if (!player) notFound();

  const analyses = [...((player.player_analyses ?? []) as AnalysisRow[])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const scores = analyses
    .map((a) => toNum(a.potential_score))
    .filter((n): n is number => n !== null);
  const avgPotential =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

  const radar = radarFromAvg(avgPotential, player.id);
  const latest = analyses[0];
  const age = ageFromBirthDate(player.birth_date);

  const rawClub = player.clubs as
    | { name: string; city: string | null }
    | { name: string; city: string | null }[]
    | null;
  const club = Array.isArray(rawClub) ? rawClub[0] ?? null : rawClub;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-black/55 underline decoration-black/15 underline-offset-4 hover:text-[#111111] hover:decoration-[#111111]"
        >
          ← Radar
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#141414]">
          {player.full_name}
        </h1>
        <p className="mt-2 text-sm text-black/55">
          {club?.name ?? "—"}
          {club?.city ? ` · ${club.city}` : ""} · {player.position ?? "—"} · pie{" "}
          {player.dominant_foot ?? "—"}
          {age !== null ? ` · ${age} años` : ""}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
            Potential score promedio
          </p>
          <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-[#111111]">
            {avgPotential.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-black/55">
            Detectado en{" "}
            <Link
              href={hrefPartidoDemo(`player-${player.id}-partidos`)}
              className={PARTIDO_LINK_CLASS}
            >
              {analyses.length} partido
              {analyses.length === 1 ? "" : "s"}
            </Link>{" "}
            analizado
            {analyses.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className={card}>
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
            Perfil (1–10)
          </p>
          <PlayerRadarChart
            tecnica={radar.tecnica}
            tactica={radar.tactica}
            fisico={radar.fisico}
          />
        </div>
      </div>

      <section className={card}>
        <h2 className="text-sm font-semibold text-[#111111]">Historial de análisis</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.08] text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                <th className="pb-2 pr-4">Partido</th>
                <th className="pb-2">Resumen</th>
              </tr>
            </thead>
            <tbody className="text-black/75">
              {analyses.map((a) => {
                const clip = clipOne(a);
                const m = clip?.matches;
                const when = m?.played_at
                  ? new Date(m.played_at).toLocaleDateString("es-UY")
                  : "—";
                const partidoId = m?.id ?? `analysis-${a.id}`;
                return (
                  <tr key={a.id} className="border-b border-black/[0.06]">
                    <td className="py-3 pr-4 align-top">
                      <Link
                        href={hrefPartidoDemo(partidoId)}
                        className={PARTIDO_LINK_CLASS}
                      >
                        {when}
                      </Link>
                    </td>
                    <td className="py-3 align-top text-[#111111]">{a.summary ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {latest ? (
        <section className={card}>
          <h2 className="text-sm font-semibold text-[#111111]">
            Notas del sistema (análisis más reciente)
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                Técnica
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-black/70">
                {latest.technical_notes ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                Táctica
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-black/70">
                {latest.tactical_notes ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                Físico
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-black/70">
                {latest.physical_notes ?? "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-black/45">
            Modelo: {latest.model_name ?? "AIS-v0.1-alpha"}
          </p>
        </section>
      ) : null}
    </div>
  );
}
