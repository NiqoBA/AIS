"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getPartidosAgregadosPorClub,
} from "@/components/dashboard/clubesPartidosDemo";
import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";
import { JUGADORES_MAPA_DEMO } from "@/components/dashboard/jugadoresMapaData";
import type { ClubMapaStat } from "@/components/dashboard/clubesMapaStats";
import { JugadorTriadaTags } from "@/components/dashboard/JugadorTriadaTags";
import {
  ModalPartidoDisponiblePronto,
  PartidosListOverlay,
} from "@/components/dashboard/PartidosOverlayVista";
import { colorForPosicion } from "@/components/dashboard/posicionColors";
import {
  clubInitialLetter,
  clubPlaceholderStyle,
} from "@/lib/dashboard/clubPhoto";

function jugadoresDelClub(clubName: string, filtrados: JugadorMapa[]) {
  const a = filtrados.filter((j) => j.club === clubName);
  if (a.length > 0) return a;
  return JUGADORES_MAPA_DEMO.filter((j) => j.club === clubName);
}

function ciudadDelClub(clubName: string, filtrados: JugadorMapa[]) {
  return (
    filtrados.find((j) => j.club === clubName)?.ciudad ??
    JUGADORES_MAPA_DEMO.find((j) => j.club === clubName)?.ciudad ??
    "—"
  );
}

type ClubesDashboardCardsProps = {
  clubesStats: ClubMapaStat[];
  jugadoresFiltrados: JugadorMapa[];
  onSelectPlayer?: (jugadorId: number) => void;
};

export function ClubesDashboardCards({
  clubesStats,
  jugadoresFiltrados,
  onSelectPlayer,
}: ClubesDashboardCardsProps) {
  const [clubPartidosAbierto, setClubPartidosAbierto] = useState<string | null>(
    null,
  );
  const [modalPartido, setModalPartido] = useState(false);

  const preparado = useMemo(() => {
    return clubesStats.map((c) => {
      const jugClub = jugadoresDelClub(c.nombre, jugadoresFiltrados);
      const ciudad = ciudadDelClub(c.nombre, jugadoresFiltrados);
      const destacadosRadar = [...jugClub]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      const partidos = getPartidosAgregadosPorClub(c.nombre, jugClub);
      return {
        stat: c,
        ciudad,
        destacadosRadar,
        partidos,
      };
    });
  }, [clubesStats, jugadoresFiltrados]);

  const clubAbierto = useMemo(
    () => preparado.find((p) => p.stat.nombre === clubPartidosAbierto) ?? null,
    [preparado, clubPartidosAbierto],
  );

  const cerrarPartidos = useCallback(() => setClubPartidosAbierto(null), []);

  useEffect(() => {
    if (!clubPartidosAbierto) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [clubPartidosAbierto]);

  useEffect(() => {
    if (!clubPartidosAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarPartidos();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clubPartidosAbierto, cerrarPartidos]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-bold text-[#111111]">Clubes en el radar</h2>
        <p className="mt-1 max-w-2xl text-[11px] leading-snug text-black/45">
          Explorá cada club: identidad visual (demo), sede, jugadores destacados del
          sistema y los partidos analizados (demo).
        </p>
      </div>

      <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {preparado.map(({ stat, ciudad, destacadosRadar }) => (
          <li key={stat.nombre}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
              <div
                className="relative h-36 w-full overflow-hidden"
                style={clubPlaceholderStyle(stat.nombre)}
              >
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-white/30"
                  aria-hidden
                >
                  {clubInitialLetter(stat.nombre)}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <h3 className="absolute bottom-3 left-3 right-3 text-lg font-bold leading-tight text-white drop-shadow">
                  {stat.nombre}
                </h3>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="flex items-center gap-1.5 text-[13px] text-black/65">
                  <svg
                    className="h-4 w-4 shrink-0 text-black/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {ciudad}
                </p>

                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
                    Jugadores destacados
                  </p>
                  {destacadosRadar.length === 0 ? (
                    <p className="mt-1 text-xs text-black/40">Sin datos en el filtro.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {destacadosRadar.map((j) => {
                        const pc = colorForPosicion(j.posicion);
                        return (
                          <li key={j.id}>
                            <button
                              type="button"
                              disabled={!onSelectPlayer}
                              onClick={() => onSelectPlayer?.(j.id)}
                              className="flex w-full items-center gap-2 rounded-lg bg-[#f4f7fa] px-2 py-1.5 text-left transition hover:bg-[#e8eef5] disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={`Abrir perfil de ${j.nombre}`}
                            >
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: pc }}
                              >
                                {j.nombre.trim().charAt(0)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-semibold text-[#111111]">
                                  {j.nombre}
                                </p>
                                <p className="text-[10px] text-black/45">
                                  {j.posicion} · {Math.round(j.rating * 10)}
                                  {onSelectPlayer ? (
                                    <span className="ml-1.5 font-medium text-blue-600">
                                      · Ver perfil
                                    </span>
                                  ) : null}
                                </p>
                                <JugadorTriadaTags j={j} compact />
                              </div>
                              {onSelectPlayer ? (
                                <svg
                                  className="h-4 w-4 shrink-0 text-blue-600/70"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="mt-4 flex-1" />
                <button
                  type="button"
                  onClick={() => setClubPartidosAbierto(stat.nombre)}
                  className="mt-2 w-full rounded-xl bg-emerald-600 py-3 text-center text-[13px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Ver partidos
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {clubesStats.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-black/[0.12] bg-white px-4 py-8 text-center text-sm text-black/45">
          No hay clubes con los filtros actuales del pipeline.
        </p>
      ) : null}

      {clubAbierto ? (
        <PartidosListOverlay
          encabezadoTipo="Partidos del club"
          titulo={clubAbierto.stat.nombre}
          partidos={clubAbierto.partidos}
          onClose={cerrarPartidos}
          onVerPartido={() => setModalPartido(true)}
          onSelectPlayer={onSelectPlayer}
          emptyMessage="No hay partidos demo agrupados para este club con el filtro actual."
        />
      ) : null}

      <ModalPartidoDisponiblePronto
        open={modalPartido}
        onClose={() => setModalPartido(false)}
      />
    </div>
  );
}
