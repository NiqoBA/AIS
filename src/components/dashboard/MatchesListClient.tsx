"use client";

import Link from "next/link";

import type { ClubMatchWithAi } from "@/lib/dashboard/queries";
import { hrefPartidoDemo, PARTIDO_LINK_CLASS } from "@/lib/dashboard/partidoLink";

export type MatchesListClientProps = {
  matches: ClubMatchWithAi[];
};

/** Listado de partidos con resumen AIS (cliente: enlaces y layout). */
export function MatchesListClient({ matches }: MatchesListClientProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.12] bg-white px-6 py-12 text-center text-sm text-black/45">
        No hay partidos con análisis AIS cargados todavía.
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {matches.map((m) => (
        <li
          key={m.matchId}
          className="rounded-xl border border-black/[0.06] bg-[#fafbfc] p-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.08)]"
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
              Jugadores destacados
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
  );
}

export default MatchesListClient;
