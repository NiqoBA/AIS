import Link from "next/link";
import { notFound } from "next/navigation";

import { getInformeJugadorDemo } from "@/components/dashboard/jugadorInformeDemo";
import { JUGADORES_MAPA_DEMO } from "@/components/dashboard/jugadoresMapaData";
import { resolveClubNameFromSlug } from "@/lib/dashboard/clubSlug";
import { hrefPartidoDemo, PARTIDO_LINK_CLASS } from "@/lib/dashboard/partidoLink";
import {
  fetchClubPotentialPlayers,
  fetchDistinctClubNames,
  fetchMatchesForClubWithAi,
} from "@/lib/dashboard/queries";

const card =
  "rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]";

export default async function ClubProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const demoClubNames = [...new Set(JUGADORES_MAPA_DEMO.map((j) => j.club))];
  let dbClubNames: string[] = [];
  try {
    dbClubNames = await fetchDistinctClubNames();
  } catch {
    dbClubNames = [];
  }
  const mergedNames = [...new Set([...demoClubNames, ...dbClubNames])];
  const clubName = resolveClubNameFromSlug(slug, mergedNames);
  if (!clubName) notFound();

  const dbPlayers = await fetchClubPotentialPlayers(clubName);
  const dbMatches = await fetchMatchesForClubWithAi(clubName);

  const demoJugadores = JUGADORES_MAPA_DEMO.filter((j) => j.club === clubName);

  type DemoMatch = {
    id: string;
    fecha: string;
    rival: string;
    resultado: string;
    resumenIa: string;
    destacadosDemo: string[];
  };
  const demoByPartido = new Map<string, DemoMatch>();
  for (const j of demoJugadores) {
    const inf = getInformeJugadorDemo(j);
    for (const p of inf.partidos) {
      const prev = demoByPartido.get(p.id);
      const linea = `${j.nombre} (${p.ratingPartido.toFixed(1)})`;
      if (!prev) {
        demoByPartido.set(p.id, {
          id: p.id,
          fecha: p.fecha,
          rival: p.rival,
          resultado: p.resultado,
          resumenIa: `Análisis demo AIS: encuentro ${p.competicion}. ${j.nombre} sumó ${p.minutos} min, ${p.goles} gol(es), precisión de pases ${p.pasesCompletados}/${p.pasesIntentados}. Resultado ${p.resultado} frente a ${p.rival}.`,
          destacadosDemo: [linea],
        });
      } else {
        prev.destacadosDemo.push(linea);
      }
    }
  }
  const demoMatches = [...demoByPartido.values()].sort((a, b) =>
    b.fecha.localeCompare(a.fecha),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/dashboard?tab=clubes"
          className="text-sm font-medium text-black/55 underline decoration-black/15 underline-offset-4 hover:text-[#111111]"
        >
          ← Clubes
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#141414] sm:text-3xl">
          {clubName}
        </h1>
        <p className="mt-2 text-sm text-black/55">
          Perfil de jugadores con potencial y partidos analizados donde participó el
          plantel registrado en AIS.
        </p>
      </div>

      <section className={card}>
        <h2 className="text-sm font-semibold text-[#111111]">
          Jugadores potenciales
        </h2>
        <p className="mt-1 text-xs text-black/45">
          Detectados en la base con análisis AIS (y radar demo si aplica).
        </p>
        {dbPlayers.length > 0 ? (
          <ul className="mt-4 divide-y divide-black/[0.06]">
            {dbPlayers.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
              >
                <div>
                  <Link
                    href={`/dashboard/jugadores/${p.id}`}
                    className={`font-medium ${PARTIDO_LINK_CLASS}`}
                  >
                    {p.full_name}
                  </Link>
                  <p className="text-xs text-black/45">
                    {p.position ?? "—"} · {p.analysisCount} análisis · prom.{" "}
                    {p.avgPotential.toFixed(1)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {demoJugadores.length > 0 ? (
          <div className={dbPlayers.length > 0 ? "mt-6 border-t border-black/[0.06] pt-6" : "mt-4"}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Radar interior (demo)
            </h3>
            <ul className="mt-3 space-y-2">
              {demoJugadores.map((j) => (
                <li
                  key={j.id}
                  className="rounded-xl border border-black/[0.06] bg-[#f8fafc] px-3 py-2 text-sm"
                >
                  <span className="font-medium text-[#111111]">{j.nombre}</span>
                  <span className="text-black/45"> · {j.posicion} · rating {j.rating}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {dbPlayers.length === 0 && demoJugadores.length === 0 ? (
          <p className="mt-4 text-sm text-black/45">Sin jugadores para este club.</p>
        ) : null}
      </section>

      {dbMatches.length > 0 ? (
        <section id="partidos" className={card}>
          <h2 className="text-sm font-semibold text-[#111111]">
            Partidos analizados (AIS)
          </h2>
          <ul className="mt-4 space-y-5">
            {dbMatches.map((m) => (
              <li
                key={m.matchId}
                className="rounded-xl border border-black/[0.06] bg-[#fafbfc] p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={hrefPartidoDemo(m.matchId)}
                    className={`text-base font-semibold ${PARTIDO_LINK_CLASS}`}
                  >
                    {m.title}
                  </Link>
                  <span className="text-xs text-black/45">
                    {m.played_at
                      ? new Date(m.played_at).toLocaleDateString("es-UY")
                      : "—"}
                    {m.city ? ` · ${m.city}` : ""}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{m.aiSummary}</p>
                <div className="mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
                    Jugadores destacados (tu club)
                  </p>
                  <ul className="mt-2 space-y-2">
                    {m.standouts.map((s) => (
                      <li key={s.playerId} className="text-sm">
                        <Link
                          href={`/dashboard/jugadores/${s.playerId}`}
                          className={`font-medium ${PARTIDO_LINK_CLASS}`}
                        >
                          {s.name}
                        </Link>
                        {s.summary ? (
                          <p className="mt-0.5 text-xs text-black/55">{s.summary}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {demoMatches.length > 0 ? (
        <section
          id={dbMatches.length === 0 ? "partidos" : undefined}
          className={dbMatches.length > 0 ? `${card} border-t-4 border-dashed border-black/[0.08]` : card}
        >
          <h2 className="text-sm font-semibold text-[#111111]">
            Partidos analizados (demo radar)
          </h2>
          <p className="mt-1 text-xs text-black/45">
            {dbMatches.length > 0
              ? "Complemento de ejemplo del radar interior (no sustituye AIS)."
              : "Datos de ejemplo hasta conectar más encuentros reales en AIS."}
          </p>
          <ul className="mt-4 space-y-5">
            {demoMatches.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-black/[0.06] bg-[#fafbfc] p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={hrefPartidoDemo(m.id)}
                    className={`text-base font-semibold ${PARTIDO_LINK_CLASS}`}
                  >
                    vs {m.rival}
                  </Link>
                  <span className="text-xs tabular-nums text-black/45">{m.fecha}</span>
                </div>
                <p className="mt-1 text-xs text-black/45">Resultado {m.resultado}</p>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{m.resumenIa}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-black/45">
                  Destacados (demo)
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-black/65">
                  {m.destacadosDemo.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dbMatches.length === 0 && demoMatches.length === 0 ? (
        <section className={card}>
          <p className="text-sm text-black/55">
            Aún no hay partidos analizados vinculados a jugadores de este club en AIS.
          </p>
        </section>
      ) : null}
    </div>
  );
}
