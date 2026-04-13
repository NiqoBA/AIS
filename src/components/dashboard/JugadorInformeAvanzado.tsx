"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import HeatmapJugador from "@/components/HeatmapJugador";
import { getPartidosAgregadosPorJugador } from "@/components/dashboard/clubesPartidosDemo";
import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";
import {
  getInformeJugadorDemo,
  mapaCalorAPosiciones,
} from "@/components/dashboard/jugadorInformeDemo";
import { JugadorTriadaTags } from "@/components/dashboard/JugadorTriadaTags";
import {
  ModalPartidoDisponiblePronto,
  PartidosListOverlay,
} from "@/components/dashboard/PartidosOverlayVista";
import { PlayerRadarChart } from "@/components/dashboard/PlayerRadarChart";
import { colorForPosicion } from "@/components/dashboard/posicionColors";
import { PARTIDO_LINK_CLASS } from "@/lib/dashboard/partidoLink";

type JugadorInformeAvanzadoProps = {
  jugador: JugadorMapa;
  onClose: () => void;
};

function fmtMetersFromCm(cm: number) {
  return `${(cm / 100).toFixed(2).replace(".", ",")} m`;
}

export function JugadorInformeAvanzado({
  jugador: j,
  onClose,
}: JugadorInformeAvanzadoProps) {
  const [partidosOverlay, setPartidosOverlay] = useState(false);
  const [modalPartido, setModalPartido] = useState(false);

  const pc = colorForPosicion(j.posicion);
  const informe = useMemo(() => getInformeJugadorDemo(j), [j]);
  const { fisicoCv } = informe;

  const partidosJugador = useMemo(() => getPartidosAgregadosPorJugador(j), [j]);

  const openPartidos = useCallback(() => setPartidosOverlay(true), []);

  const posicionesHeatmap = useMemo(
    () => mapaCalorAPosiciones(informe.mapaCalor),
    [informe.mapaCalor],
  );

  const partidosOrdenados = useMemo(
    () => [...informe.partidos].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [informe.partidos],
  );

  const chartData = useMemo(
    () =>
      partidosOrdenados.slice(0, 10).map((p) => ({
        label: p.fecha.slice(5),
        rating: p.ratingPartido,
      })),
    [partidosOrdenados],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (modalPartido) {
        setModalPartido(false);
        return;
      }
      if (partidosOverlay) {
        setPartidosOverlay(false);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [modalPartido, partidosOverlay, onClose]);

  const pctPases =
    informe.pasesIntentadosTotal > 0
      ? Math.round(
          (informe.pasesCompletadosTotal / informe.pasesIntentadosTotal) * 100,
        )
      : 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-[#d8dce3]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="informe-jugador-titulo"
    >
      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-black/[0.08] bg-zinc-900 px-3 py-2.5 text-white sm:px-5">
        <button
          type="button"
          onClick={onClose}
          className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al radar
        </button>
        <div className="min-w-0 flex-1 border-l border-white/15 pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
            Curriculum deportivo
          </p>
          <h1
            id="informe-jugador-titulo"
            className="truncate text-base font-bold sm:text-lg"
          >
            {j.nombre}
          </h1>
        </div>
        <span
          className="hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white sm:inline"
          style={{ backgroundColor: pc }}
        >
          {j.posicion}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-4 sm:px-4 sm:py-6">
        <article className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-black/[0.1] bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)]">
          <div className="grid lg:grid-cols-[minmax(260px,1fr)_minmax(0,1.65fr)]">
            {/* Columna CV — datos personales y físicos */}
            <aside className="border-b border-white/10 bg-slate-900 text-white lg:border-b-0 lg:border-r">
              <div className="h-1.5 w-full" style={{ backgroundColor: pc }} />
              <div className="p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                CV deportivo
              </p>

              <div
                className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/15 text-4xl font-bold text-white shadow-lg sm:h-32 sm:w-32 sm:text-5xl"
                style={{ backgroundColor: pc }}
              >
                {j.nombre.trim().charAt(0)}
              </div>

              <h2 className="mt-6 text-center text-xl font-bold leading-tight sm:text-2xl">
                {j.nombre}
              </h2>
              <p className="mt-1 text-center text-sm font-medium text-white/80">
                {j.posicion}
              </p>
              <p className="mt-4 text-center text-xs leading-relaxed text-white/55">
                {j.club}
                <br />
                {j.ciudad}, {j.departamento}
              </p>
              <p className="mt-2 text-center text-xs text-white/45">
                {j.edad} años · Rating global {j.rating.toFixed(1)}/10
              </p>
              <div className="mt-4 flex justify-center">
                <JugadorTriadaTags j={j} />
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                  Cualidades físicas
                </h3>
                <p className="mt-1 text-[10px] leading-snug text-white/35">
                  Valores estimados a partir de edad, posición y modelo demo; no
                  reemplazan medición antropométrica.
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <CvRow label="Altura (estimada)" value={fmtMetersFromCm(fisicoCv.alturaCm)} />
                  <CvRow
                    label="Peso (estimado)"
                    value={`${fisicoCv.pesoEstimadoKg} kg`}
                  />
                  <CvRow
                    label="IMC (estimado)"
                    value={fisicoCv.imc.toFixed(1).replace(".", ",")}
                  />
                  <CvRow label="Pie hábil" value={fisicoCv.pieHabil} />
                </ul>
              </div>
              </div>
            </aside>

            {/* Cuerpo — informe */}
            <div className="bg-[#fafbfc] p-5 sm:p-8">
              <section>
                <h3 className="border-b border-black/[0.08] pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">
                  Perfil profesional
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-black/70">
                  {informe.perfilDetalle}
                </p>
              </section>

              <section className="mt-8">
                <h3 className="border-b border-black/[0.08] pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">
                  Indicadores de rendimiento
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Kpi
                    label="Partidos analizados"
                    value={String(informe.partidosAnalizados)}
                    onValueClick={openPartidos}
                  />
                  <Kpi label="Goles" value={String(informe.golesTotal)} />
                  <Kpi label="Precisión pases" value={`${pctPases}%`} />
                  <Kpi
                    label="Recorrido total"
                    value={`${(informe.recorridoTotalMetros / 1000).toFixed(1)} km`}
                  />
                </div>
              </section>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#111111]">
                    Promedio por{" "}
                    <button
                      type="button"
                      onClick={openPartidos}
                      className={`align-baseline ${PARTIDO_LINK_CLASS}`}
                    >
                      partido
                    </button>
                  </h3>
                  <p className="mt-0.5 text-xs text-black/45">
                    Evolución del rating (escala 5–10).
                  </p>
                  <div className="mt-3 h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="label"
                          tick={{ fill: "rgba(0,0,0,0.45)", fontSize: 10 }}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          domain={[5, 10]}
                          tick={{ fill: "rgba(0,0,0,0.35)", fontSize: 10 }}
                          axisLine={false}
                          tickCount={6}
                          width={28}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid rgba(0,0,0,0.08)",
                            fontSize: 12,
                          }}
                          formatter={(v) => [
                            typeof v === "number" ? v.toFixed(1) : String(v),
                            "Rating",
                          ]}
                        />
                        <Bar dataKey="rating" fill={pc} radius={[4, 4, 0, 0]} maxBarSize={36} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-1 text-center text-[11px] text-black/40">
                    Promedio en{" "}
                    <button
                      type="button"
                      onClick={openPartidos}
                      className={`align-baseline ${PARTIDO_LINK_CLASS}`}
                    >
                      partidos
                    </button>
                    :{" "}
                    <strong className="text-[#111111]">
                      {informe.promedioRatingPartidos.toFixed(1)}
                    </strong>
                  </p>
                </section>

                <section className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#111111]">
                    Competencias (radar)
                  </h3>
                  <p className="mt-0.5 text-xs text-black/45">
                    Técnica, táctica y físico (demo).
                  </p>
                  <PlayerRadarChart
                    tecnica={informe.radar.tecnica}
                    tactica={informe.radar.tactica}
                    fisico={informe.radar.fisico}
                  />
                </section>
              </div>

              <section className="mt-8 rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
                <h3 className="text-sm font-bold text-[#111111]">
                  Experiencia —{" "}
                  <button
                    type="button"
                    onClick={openPartidos}
                    className={`align-baseline ${PARTIDO_LINK_CLASS}`}
                  >
                    partidos analizados
                  </button>
                </h3>
                <p className="mt-0.5 text-xs text-black/45">
                  Detalle por encuentro.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-[11px] sm:text-xs">
                    <thead>
                      <tr className="border-b border-black/[0.08] text-[9px] font-semibold uppercase tracking-wide text-black/45">
                        <th className="py-2 pr-2">Partido</th>
                        <th className="py-2 pr-2">Rival</th>
                        <th className="py-2 pr-2">Comp.</th>
                        <th className="py-2 pr-2">Res.</th>
                        <th className="py-2 pr-1 text-right">Min</th>
                        <th className="py-2 pr-1 text-right">Rat.</th>
                        <th className="py-2 pr-1 text-right">Gol</th>
                        <th className="py-2 pr-1 text-right">Pases</th>
                        <th className="py-2 text-right">Rec.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partidosOrdenados.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-black/[0.05] text-[#111111] last:border-0"
                        >
                          <td className="py-2 pr-2 text-black/55">
                            <button
                              type="button"
                              onClick={openPartidos}
                              className={`tabular-nums ${PARTIDO_LINK_CLASS}`}
                            >
                              {p.fecha}
                            </button>
                          </td>
                          <td className="max-w-[120px] truncate py-2 pr-2" title={p.rival}>
                            {p.rival}
                          </td>
                          <td className="py-2 pr-2 text-black/55">{p.competicion}</td>
                          <td className="py-2 pr-2 font-medium">{p.resultado}</td>
                          <td className="py-2 pr-1 text-right tabular-nums">{p.minutos}</td>
                          <td className="py-2 pr-1 text-right font-semibold tabular-nums">
                            {p.ratingPartido.toFixed(1)}
                          </td>
                          <td className="py-2 pr-1 text-right tabular-nums">{p.goles}</td>
                          <td className="py-2 pr-1 text-right tabular-nums text-black/65">
                            {p.pasesCompletados}/{p.pasesIntentados}
                          </td>
                          <td className="py-2 text-right tabular-nums text-black/65">
                            {(p.recorridoMetros / 1000).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#111111]">
                    Mapa de calor (posicionamiento)
                  </h3>
                  <p className="mt-0.5 text-xs text-black/45">
                    Densidad de presencia sobre la cancha según análisis de
                    tracking (demo). Vista superior: arco izquierdo = defensa,
                    derecha = ataque.
                  </p>
                  <div className="mt-3 flex justify-center overflow-x-auto rounded-lg border border-black/[0.08] bg-[#3d6649] p-2">
                    <HeatmapJugador posiciones={posicionesHeatmap} />
                  </div>
                </section>

                <section className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#111111]">
                    Estadísticas acumuladas
                  </h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-black/[0.05] pb-2">
                      <dt className="text-black/45">Pases completados</dt>
                      <dd className="font-semibold tabular-nums text-[#111111]">
                        {informe.pasesCompletadosTotal}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-black/[0.05] pb-2">
                      <dt className="text-black/45">Pases intentados</dt>
                      <dd className="font-semibold tabular-nums text-[#111111]">
                        {informe.pasesIntentadosTotal}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-black/45">Recorrido acumulado</dt>
                      <dd className="font-semibold tabular-nums text-[#111111]">
                        {(informe.recorridoTotalMetros / 1000).toFixed(2)} km
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          </div>
        </article>
      </div>

      {partidosOverlay ? (
        <PartidosListOverlay
          encabezadoTipo="Partidos del jugador"
          titulo={j.nombre}
          partidos={partidosJugador}
          onClose={() => setPartidosOverlay(false)}
          onVerPartido={() => setModalPartido(true)}
          overlayZClass="z-[210]"
        />
      ) : null}
      <ModalPartidoDisponiblePronto
        open={modalPartido}
        onClose={() => setModalPartido(false)}
        zClass="z-[220]"
      />
    </div>
  );
}

function CvRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-col gap-0.5 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
        {label}
      </span>
      <span className="text-base font-semibold tabular-nums text-white">{value}</span>
    </li>
  );
}

function Kpi({
  label,
  value,
  onValueClick,
}: {
  label: string;
  value: string;
  onValueClick?: () => void;
}) {
  return (
    <div className="rounded-lg border border-black/[0.06] bg-white px-2 py-2 text-center shadow-sm sm:px-3 sm:py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-black/45">
        {label}
      </p>
      {onValueClick ? (
        <button
          type="button"
          onClick={onValueClick}
          className={`mt-0.5 w-full text-sm font-bold tabular-nums sm:text-base ${PARTIDO_LINK_CLASS}`}
        >
          {value}
        </button>
      ) : (
        <p className="mt-0.5 text-sm font-bold tabular-nums text-[#111111] sm:text-base">
          {value}
        </p>
      )}
    </div>
  );
}
