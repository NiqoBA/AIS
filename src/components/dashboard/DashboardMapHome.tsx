"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ClubesDashboardCards } from "@/components/dashboard/ClubesDashboardCards";
import { statsClubesDesdeJugadores } from "@/components/dashboard/clubesMapaStats";
import { DashboardRadarHeader } from "@/components/dashboard/DashboardRadarHeader";
import { useDashboardViewer } from "@/components/dashboard/DashboardViewerContext";
import { JUGADORES_MAPA_DEMO } from "@/components/dashboard/jugadoresMapaData";
import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";
import { JugadorInformeAvanzado } from "@/components/dashboard/JugadorInformeAvanzado";
import { MapaJugadoresLoader } from "@/components/dashboard/MapaJugadoresLoader";
import { JugadorTriadaTags } from "@/components/dashboard/JugadorTriadaTags";
import { colorForPosicion } from "@/components/dashboard/posicionColors";
import { hrefPartidoDemo, PARTIDO_LINK_CLASS } from "@/lib/dashboard/partidoLink";

function uniqSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" }),
  );
}

function modoPosicion(jugadores: { posicion: string }[]): string | null {
  if (jugadores.length === 0) return null;
  const counts = new Map<string, number>();
  for (const j of jugadores) {
    counts.set(j.posicion, (counts.get(j.posicion) ?? 0) + 1);
  }
  let best = "";
  let n = 0;
  for (const [k, v] of counts) {
    if (v > n) {
      n = v;
      best = k;
    }
  }
  return best || null;
}

type TabId = "lista" | "pipeline" | "hoy" | "clubes";

function JugadorMapaCard({
  j,
  selected,
  onSelect,
  compact,
}: {
  j: JugadorMapa;
  selected: boolean;
  onSelect: (id: number) => void;
  compact?: boolean;
}) {
  const pc = colorForPosicion(j.posicion);
  const score100 = Math.round(j.rating * 10);
  return (
    <button
      type="button"
      data-player-row={j.id}
      onClick={() => onSelect(j.id)}
      className={`w-full rounded-lg border bg-white text-left shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition hover:border-black/12 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] ${
        selected
          ? "border-blue-500 ring-2 ring-blue-500/25"
          : "border-black/[0.08]"
      } ${compact ? "p-1.5" : "p-2"}`}
    >
      <div className={`flex ${compact ? "gap-1.5" : "gap-2"}`}>
        <div
          className={`flex shrink-0 items-center justify-center rounded-md font-bold text-white shadow-inner ${
            compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
          }`}
          style={{ backgroundColor: pc }}
        >
          {j.nombre.trim().charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <p
              className={`line-clamp-2 font-semibold leading-tight text-[#111111] ${
                compact ? "text-[11px]" : "text-[13px]"
              }`}
            >
              {j.nombre}
            </p>
            <div
              className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-white shadow-sm tabular-nums ${
                compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]"
              }`}
            >
              {score100}
            </div>
          </div>
          <span
            className={`mt-0.5 inline-block max-w-full truncate rounded-full px-1.5 py-px font-semibold text-white ${
              compact ? "text-[8px]" : "text-[9px]"
            }`}
            style={{ backgroundColor: pc }}
            title={j.posicion}
          >
            {j.posicion}
          </span>
          <JugadorTriadaTags j={j} compact />
          <p
            className={`line-clamp-1 text-black/50 ${
              compact ? "mt-0.5 text-[9px]" : "mt-1 text-[10px]"
            }`}
          >
            {j.ciudad}, {j.departamento}
          </p>
          {!compact ? (
            <>
              <p className="line-clamp-2 text-[10px] leading-snug text-black/45">
                {j.club}
              </p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                <span className="rounded bg-black/[0.05] px-1 py-px text-[9px] font-medium text-black/55">
                  {j.edad}a
                </span>
              </div>
            </>
          ) : (
            <p className="mt-0.5 line-clamp-1 text-[8px] text-black/45">{j.club}</p>
          )}
        </div>
      </div>
    </button>
  );
}

export function DashboardMapHome() {
  const searchParams = useSearchParams();
  const { displayName } = useDashboardViewer();
  const [tab, setTab] = useState<TabId>("clubes");
  const [searchQuery, setSearchQuery] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [club, setClub] = useState("");
  const [posicion, setPosicion] = useState("");
  const [ordenPuntaje, setOrdenPuntaje] = useState<"desc" | "asc">("desc");
  const [mapaVisible, setMapaVisible] = useState(false);
  const [clubListQuery, setClubListQuery] = useState("");
  const [focusRequest, setFocusRequest] = useState<{
    playerId: number;
    nonce: number;
  } | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "lista" || t === "pipeline" || t === "hoy" || t === "clubes") {
      setTab(t);
    }
  }, [searchParams]);

  const departamentos = useMemo(
    () => uniqSorted(JUGADORES_MAPA_DEMO.map((j) => j.departamento)),
    [],
  );

  const ciudadesDisponibles = useMemo(() => {
    const base = departamento
      ? JUGADORES_MAPA_DEMO.filter((j) => j.departamento === departamento)
      : JUGADORES_MAPA_DEMO;
    return uniqSorted(base.map((j) => j.ciudad));
  }, [departamento]);

  const clubs = useMemo(
    () => uniqSorted(JUGADORES_MAPA_DEMO.map((j) => j.club)),
    [],
  );

  const posiciones = useMemo(
    () => uniqSorted(JUGADORES_MAPA_DEMO.map((j) => j.posicion)),
    [],
  );

  const jugadoresFiltrados = useMemo(() => {
    let list = JUGADORES_MAPA_DEMO.filter((j) => {
      if (departamento && j.departamento !== departamento) return false;
      if (ciudad && j.ciudad !== ciudad) return false;
      if (club && j.club !== club) return false;
      if (posicion && j.posicion !== posicion) return false;
      return true;
    });

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (j) =>
          j.nombre.toLowerCase().includes(q) ||
          j.ciudad.toLowerCase().includes(q) ||
          j.club.toLowerCase().includes(q) ||
          j.departamento.toLowerCase().includes(q),
      );
    }

    list = [...list].sort((a, b) =>
      ordenPuntaje === "desc" ? b.rating - a.rating : a.rating - b.rating,
    );
    return list;
  }, [
    departamento,
    ciudad,
    club,
    posicion,
    ordenPuntaje,
    searchQuery,
  ]);

  const clubesStats = useMemo(
    () => statsClubesDesdeJugadores(jugadoresFiltrados),
    [jugadoresFiltrados],
  );

  const clubesStatsFiltrados = useMemo(() => {
    const q = clubListQuery.trim().toLowerCase();
    if (!q) return clubesStats;
    return clubesStats.filter((c) => c.nombre.toLowerCase().includes(q));
  }, [clubesStats, clubListQuery]);

  const destacados = useMemo(
    () => jugadoresFiltrados.filter((j) => j.rating >= 8).length,
    [jugadoresFiltrados],
  );

  const topPosicion = useMemo(
    () => modoPosicion(jugadoresFiltrados),
    [jugadoresFiltrados],
  );

  const scoreProm0a100 = useMemo(() => {
    if (jugadoresFiltrados.length === 0) return null;
    const sum = jugadoresFiltrados.reduce((a, j) => a + j.rating, 0);
    return Math.round((sum / jugadoresFiltrados.length) * 10);
  }, [jugadoresFiltrados]);

  const onDepartamentoChange = useCallback((v: string) => {
    setDepartamento(v);
    setCiudad("");
  }, []);

  const seleccionarJugador = useCallback((id: number) => {
    setSelectedPlayerId(id);
    setDetalleAbierto(true);
    setTab("lista");
    setFocusRequest((prev) => ({
      playerId: id,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  /** Abre el curriculum sin cambiar de pestaña (desde cards de clubes). */
  const abrirPerfilJugador = useCallback((id: number) => {
    setSelectedPlayerId(id);
    setDetalleAbierto(true);
    setFocusRequest((prev) => ({
      playerId: id,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  useEffect(() => {
    if (tab !== "lista" || selectedPlayerId == null) return;
    const raf = requestAnimationFrame(() => {
      document
        .querySelector(`[data-player-row="${selectedPlayerId}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [selectedPlayerId, tab, jugadoresFiltrados]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "clubes", label: "Clubes" },
    { id: "lista", label: "Lista" },
    { id: "pipeline", label: "Pipeline" },
    { id: "hoy", label: "Hoy" },
  ];

  const jugadorDetalle =
    selectedPlayerId != null
      ? JUGADORES_MAPA_DEMO.find((j) => j.id === selectedPlayerId)
      : undefined;

  const listaEnPanelIzquierdo = tab === "lista" && mapaVisible;
  const gridListaCompleta = tab === "lista" && !mapaVisible;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#f4f7fa]">
      <DashboardRadarHeader
        viewerName={displayName || "Usuario"}
        totalVisibles={jugadoresFiltrados.length}
        destacados={destacados}
        topPosicion={topPosicion}
        scoreProm0a100={scoreProm0a100}
      />

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-black/[0.08] bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
          Vista
        </p>
        <button
          type="button"
          onClick={() => setMapaVisible((v) => !v)}
          aria-pressed={mapaVisible}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
            mapaVisible
              ? "border-blue-500 bg-blue-50 text-blue-800"
              : "border-black/[0.12] bg-white text-black/70 hover:border-black/20"
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Mapa
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex min-h-0 w-full min-w-0 flex-col border-black/[0.06] bg-white max-lg:max-h-[30vh] max-lg:border-b lg:w-[220px] lg:max-w-[240px] lg:flex-none lg:shrink-0 lg:border-r xl:w-[240px]">
          <div className="shrink-0 border-b border-black/[0.08] px-2 pt-1.5">
            <div className="flex flex-wrap gap-0">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative px-2 py-1.5 text-xs font-medium transition ${
                    tab === t.id
                      ? "text-blue-600"
                      : "text-black/45 hover:text-black/70"
                  }`}
                >
                  {t.label}
                  {tab === t.id ? (
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-blue-600" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {tab === "hoy" ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <p className="text-sm font-medium text-[#111111]">Próximamente</p>
              <p className="mt-2 max-w-xs text-xs text-black/45">
                Acá verás{" "}
                <Link
                  href={hrefPartidoDemo("hoy-agenda")}
                  className={PARTIDO_LINK_CLASS}
                >
                  partidos del día
                </Link>
                , alertas y seguimiento en vivo.
              </p>
            </div>
          ) : tab === "clubes" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2.5">
              <label className="block text-[10px] font-medium uppercase tracking-wide text-black/50">
                Buscar club
                <input
                  type="search"
                  value={clubListQuery}
                  onChange={(e) => setClubListQuery(e.target.value)}
                  placeholder="Nombre…"
                  className="mt-0.5 w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] px-2 py-1.5 text-xs text-[#111111] outline-none placeholder:text-black/35 focus:border-blue-500/40 focus:bg-white"
                />
              </label>
              <p className="text-[10px] leading-snug text-black/45">
                {mapaVisible ? (
                  <>
                    La lista de clubes está en el panel principal. Podés desactivar{" "}
                    <strong className="text-[#111111]">Mapa</strong> para más espacio.
                  </>
                ) : (
                  <>
                    Activá <strong className="text-[#111111]">Mapa</strong> arriba para
                    ver jugadores en el territorio.
                  </>
                )}
              </p>
            </div>
          ) : tab === "pipeline" ? (
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5">
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                <label className="block text-[10px] font-medium uppercase tracking-wide text-black/50">
                  Departamento
                  <select
                    value={departamento}
                    onChange={(e) => onDepartamentoChange(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-black/[0.1] bg-white px-1.5 py-1.5 text-xs text-[#111111] outline-none focus:border-blue-500/40"
                  >
                    <option value="">Todos</option>
                    {departamentos.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[10px] font-medium uppercase tracking-wide text-black/50">
                  Ciudad
                  <select
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-black/[0.1] bg-white px-1.5 py-1.5 text-xs text-[#111111] outline-none focus:border-blue-500/40"
                  >
                    <option value="">Todas</option>
                    {ciudadesDisponibles.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[10px] font-medium uppercase tracking-wide text-black/50">
                  Club
                  <select
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-black/[0.1] bg-white px-1.5 py-1.5 text-xs text-[#111111] outline-none focus:border-blue-500/40"
                  >
                    <option value="">Todos</option>
                    {clubs.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[10px] font-medium uppercase tracking-wide text-black/50">
                  Posición
                  <select
                    value={posicion}
                    onChange={(e) => setPosicion(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-black/[0.1] bg-white px-1.5 py-1.5 text-xs text-[#111111] outline-none focus:border-blue-500/40"
                  >
                    <option value="">Todas</option>
                    {posiciones.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[10px] font-medium uppercase tracking-wide text-black/50 sm:col-span-2 lg:col-span-1">
                  Ordenar por puntaje
                  <select
                    value={ordenPuntaje}
                    onChange={(e) =>
                      setOrdenPuntaje(e.target.value as "desc" | "asc")
                    }
                    className="mt-0.5 w-full rounded-md border border-black/[0.1] bg-white px-1.5 py-1.5 text-xs text-[#111111] outline-none focus:border-blue-500/40"
                  >
                    <option value="desc">Mayor a menor</option>
                    <option value="asc">Menor a mayor</option>
                  </select>
                </label>
              </div>
              <p className="text-[10px] leading-snug text-black/40">
                Volvé a{" "}
                <button
                  type="button"
                  className="font-medium text-blue-600 underline"
                  onClick={() => setTab("lista")}
                >
                  Lista
                </button>{" "}
                para ver resultados.
              </p>
            </div>
          ) : (
            <>
              <div className="shrink-0 space-y-2 border-b border-black/[0.08] p-2.5">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/45">
                      Jugadores
                    </p>
                    <p className="truncate text-xs font-semibold text-[#111111]">
                      {jugadoresFiltrados.length}/{JUGADORES_MAPA_DEMO.length}{" "}
                      jug.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("pipeline")}
                    className="shrink-0 rounded-md border border-black/[0.1] p-1.5 text-black/55 transition hover:bg-black/[0.04] hover:text-[#111111]"
                    aria-label="Abrir filtros"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <svg
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar…"
                    className="w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] py-2 pl-8 pr-2 text-xs text-[#111111] outline-none placeholder:text-black/35 focus:border-blue-500/40 focus:bg-white"
                  />
                </div>
              </div>

              {listaEnPanelIzquierdo ? (
                <ul className="min-h-0 flex-1 list-none space-y-2 overflow-y-auto p-2.5 pt-2">
                  {jugadoresFiltrados.length === 0 ? (
                    <li className="rounded-lg border border-dashed border-black/[0.12] px-2 py-8 text-center text-xs text-black/45">
                      No hay jugadores con esos criterios.
                    </li>
                  ) : (
                    jugadoresFiltrados.map((j) => (
                      <li key={j.id}>
                        <JugadorMapaCard
                          j={j}
                          selected={selectedPlayerId === j.id}
                          onSelect={seleccionarJugador}
                        />
                      </li>
                    ))
                  )}
                </ul>
              ) : gridListaCompleta ? (
                <div className="shrink-0 border-b border-black/[0.08] p-2.5 text-[11px] text-black/50">
                  Listado en grilla de 5 columnas al lado. Usá la búsqueda arriba.
                </div>
              ) : null}
            </>
          )}
        </aside>

        <div className="relative min-h-0 flex-1 bg-neutral-200 lg:min-w-0">
          {tab === "lista" && !mapaVisible ? (
            <div className="h-full min-h-0 overflow-y-auto p-2 sm:p-3">
              {jugadoresFiltrados.length === 0 ? (
                <p className="rounded-lg border border-dashed border-black/[0.12] bg-white px-4 py-12 text-center text-sm text-black/45">
                  No hay jugadores con esos criterios.
                </p>
              ) : (
                <ul className="grid list-none grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {jugadoresFiltrados.map((j) => (
                    <li key={j.id}>
                      <JugadorMapaCard
                        j={j}
                        selected={selectedPlayerId === j.id}
                        onSelect={seleccionarJugador}
                        compact
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : tab === "clubes" && !mapaVisible ? (
            <div className="h-full min-h-0 overflow-y-auto p-3 sm:p-4">
              <ClubesDashboardCards
                clubesStats={clubesStatsFiltrados}
                jugadoresFiltrados={jugadoresFiltrados}
                onSelectPlayer={abrirPerfilJugador}
              />
            </div>
          ) : (tab === "pipeline" || tab === "hoy") && !mapaVisible ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="max-w-sm text-sm text-black/55">
                El mapa está oculto. Mostralo para ver la ubicación geográfica de los
                jugadores filtrados.
              </p>
              <button
                type="button"
                onClick={() => setMapaVisible(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Mostrar mapa
              </button>
            </div>
          ) : mapaVisible ? (
            <MapaJugadoresLoader
              fullScreen
              jugadores={jugadoresFiltrados}
              focusRequest={focusRequest}
              selectedPlayerId={selectedPlayerId}
              onPlayerSelect={seleccionarJugador}
            />
          ) : null}
        </div>
      </div>

      {detalleAbierto && jugadorDetalle ? (
        <JugadorInformeAvanzado
          jugador={jugadorDetalle}
          onClose={() => setDetalleAbierto(false)}
        />
      ) : null}
    </div>
  );
}
