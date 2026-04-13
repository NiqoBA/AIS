"use client";

import type { PartidoClubAgregado } from "@/components/dashboard/clubesPartidosDemo";
import { colorForPosicion } from "@/components/dashboard/posicionColors";
import {
  clubInitialLetter,
  clubPlaceholderStyle,
} from "@/lib/dashboard/clubPhoto";

export function ModalPartidoDisponiblePronto({
  open,
  onClose,
  zClass = "z-[160]",
}: {
  open: boolean;
  onClose: () => void;
  zClass?: string;
}) {
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 ${zClass} flex items-center justify-center bg-black/50 p-4`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-partido-titulo"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="modal-partido-titulo"
          className="text-center text-lg font-semibold text-[#111111]"
        >
          Disponibles muy pronto
        </h2>
        <p className="mt-2 text-center text-sm text-black/55">
          La reproducción y el detalle completo del partido estarán disponibles en una
          próxima versión.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl border border-black/[0.12] py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-black/[0.04]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export function PartidosListOverlay({
  encabezadoTipo,
  titulo,
  partidos,
  onClose,
  onVerPartido,
  onSelectPlayer,
  emptyMessage = "No hay partidos para mostrar.",
  overlayZClass = "z-[140]",
}: {
  encabezadoTipo: string;
  titulo: string;
  partidos: PartidoClubAgregado[];
  onClose: () => void;
  onVerPartido: () => void;
  onSelectPlayer?: (jugadorId: number) => void;
  emptyMessage?: string;
  overlayZClass?: string;
}) {
  return (
    <div
      className={`fixed inset-0 ${overlayZClass} flex flex-col bg-black/45 backdrop-blur-[2px]`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partidos-overlay-titulo"
      onClick={onClose}
    >
      <div
        className="flex min-h-0 flex-1 flex-col bg-[#f0f2f5] sm:mx-auto sm:my-4 sm:max-h-[calc(100vh-2rem)] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-black/[0.08] sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.08] bg-white px-3 py-3 sm:rounded-t-2xl">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.1] text-black/70 transition hover:bg-black/[0.04]"
            aria-label="Volver"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
              {encabezadoTipo}
            </p>
            <h2
              id="partidos-overlay-titulo"
              className="truncate text-base font-bold text-[#111111]"
            >
              {titulo}
            </h2>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {partidos.length === 0 ? (
            <p className="rounded-xl border border-dashed border-black/[0.12] bg-white px-4 py-10 text-center text-sm text-black/45">
              {emptyMessage}
            </p>
          ) : (
            <ul className="space-y-4">
              {partidos.map((p) => (
                <li key={p.key}>
                  <PartidoCard
                    partido={p}
                    onVerPartido={onVerPartido}
                    onSelectPlayer={onSelectPlayer}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function PartidoCard({
  partido,
  onVerPartido,
  onSelectPlayer,
}: {
  partido: PartidoClubAgregado;
  onVerPartido: () => void;
  onSelectPlayer?: (jugadorId: number) => void;
}) {
  return (
    <article className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-black/10 text-lg font-bold text-white/95 shadow-sm sm:h-16 sm:w-16 sm:text-xl"
              style={clubPlaceholderStyle(partido.clubLocal)}
              aria-hidden
            >
              {clubInitialLetter(partido.clubLocal)}
            </div>
            <span className="max-w-[100px] truncate text-center text-[10px] font-medium text-black/55">
              {partido.clubLocal}
            </span>
          </div>
          <div className="flex flex-col items-center px-1">
            <span className="rounded-lg bg-[#111111] px-3 py-1.5 text-lg font-bold tabular-nums text-white sm:text-xl">
              {partido.resultado}
            </span>
            <time
              className="mt-2 text-[11px] tabular-nums text-black/45"
              dateTime={partido.fecha}
            >
              {partido.fecha}
            </time>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-black/10 text-lg font-bold text-white/95 shadow-sm sm:h-16 sm:w-16 sm:text-xl"
              style={clubPlaceholderStyle(partido.clubRival)}
              aria-hidden
            >
              {clubInitialLetter(partido.clubRival)}
            </div>
            <span className="max-w-[100px] truncate text-center text-[10px] font-medium text-black/55">
              {partido.clubRival}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-black/[0.06] pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
          Jugadores destacados (sistema)
        </p>
        {partido.destacados.length === 0 ? (
          <p className="mt-1 text-xs text-black/40">Sin registros para este encuentro.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {partido.destacados.map((d) => (
              <li key={`${d.jugadorId}-${d.club}`}>
                <button
                  type="button"
                  disabled={!onSelectPlayer}
                  onClick={() => onSelectPlayer?.(d.jugadorId)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#f8fafc] py-1 pl-1 pr-2.5 text-left text-[11px] transition hover:border-blue-300/80 hover:bg-blue-50/80 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`Abrir perfil de ${d.nombre}`}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: colorForPosicion(d.posicion) }}
                  >
                    {d.nombre.charAt(0)}
                  </span>
                  <span className="min-w-0 truncate font-medium text-[#111111]">
                    {d.nombre}
                  </span>
                  <span className="shrink-0 text-black/40">·</span>
                  <span className="shrink-0 tabular-nums text-black/45">{d.score100}</span>
                  {onSelectPlayer ? (
                    <span className="shrink-0 pl-0.5 text-[10px] font-semibold text-blue-600">
                      Perfil
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onVerPartido}
        className="mt-4 w-full rounded-xl border-2 border-emerald-600/30 bg-emerald-50/80 py-2.5 text-[13px] font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        Ver partido
      </button>
    </article>
  );
}
